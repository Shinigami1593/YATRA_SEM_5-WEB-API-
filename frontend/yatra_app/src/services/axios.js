import axios from 'axios';
  import { useAuthStore } from '@/stores/Auth';

  // User API Client
  export const userApiClient = axios.create({
    baseURL: 'http://localhost:5050/api/v1/auth/users',
  });

  // Admin API Client
  export const adminApiClient = axios.create({
    baseURL: 'http://localhost:5050/api/v1/auth/admin',
  });

  // export const routeApiClient = axios.create({
  //   baseURL: 'http://localhost:5050/api/v1/auth/route',
  // });

  // Add request interceptor for both clients
  [userApiClient, adminApiClient].forEach(client => {
    client.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore();
        if (authStore.token) {
          config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  });

  export default userApiClient; // Default export for backward compatibility if needed