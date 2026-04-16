import createApi from '@/app/api/axiosBaseQuery';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './authStore';
import type {
  LoginRequest,
  LoginResponse,
  ProfileData,
  SignupPayload,
} from './type';
import { set } from 'zod';

// Auth
const login = createApi<LoginRequest, LoginResponse>({
  url: '/api/Authentication/Login',
  method: 'POST',
});

export const useLogin = () => {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // Prepare the complete request data
      const requestData: LoginRequest = {
        userName: credentials.userName,
        password: credentials.password,
        forceLogin: credentials.forceLogin || false,
      };

      const response = await login(requestData);
      if (response.isSuccess) {
        setToken(response.data.token);
        navigate(from, { replace: true });
      } else {
        // Handle error
      }

      return response;
    },
  });
};

// Refresh Token
const getRefreshToken = createApi<undefined, { token: string }>({
  url: '/api/Authentication/RefreshToken',
  method: 'POST',
});

export const useRefreshToken = () => {
  const { setToken, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['refreshToken', isAuthenticated],
    queryFn: async () => {
      console.log('refreshToken', 'isAuthenticated:', isAuthenticated);
      if (!isAuthenticated) {
        const response = await getRefreshToken();
        if (response.isSuccess) {
          setToken(response.data.token);
        } else {
          setToken(null);
        }
        return response;
      }
      return null;
    },
    enabled: !isAuthenticated, // Only run when not authenticated
    retry: false,
  });
};

const signup = createApi<SignupPayload, null>({
  url: '/api/Authentication/CreateUser',
  method: 'POST',
});

export const useSignup = () => {
  return useMutation({
    mutationFn: async (credentials: SignupPayload) => {
      const response = await signup(credentials);
      console.log(response);
      return response;
    },
  });
};

const logout = createApi<undefined, null>({
  url: '/api/Account/Logout',
  method: 'GET',
});

export const useLogout = () => {
  const { setToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await logout();

      if (!response.isSuccess) {
        throw new Error('Logout failed');
      }

      return response;
    },
    onSuccess: async () => {
      setToken(null);
      // This will trigger a refetch because the query key changed
      await queryClient.invalidateQueries({ queryKey: ['refreshToken'] });
    },
  });
};
