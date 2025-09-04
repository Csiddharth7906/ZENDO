import axios from 'axios';

// Create axios instance with base URL and credentials for cookie-based auth
const api = axios.create({
  baseURL: 'https://zendo-2.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: function (status) {
    return status < 500;
  }
});

// Ensure cookies are always sent
api.defaults.withCredentials = true;

// Request interceptor for debugging (no token management needed with cookies)
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.method?.toUpperCase(), config.url);
    console.log('Request headers:', config.headers);
    console.log('WithCredentials:', config.withCredentials);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      console.error('Error response headers:', error.response.headers);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        console.error('Unauthorized access - redirecting to login');
        // Clear any cached user state and redirect
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;