import axios from 'axios';
import Cookies from 'js-cookie';

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
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
