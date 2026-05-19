import type { LoginRequest, SignupPayload } from './type';
import { transformResponse } from '@/app/api/apiHelper';
import { logout } from './authSlice';
import { BaseApi } from '@/app/api/baseApi';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['token'],
});
export const authApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials: LoginRequest) => ({
        url: '/api/Authentication/Login',
        method: 'POST',
        body: { ...credentials, forceLogin: true },
        transformResponse,
      }),
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
        url: '/api/Authentication/Logout',
        method: 'POST',
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          console.log('logout fail');
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authApi;
