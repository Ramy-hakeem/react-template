import { useDispatch, useSelector } from 'react-redux';
import type { AuthState } from './type';
import { logout, login } from './authSlice';

export function useAuthStore() {
  const state = useSelector((state: { auth: AuthState }) => state.auth);
  const dispatch = useDispatch();
  const loginAction = (token: string) => {
    dispatch(login({ token, userId: state.userId }));
  };
  const logoutAction = () => {
    dispatch(logout());
  };
  return {
    ...state,
    login: loginAction,
    logout: logoutAction,
  };
}
