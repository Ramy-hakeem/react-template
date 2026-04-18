import { axiosBaseAPI } from '@/app/api/axiosBaseQuery';
import type { GetAllUsersPayload, UserData } from './types';
import type { ApiResponse } from '@/app/api/types';

const enhancedApi = axiosBaseAPI.enhanceEndpoints({
  addTagTypes: ['users', 'user'],
});
export const usersApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUser: build.query({
      query: () => ({
        url: '/api/Account/GetCurrentUser',
        method: 'GET',
      }),
      providesTags: ['user'],
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
