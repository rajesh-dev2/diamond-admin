import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setTheme as setThemeAction, ThemeMode } from '@/store/slices/themeSlice';

export interface ThemeStoreState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export function useThemeStore(): ThemeStoreState;
export function useThemeStore<T>(selector: (state: ThemeStoreState) => T): T;
export function useThemeStore<T>(selector?: (state: ThemeStoreState) => T): T | ThemeStoreState {
  const themeState = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  const storeObj: ThemeStoreState = {
    theme: themeState.theme,
    setTheme: (theme: ThemeMode) => dispatch(setThemeAction(theme)),
  };

  if (selector) {
    return selector(storeObj);
  }
  return storeObj;
}

useThemeStore.getState = (): ThemeStoreState => {
  const state = store.getState().theme;
  return {
    theme: state.theme,
    setTheme: (theme: ThemeMode) => store.dispatch(setThemeAction(theme)),
  };
};
