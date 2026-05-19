// store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './type';

const initialState: AuthState = {
  token: 'initial-token',
  isAuthenticated: false,
  id: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; userId: string }>,
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userId = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
