import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

export function setupInterceptors() {
  // Request Interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = store.getState().auth.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response Interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/admin'
        ) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
}

// Automatically setup interceptors
setupInterceptors();
