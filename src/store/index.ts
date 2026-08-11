import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sidebarReducer from './slices/sidebarSlice';
import themeReducer from './slices/themeSlice';
import sportsTreeReducer from './slices/sportsTreeSlice';
import { apiSlice } from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
    theme: themeReducer,
    sportsTree: sportsTreeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
