import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/api.js';
import { getAuthToken, removeAuthToken, setAuthToken } from '../utils/auth.js';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await api.post('/users/refresh-token');
        const { accessToken } = response.data.data;
        
        setAuthToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        removeAuthToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Don't show toast for certain endpoints
    const silentEndpoints = ['/users/current-user', '/users/refresh-token'];
    const isSilentEndpoint = silentEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    );

    if (!isSilentEndpoint && error.response?.status !== 401) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;