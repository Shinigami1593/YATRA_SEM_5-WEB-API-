import axios from '../services/axios';
import { useRouter } from 'vue-router';

const AuthService = {
  async register(formData) {
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      };
      const response = await axios.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post('/users/login', credentials);
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout() {
    localStorage.removeItem('token');
    const router = useRouter();
    router.push('/login');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  async getUser() {
    try {
      const response = await axios.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  }
};

export default AuthService;