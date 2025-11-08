import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  // The proxy in vite.config.js will handle redirecting this to localhost:8080
  baseURL: '/api', 
});

// This is an interceptor. It runs before every request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from our Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;