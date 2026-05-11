import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';

import {
  transformErrorResponse,
} from '@/app/api/apiHelper';
import type {
  AssignPermissionToRolePayload,
  AssignPermissionToUserPayload,
  PermissionData,
} from './types';
import type { GetListPayload } from '@/types';

const enhancedApi = BaseApi.enhanceEndpoints({
  addTagTypes: ['permissions'],
});

export const permissionsApi = enhancedApi.injectEndpoints({
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

    getMyPermissions: build.query<ApiResponse<PermissionData[]>, GetListPayload>(
      {
        query: (body) => ({
          url: '/api/identity/permissions/my-permissions',
          method: 'POST',
          body,
        }),
        providesTags: ['permissions'],
        transformErrorResponse,
      },
    ),

    AssignPermissionToRole: build.mutation<null, AssignPermissionToRolePayload>(
      {
        query: (body) => ({
          url: '/api/identity/permissions/assign-to-role',
          method: 'POST',
          body,
        }),
      },
    ),
    AssignPermissionToUser: build.mutation<null, AssignPermissionToUserPayload>(
      {
        query: (body) => ({
          url: '/api/identity/permissions/assign-to-user',
          method: 'POST',
          body,
        }),
      },
    ),
  }),
});

export const {
  useLazyGetAllPermissionsQuery,
  useGetAllPermissionsQuery,
  useGetMyPermissionsQuery,
  useAssignPermissionToRoleMutation,
  useAssignPermissionToUserMutation,
} = permissionsApi;
