import { Outlet } from 'react-router-dom';
import { usePermissions, type PermissionValue } from '@/features/Permissions/hooks';

type PermissionRouteProps = {
  permissions: PermissionValue[];
  mode?: 'all' | 'any';
};

export default function PermissionRoute({
  permissions,
  mode = 'all',
}: PermissionRouteProps) {
  const { isLoading, isError, hasAllPermissions, hasAnyPermission } =
    usePermissions();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
        Checking permissions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">
          Permission check failed
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          We could not verify your permissions. Please try again.
        </p>
      </div>
    );
  }

  const isAllowed =
    mode === 'any'
      ? hasAnyPermission(permissions)
      : hasAllPermissions(permissions);

  if (!isAllowed) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Access denied</h1>
        <p className="mt-2 text-sm text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
