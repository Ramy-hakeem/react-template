import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';

import {
  //   invalidateOnSuccess,
  transformErrorResponse,
  //   transformResponse,
} from '@/app/api/apiHelper';
import type { PermissionData } from './types';
import type { GetListPayload } from '@/types';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['permissions'],
});

export const usersApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPermissions: build.query<
      ApiResponse<PermissionData[]>,
      GetListPayload
    >({
      query: (body) => ({
        url: '/api/identity/permissions/list',
        method: 'POST',
        body,
      }),
      providesTags: ['permissions'],
      transformErrorResponse,
    }),
  }),
});

export const { useLazyGetAllPermissionsQuery, useGetAllPermissionsQuery } =
  usersApi;
