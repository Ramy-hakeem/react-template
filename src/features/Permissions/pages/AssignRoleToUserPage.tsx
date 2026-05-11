import SearchableSelect from '@/components/layout/form/SearchableSelect';
import { useGetAllPermissionsQuery } from '../api';
import { useSearchParams } from 'react-router-dom';
import { useGetAllUsersQuery } from '@/features/users/api';
import type { UserData } from '@/features/users/types';
import type { PermissionData } from '../types';

export default function AssignRoleToUserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const permission = searchParams.get('permission') || '';
  const user = searchParams.get('user') || '';
  console.log(permission, user);

  const { data: permissionsData } = useGetAllPermissionsQuery({
    pageNumber: 1,
    pageSize: 10000,
  });
  const { data: usersData } = useGetAllUsersQuery({
    pageNumber: 1,
    pageSize: 10000,
  });

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
  const handlePermissionSelect = (id: string, name: string) => {
    setSearchParams((prev) => {
      prev.set('permission', id);
      return prev;
    });
  };

  // Handle user selection - updates URL params
  const handleUserSelect = (id: string, name: string) => {
    console.log(id, name);
    setSearchParams((prev) => {
      prev.set('user', id);
      return prev;
    });
  };

  // Clear all selections
  const handleClearSelections = () => {
    setSearchParams((prev) => {
      prev.delete('permission');
      prev.delete('user');
      return prev;
    });
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
                  Select a permission and a user to assign roles
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

            {/* Action Buttons Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleClearSelections}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Clear Selections
              </button>
              <button
                onClick={() => {
                  if (permission && user) {
                    alert(
                      `Ready to assign permission to user!\n\nPermission: ${currentPermission?.name}\nUser: ${currentUser?.name}`,
                    );
                  } else {
                    alert(
                      'Please select both a permission and a user before proceeding.',
                    );
                  }
                }}
                disabled={!permission || !user}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  permission && user
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Assign Role
              </button>
            </div>
          </div>
        </div>

        {/* Footer Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact your system administrator for assistance with
            role assignments.
          </p>
        </div>
      </div>
    </div>
  );
}
