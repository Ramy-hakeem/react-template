import { BaseAPI } from '@/app/api/baseAPI';
import type { ApiResponse } from '@/app/api/types';
import type { GetAllUsersPayload, UpdateProfilePayload, UserData } from './types';
import { invalidateOnSuccess, transformResponse } from '@/app/api/apiHelper';

const enhancedApi = BaseAPI.enhanceEndpoints({
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
    }),
    getAllUsers: build.query<ApiResponse<UserData[]>, GetAllUsersPayload>({
      query: ({ pageNumber, pageSize }) => ({
        url: '/api/Account/list',
        method: 'POST',
        body: { pageNumber, pageSize },
      }),
      providesTags: ['users'],
    }),
    updateProfile: build.mutation<
      UserData,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: '/api/Account/UpdateUser',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: invalidateOnSuccess(['user']),
      transformResponse,
    }),
    changePassword: build.mutation<
      { success: boolean },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/api/Account/ChangePassword',
        method: 'POST',
        body,
      }),
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
