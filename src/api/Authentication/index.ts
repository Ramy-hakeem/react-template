import type { LoginRequest, LoginResponse } from './type';
import createApi from '../axiosBaseQuery';
import { useMutation } from '@tanstack/react-query';

// Auth
const login = createApi<LoginRequest, LoginResponse>({
  url: '/api/Authentication/Login',
  method: 'POST',
});
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
  });
};
