import { axiosBaseAPI } from '@/app/api/axiosBaseQuery';
import type { LoginRequest, SignupPayload } from './type';
import UUID from '@/utils/generateUUID';
import { logout as logoutAction, setToken } from './authSlice';

const enhancedApi = axiosBaseAPI.enhanceEndpoints({
  addTagTypes: ['token'],
});
export const authApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials: LoginRequest) => ({
        url: '/api/Authentication/Login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: build.mutation({
      query: () => ({
        url: '/api/Authentication/RefreshToken',
        method: 'POST',
        headers: {
          skipAuth: 'true',
          'X-Idempotency-Key': `${UUID()}-refresh-token-${Date.now()}`,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          // Success! Update your store
          if (data?.token) {
            dispatch(setToken(data.token));
          }

          return;
        } catch {
          // Error! Handle refresh failure
          dispatch(logoutAction());
          return;
        }
      },
    }),
    signup: build.mutation({
      query: (credentials: SignupPayload) => ({
        url: '/api/Authentication/CreateUser',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: '/api/Account/Logout',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useSignupMutation,
  useLogoutMutation,
} = authApi;

export const {
  endpoints: { login, logout, refreshToken, signup },
} = authApi;
