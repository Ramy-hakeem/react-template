import { useMemo } from 'react';
import { useGetMyPermissionsQuery } from './api';
import type { PermissionId } from './constants';
import { useAuthStore } from '@/features/auth/hooks';

export type PermissionValue = PermissionId | string;

export function usePermissions() {
  const { isAuthenticated, token } = useAuthStore();
  const shouldFetchPermissions = isAuthenticated && Boolean(token);

  const { data, isLoading, isFetching, isError } = useGetMyPermissionsQuery(
    {
      pageNumber: 1,
      pageSize: 10000,
    },
    {
      skip: !shouldFetchPermissions,
    },
  );

  const permissionIds = useMemo(
    () => new Set(data?.data.map((permission) => permission.id) || []),
    [data],
  );

  const hasPermission = (permission: PermissionValue) => {
    return permissionIds.has(permission);
  };

  const hasAnyPermission = (permissions: PermissionValue[]) => {
    return permissions.some((permission) => permissionIds.has(permission));
  };

  const hasAllPermissions = (permissions: PermissionValue[]) => {
    return permissions.every((permission) => permissionIds.has(permission));
  };

  return {
    permissionIds,
    isLoading: shouldFetchPermissions && (isLoading || isFetching),
    isError: shouldFetchPermissions && isError,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
