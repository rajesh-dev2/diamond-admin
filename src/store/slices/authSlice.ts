import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/user.types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'diamond_admin_auth';

function loadPersistedAuth(): { user: UserProfile | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    return { user: parsed.user ?? null, token: parsed.token ?? null };
  } catch {
    return { user: null, token: null };
  }
}

function persistAuth(user: UserProfile | null, token: string | null) {
  if (typeof window === 'undefined') return;
  if (user && token) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

const persisted = loadPersistedAuth();

const initialState: AuthState = {
  user: persisted.user,
  token: persisted.token,
  isAuthenticated: !!(persisted.user && persisted.token),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: UserProfile | null; token?: string | null }>
    ) => {
      const token = action.payload.token ?? null;
      state.user = action.payload.user;
      state.token = token;
      state.isAuthenticated = !!action.payload.user && !!token;
      persistAuth(state.user, state.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      persistAuth(null, null);
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      persistAuth(state.user, state.token);
    },
  },
});

export const { setUser, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
