import { defineStore } from 'pinia';
import axios from '../services/axios'; // your axios instance

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null,
    user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || null),
    role: localStorage.getItem('role') || sessionStorage.getItem('role') || null, // Add role to state
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getRole: (state) => state.role, // Add getter for role
  },

  actions: {
    async login(credentials, rememberMe = false) {
      try {
        const response = await axios.post('/login', credentials);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        // Decode token to get role (manual JWT payload extraction)
        if (token) {
          const payload = token.split('.')[1]; // Get the payload part of the JWT
          const decodedPayload = JSON.parse(atob(payload)); // Decode base64
          this.role = decodedPayload.role; // Store the role
        }

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', token);
        storage.setItem('user', JSON.stringify(user));
        storage.setItem('role', this.role); // Store role

        const otherStorage = rememberMe ? sessionStorage : localStorage;
        otherStorage.removeItem('authToken');
        otherStorage.removeItem('user');
        otherStorage.removeItem('role');
      } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
      }
    },

    async register(formData) {
      try {
        const payload = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        };
        const response = await axios.post('/register', payload); // Define response
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        // Decode token to get role (manual JWT payload extraction)
        if (token) {
          const payload = token.split('.')[1]; // Get the payload part of the JWT
          const decodedPayload = JSON.parse(atob(payload)); // Decode base64
          this.role = decodedPayload.role; // Store the role
        }

        const storage = true ? localStorage : sessionStorage; // Default to localStorage for register (adjust if needed)
        storage.setItem('authToken', token);
        storage.setItem('user', JSON.stringify(user));
        storage.setItem('role', this.role); // Store role

        const otherStorage = true ? sessionStorage : localStorage;
        otherStorage.removeItem('authToken');
        otherStorage.removeItem('user');
        otherStorage.removeItem('role');
      } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('role');
    },
  },
});