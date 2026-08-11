import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser as setAuthUser, logout as logoutAuth } from '@/store/slices/authSlice';
import { UserProfile } from '@/types/user.types';

export interface UserStoreState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null, token?: string | null) => void;
  logout: () => void;
}

export function useUserStore(): UserStoreState;
export function useUserStore<T>(selector: (state: UserStoreState) => T): T;
export function useUserStore<T>(selector?: (state: UserStoreState) => T): T | UserStoreState {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const storeObj: UserStoreState = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    setUser: (user: UserProfile | null, token?: string | null) =>
      dispatch(setAuthUser({ user, token })),
    logout: () => dispatch(logoutAuth()),
  };

  if (selector) {
    return selector(storeObj);
  }
  return storeObj;
}

useUserStore.getState = (): UserStoreState => {
  const state = store.getState().auth;
  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    setUser: (user: UserProfile | null, token?: string | null) =>
      store.dispatch(setAuthUser({ user, token })),
    logout: () => store.dispatch(logoutAuth()),
  };
};
