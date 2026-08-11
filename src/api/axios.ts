import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.sky99.co/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
