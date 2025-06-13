import { defineStore } from 'pinia';
import axios from '../services/axios'; // your axios instance

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null,
    user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || null),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },

  actions: {
    async login(credentials, rememberMe = false) {
      try {
        const response = await axios.post('/login', credentials);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', token);
        storage.setItem('user', JSON.stringify(user));

        const otherStorage = rememberMe ? sessionStorage : localStorage;
        otherStorage.removeItem('authToken');
        otherStorage.removeItem('user');

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
        await axios.post('/register', payload);
      } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    },
  },
});
