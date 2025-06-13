import axios from 'axios';
import { useAuthStore } from '@/stores/Auth';

const apiClient = axios.create({
    baseURL: 'http://localhost:5050/api/v1/users',
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;