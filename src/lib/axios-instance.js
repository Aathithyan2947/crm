import axios from 'axios';
import { storage } from './localstorage';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.cancelTokens = {};

axiosInstance.generateCancelToken = (key) => {
  if (axiosInstance.cancelTokens[key]) {
    axiosInstance.cancelTokens[key].cancel('Cancelled due to new request');
  }

  const source = axios.CancelToken.source();
  axiosInstance.cancelTokens[key] = source;

  return source.token;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If error is 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Clear local storage
      storage.remove('auth_token');
      storage.clear(); // optional: clear everything

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
