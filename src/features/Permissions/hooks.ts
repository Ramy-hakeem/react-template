import { useMemo } from 'react';
import { useGetMyPermissionsQuery } from './api';
import type { PermissionId } from './constants';

export type PermissionValue = PermissionId | string;

export function usePermissions() {
  const { data, isLoading, isFetching, isError } = useGetMyPermissionsQuery({
    pageNumber: 1,
    pageSize: 10000,
  });

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
    isLoading: isLoading || isFetching,
    isError,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
