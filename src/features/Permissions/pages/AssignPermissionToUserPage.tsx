import SearchableSelect from '@/components/layout/form/SearchableSelect';
import {
  useAssignPermissionToUserMutation,
  useGetAllPermissionsQuery,
} from '../api';
import { useSearchParams } from 'react-router-dom';
import { useGetAllUsersQuery } from '@/features/users/api';
import type { UserData } from '@/features/users/types';
import type { PermissionData } from '../types';
import { useEffect } from 'react';

export default function AssignPermissionToUserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const permission = searchParams.get('permission') || '';
  const user = searchParams.get('user') || '';

  const { data: permissionsData } = useGetAllPermissionsQuery({
    pageNumber: 1,
    pageSize: 10000,
  });
  const { data: usersData } = useGetAllUsersQuery({
    pageNumber: 1,
    pageSize: 10000,
  });
  const [assignPermissionToUser, { isLoading, isSuccess, isError, error }] =
    useAssignPermissionToUserMutation();

  // Clear all selections
  const handleClearSelections = () => {
    setSearchParams((prev) => {
      prev.delete('permission');
      prev.delete('user');
      return prev;
    });
  };

  // Clear selections on success
  useEffect(() => {
    if (isSuccess) {
      handleClearSelections();
    }
  }, [isSuccess]);

  if (!permissionsData || !usersData) {
    return null;
  }

  const users = usersData.data.map(({ id, name }: UserData) => ({
    id,
    name,
  }));
  const permissions = permissionsData.data.map(({ id }: PermissionData) => ({
    id,
    name: id.replace('Permissions.', '').split('.').reverse().join(' '),
  }));

  // Find current selections for display
  const currentPermission = permissions.find((p) => p.id === permission);
  const currentUser = users.find((u) => u.id === user);

  // Handle permission selection - updates URL params
  const handlePermissionSelect = (id: string) => {
    setSearchParams((prev) => {
      prev.set('permission', id);
      return prev;
    });
  };

  // Handle user selection - updates URL params
  const handleUserSelect = (id: string) => {
    setSearchParams((prev) => {
      prev.set('user', id);
      return prev;
    });
  };

  // Handle the assignment submission
  const handleAssignPermission = () => {
    if (permission && user) {
      assignPermissionToUser({
        userId: user,
        permissionIds: [permission],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section - Enhanced */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Assign Permission to User
                </h1>
                <p className="text-gray-600 mt-1">
                  Select a permission and a user to assign permissions
                </p>
              </div>
            </div>

            {/* Selection Status Badge */}
            {(permission || user) && (
              <div className="flex gap-2">
                {permission && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Permission selected
                  </span>
                )}
                {user && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    User selected
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && currentPermission && currentUser && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-800 font-medium">
                Successfully assigned permission "{currentPermission.name}" to
                user "{currentUser.name}"!
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800 font-medium">
                {error?.data?.message ||
                  'Failed to assign permission. Please try again.'}
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Two Column Layout */}
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8">
              {/* Permission Selector - Enhanced */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Permission
                    <span className="text-xs font-normal text-gray-400">
                      (Required)
                    </span>
                  </label>
                  {currentPermission && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      ✓ Selected
                    </span>
                  )}
                </div>

                <SearchableSelect
                  items={permissions}
                  onSelect={handlePermissionSelect}
                  placeholder="Search permissions by name..."
                  value={permission}
                />

                {/* Enhanced helper text */}
                <div className="flex items-center justify-between text-xs">
                  <p className="text-gray-500">
                    {permissions.length} permissions available
                  </p>
                  {currentPermission && (
                    <p className="text-green-600 truncate max-w-[200px]">
                      Current: {currentPermission.name}
                    </p>
                  )}
                </div>
              </div>

              {/* User Selector - Enhanced */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    User
                    <span className="text-xs font-normal text-gray-400">
                      (Required)
                    </span>
                  </label>
                  {currentUser && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      ✓ Selected
                    </span>
                  )}
                </div>

                <SearchableSelect
                  items={users}
                  onSelect={handleUserSelect}
                  placeholder="Search users by name..."
                  value={user}
                />

                {/* Enhanced helper text */}
                <div className="flex items-center justify-between text-xs">
                  <p className="text-gray-500">
                    {users.length} users available
                  </p>
                  {currentUser && (
                    <p className="text-green-600 truncate max-w-[200px]">
                      Current: {currentUser.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Assignment Summary - Show when both are selected */}
            {permission && user && currentPermission && currentUser && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Assignment Summary
                </h3>
                <p className="text-sm text-blue-800">
                  You are about to assign permission{' '}
                  <strong className="font-semibold">
                    "{currentPermission.name}"
                  </strong>{' '}
                  to user{' '}
                  <strong className="font-semibold">
                    "{currentUser.name}"
                  </strong>
                </p>
              </div>
            )}

            {/* Action Buttons Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleClearSelections}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Selections
              </button>
              <button
                onClick={handleAssignPermission}
                disabled={!permission || !user || isLoading}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  permission && user && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Assigning...
                  </span>
                ) : (
                  'Assign Permission'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact your system administrator for assistance with
            permission assignments.
          </p>
        </div>
      </div>
    </div>
  );
}
