import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// 1. Read the base URL from the environment variable
const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;