import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const hostname = window.location.hostname;
  if (hostname.includes('render')) {
    return 'https://mealplanner-backend-w8ma.onrender.com/api';
  }
  if (hostname.includes('mealplanner.com')) {
    return 'https://api.mealplanner.com/api';
  }

  return 'http://localhost:4000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
