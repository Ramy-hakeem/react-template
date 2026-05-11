import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';

import {
  //   invalidateOnSuccess,
  transformErrorResponse,
  //   transformResponse,
} from '@/app/api/apiHelper';
import type { RoleData } from './types';
import type { GetListPayload } from '@/types';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['roles'],
});

export const rolesApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRoles: build.query<ApiResponse<RoleData[]>, GetListPayload>({
      query: (body) => ({
        url: '/api/identity/roles/list',
        method: 'POST',
        body,
      }),
      providesTags: ['roles'],
      transformErrorResponse,
    }),
  }),
});

export const { useGetAllRolesQuery, useLazyGetAllRolesQuery } = rolesApi;
