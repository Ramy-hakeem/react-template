import { useDispatch, useSelector } from 'react-redux';
import type { AuthState } from './type';
import { logout, setToken } from './authSlice';

export function useAuthStore() {
  const state = useSelector((state: { auth: AuthState }) => state.auth);
  const dispatch = useDispatch();
  const setTokenAction = (token: string) => {
    dispatch(setToken(token));
  };
  const logoutAction = () => {
    dispatch(logout());
  };
  return {
    ...state,
    setToken: setTokenAction,
    logout: logoutAction,
  };
}
