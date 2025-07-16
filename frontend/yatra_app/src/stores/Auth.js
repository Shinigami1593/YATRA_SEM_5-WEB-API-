// auth.js (Pinia store)
import { defineStore } from 'pinia';
import { userApiClient, adminApiClient } from '../services/axios'; // Correct imports

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null,
    user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || null),
    role: localStorage.getItem('role') || sessionStorage.getItem('role') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getRole: (state) => state.role,
  },

  actions: {
    async login(credentials, rememberMe = false) {
      try {
        let response;
        // Try admin login first
        try {
          response = await adminApiClient.post('/login', credentials);
        } catch (error) {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.message === 'Invalid credentials'
          ) {
            // Try user login
            response = await userApiClient.post('/login', credentials);
          } else {
            throw error;
          }
        }

        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        // Decode token to get role
        if (token) {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          this.role = decodedPayload.role || 'user';
        }

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', token);
        storage.setItem('user', JSON.stringify(user));
        storage.setItem('role', this.role);

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
          firstName: formData.firstName,
          lastName: formData.lastName,
        };
        const response = await userApiClient.post('/register', payload);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        if (token) {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          this.role = decodedPayload.role || 'user';
        }

        const storage = true ? localStorage : sessionStorage;
        storage.setItem('authToken', token);
        storage.setItem('user', JSON.stringify(user));
        storage.setItem('role', this.role);

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