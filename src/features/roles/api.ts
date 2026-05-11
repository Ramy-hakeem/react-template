import { BaseApi } from '@/app/api/baseApi';
import type { ApiResponse } from '@/app/api/types';
import {
  invalidateOnSuccess,
  transformErrorResponse,
  transformResponse,
} from '@/app/api/apiHelper';
import type {
  AssignRolePermissionsPayload,
  RoleData,
  UpsertRolePayload,
} from './types';
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

    createRole: build.mutation<RoleData, UpsertRolePayload>({
      query: (body) => ({
        url: '/api/identity/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: invalidateOnSuccess(['roles']),
      transformResponse,
      transformErrorResponse,
    }),

    updateRole: build.mutation<RoleData, UpsertRolePayload>({
      query: (body) => ({
        url: '/api/identity/roles',
        method: 'PUT',
        body,
      }),
      invalidatesTags: invalidateOnSuccess(['roles']),
      transformResponse,
      transformErrorResponse,
    }),

    deleteRole: build.mutation<null, string>({
      query: (id) => ({
        url: `/api/identity/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: invalidateOnSuccess(['roles']),
      transformErrorResponse,
    }),

    assignRolePermissions: build.mutation<boolean, AssignRolePermissionsPayload>({
      query: (body) => ({
        url: '/api/identity/permissions/assign-to-role',
        method: 'POST',
        body,
      }),
      invalidatesTags: invalidateOnSuccess(['roles']),
      transformResponse,
      transformErrorResponse,
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useLazyGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignRolePermissionsMutation,
} = rolesApi;
