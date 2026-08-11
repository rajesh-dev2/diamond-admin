import { api } from '@/api/api';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { LoginCredentials, LoginResponse } from '@/types/auth.types';

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const username = credentials.username?.trim();
    const password = credentials.password?.trim();

    if (username !== 'demo' || password !== 'admin') {
      return Promise.reject(new Error('Invalid username or password'));
    }

    return Promise.resolve({
      user: {
        id: 'usr_demo',
        username: 'demo',
        name: 'Demo Admin',
        email: 'demo@riceexch.com',
        role: 'ADMIN',
        balance: 254800.5,
        exposure: 18200.0,
        creditLimit: 500000.0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-auth-token-12345',
    });
  },

  logout: async (): Promise<void> => {
    return Promise.resolve();
  },
};
