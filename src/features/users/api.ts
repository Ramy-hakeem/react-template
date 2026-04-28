import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';
import type {
  GetAllUsersPayload,
  UpdateProfilePayload,
  UserData,
} from './types';
import {
  invalidateOnSuccess,
  transformErrorResponse,
  transformResponse,
} from '@/app/api/apiHelper';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['users', 'user'],
});

export const usersApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query<UserData, null>({
      query: () => ({
        url: '/api/Account/GetCurrentUser',
        method: 'GET',
      }),
      providesTags: ['user'],
      transformResponse,
      transformErrorResponse,
    }),

    getAllUsers: build.query<ApiResponse<UserData[]>, GetAllUsersPayload>({
    query: (body) => ({
      url: '/api/Account/list',
      method: 'POST',
      body,
    }),
    providesTags: ['users'],
    transformErrorResponse,
  }),

    updateProfile: build.mutation<UserData, UpdateProfilePayload>({
      query: (body) => ({
        url: '/api/Account/UpdateUser',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: invalidateOnSuccess(['user', 'users']),
      transformResponse,
      transformErrorResponse,
    }),

    changePassword: build.mutation<
      { success: boolean },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/api/Account/ChangeUserPassword',
        method: 'POST',
        body,
      }),
      transformErrorResponse,
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLazyGetAllUsersQuery,
  useGetAllUsersQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = usersApi;