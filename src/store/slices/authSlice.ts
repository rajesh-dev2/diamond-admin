import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/user.types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_pwdemm1',
  username: 'pwdemm1',
  name: 'pwdemm1',
  email: 'pwdemm1@riceexch.com',
  role: 'ADMIN',
  balance: 254800.5,
  exposure: 18200.0,
  creditLimit: 500000.0,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
};

const initialState: AuthState = {
  user: DEFAULT_USER,
  token: 'mock-auth-jwt-token',
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: UserProfile | null; token?: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token !== undefined ? action.payload.token : 'mock-auth-jwt-token';
      state.isAuthenticated = !!action.payload.user;
    },
    logout: (state) => {
      if (typeof window !== 'undefined') {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
