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
      transformErrorResponse: transformErrorResponse,
    }),
    updateProfile: build.mutation<UserData, UpdateProfilePayload>({
      query: (body) => ({
        url: '/api/Account/UpdateUser',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: invalidateOnSuccess(['user']),
      transformResponse,
    }),
    changePassword: build.mutation<null, ChangePasswordPayload>({
      query: (id) => ({
        url: '/api/Account/ChangeUserPassword',
        method: 'POST',
        body: { id },
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
