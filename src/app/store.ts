import {
  combineReducers,
  configureStore,
  type UnknownAction,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authReducer, { logout } from '@/features/auth/authSlice';
import { BaseAPI } from './api/baseApi';

const appReducer = combineReducers({
  [BaseAPI.reducerPath]: BaseAPI.reducer,
  auth: authReducer,
});
export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (
  state: RootState | undefined,
  action: UnknownAction,
): RootState => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      BaseAPI.middleware,
      // ...(import.meta.env.DEV ? [logger] : []),
    ),
  devTools: !import.meta.env.PROD,
});
