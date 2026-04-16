import createApi from '@/app/api/axiosBaseQuery';
import type {
  LoginRequest,
  LoginResponse,
  ProfileData,
  SignupPayload,
} from './type';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { useAuthStore } from './authStore';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await getRefreshToken();
      if (response.isSuccess) {
        setToken(response.data.token);
      } else {
        // Handle error
      }

      return response;
    },
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
// Get Current User
const getUser = createApi<null, ProfileData>({
  url: '/api/Account/GetCurrentUser',
  method: 'GET',
});

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const response = await getUser();

      if (!response.isSuccess) {
        throw new Error('Failed to fetch user');
      }

      return response.data;
    },
  });
};
