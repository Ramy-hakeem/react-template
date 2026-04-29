import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';
import type {
  ChangePasswordPayload,
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
  addTagTypes: ['users', 'currentUser', 'user'],
});

export const usersApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query<UserData, null>({
      query: () => ({
        url: '/api/Account/GetCurrentUser',
        method: 'GET',
      }),
      providesTags: ['currentUser'],
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
    changePassword: build.mutation<null, ChangePasswordPayload>({
      query: (body) => ({
        url: '/api/Account/ChangeUserPassword',
        method: 'POST',
        body,
      }),
    }),
    getAllUsers: build.query<ApiResponse<UserData[]>, GetAllUsersPayload>({
      query: ({ pageNumber, pageSize }) => ({
        url: '/api/Account/list',
        method: 'POST',
        body: { pageNumber, pageSize },
      }),
      providesTags: ['users'],
    }),
    getUser: build.query<UserData, string>({
      query: (id) => ({
        url: '/api/Account/GetUser',
        method: 'GET',
        params: { id },
      }),
      transformResponse,
      providesTags: (_result, _err, id) => {
        return [{ type: 'user', id }];
      },
    }),
    deleteUser: build.mutation<null, string>({
      query: (id) => ({
        url: '/api/Account/DeleteUser',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: invalidateOnSuccess(['users']),
    }),
    UpdateUserStatus: build.mutation<null, string>({
      query: (id) => ({
        url: '/api/Account/DeleteUser',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: invalidateOnSuccess(['users']),
    }),
    setPassword: build.mutation<null, string>({
      query: (id) => ({
        url: '/api/Account/DeleteUser',
        method: 'DELETE',
        body: { id },
      }),
      transformErrorResponse,
      invalidatesTags: invalidateOnSuccess(['users']),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLazyGetAllUsersQuery,
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useSetPasswordMutation,
} = usersApi;
