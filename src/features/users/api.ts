import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';
import type {
  ChangePasswordPayload,
  GetAllUsersPayload,
  UpdateProfilePayload,
  UpdateStatusPayload,
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
    UpdateUserStatus: build.mutation<null, UpdateStatusPayload>({
      query: (body) => ({
        url: '/api/Account/ChangeUserStatus',
        method: 'PATCH',
        body,
      }),
      transformErrorResponse,
      invalidatesTags: (_res, _err, args) => {
        return [{ type: 'user', id: args.UserId }, { type: 'users' }];
      },
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
} = usersApi;
