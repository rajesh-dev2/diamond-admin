import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../index';
import { baseURL } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { LoginCredentials, LoginResponse } from '@/types/auth.types';
import { UserProfile, UserRole } from '@/types/user.types';
import { logout } from './authSlice';

interface LoginApiResponse {
  success: boolean;
  token: string;
  data: {
    id: string;
    name: string;
    username: string;
    userType: string;
  };
}

interface MeApiResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    username: string;
    userType: string;
    isActive: boolean;
    balance: number;
    exposure: number;
    city: string | null;
    phone: string | null;
    creditReference: string | null;
    minBet: number;
    maxBet: number;
    betDelay: number;
    createdAt: string;
  };
}

const VALID_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'SUPER_MASTER', 'MASTER', 'AGENT', 'CLIENT'];

const USER_TYPE_ALIASES: Record<string, UserRole> = {
  SUPERADMIN: 'SUPER_ADMIN',
  SUPERMASTER: 'SUPER_MASTER',
};

function toUserRole(userType: string): UserRole {
  const normalized = userType?.toUpperCase().replace(/\s+/g, '_') as UserRole;
  if (VALID_ROLES.includes(normalized)) return normalized;
  return USER_TYPE_ALIASES[userType?.toUpperCase()] ?? 'ADMIN';
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('ngrok-skip-browser-warning', 'true');
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logout());
    if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/admin') {
      window.location.href = '/login';
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Client', 'Market', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginApiResponse): LoginResponse => ({
        token: response.token,
        user: {
          id: response.data.id,
          username: response.data.username,
          name: response.data.name,
          email: '',
          role: toUserRole(response.data.userType),
          balance: 0,
          exposure: 0,
          creditLimit: 0,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        },
      }),
    }),
    getMe: builder.query<UserProfile, void>({
      query: () => API_ENDPOINTS.AUTH.ME,
      transformResponse: (response: MeApiResponse): UserProfile => ({
        id: response.data._id,
        username: response.data.username,
        name: response.data.name,
        email: '',
        role: toUserRole(response.data.userType),
        balance: response.data.balance ?? 0,
        exposure: response.data.exposure ?? 0,
        creditLimit: 0,
        status: response.data.isActive ? 'ACTIVE' : 'INACTIVE',
        createdAt: response.data.createdAt,
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = apiSlice;
