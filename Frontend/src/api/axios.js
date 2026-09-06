import axios from 'axios';

// Base API instance configured with default settings
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor: Attach JWT token from localStorage to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle common errors such as 401 unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local auth data
      const token = localStorage.getItem('wg_token');
      if (token) {
        localStorage.removeItem('wg_token');
        localStorage.removeItem('wg_user');
        window.dispatchEvent(new Event('wg-auth-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
