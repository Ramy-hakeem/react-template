import { BaseApi } from '@/app/api/baseApi';
import type { LoginRequest, SignupPayload } from './type';
import { transformResponse } from '@/app/api/apiHelper';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['token'],
});
export const authApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials: LoginRequest) => ({
        url: '/api/Authentication/Login',
        method: 'POST',
        body: credentials,
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
        url: '/api/Account/Logout',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authApi;
