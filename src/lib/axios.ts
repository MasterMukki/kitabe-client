import { config } from '@/config';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: config.baseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 100000,
});

// Optional: Add interceptors
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    console.error('Axios error:', err);
    return Promise.reject(err);
  }
);

export default axiosInstance;
