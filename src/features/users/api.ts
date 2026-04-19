import { BaseAPI, transformResponse } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';
import type { GetAllUsersPayload, UserData } from './types';

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
  }),
});

export const {
  useGetCurrentUserQuery,
  useLazyGetAllUsersQuery,
  useGetAllUsersQuery,
} = usersApi;
