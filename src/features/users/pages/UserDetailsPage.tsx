import { useParams } from 'react-router-dom';
import { useGetUserQuery, useUpdateUserStatusMutation } from '../api';
import moment from 'moment';
import AlertDialog from '@/components/layout/alertDialog/AlertDialog';

const UserDetailPage = () => {
  const { userId } = useParams();
  const { data: user, isLoading, error } = useGetUserQuery(userId || '');
  const [updateUserStatus] = useUpdateUserStatusMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-400">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-red-500">Failed to load user data</div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex justify-center items-center">
      <div className="max-w-2xl min-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with Actions */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                User Information
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                View and manage user account details
              </p>
            </div>
            <div className="flex gap-2">
              <AlertDialog
                triggerText={
                  user.isActive ? 'Deactivate User' : 'Activate User'
                }
                triggerVariant={user.isActive ? 'destructive' : 'constructive'}
                title={user.isActive ? 'deactivate' : 'activate'}
                description={`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} ${user.name}?`}
                onConfirm={() => {
                  console.log('done ya bro');
                  updateUserStatus({
                    UserId: userId || '',
                    status: user.isActive ? 'Inactive' : 'Active',
                  });
                }}
              >
                <input type="text" />
              </AlertDialog>
              <AlertDialog
                triggerText={!user.locked ? 'Lock User' : 'Unlock User'}
                triggerVariant={!user.locked ? 'destructive' : 'constructive'}
                title={!user.locked ? 'deactivate' : 'activate'}
                description={`Are you sure you want to ${!user.locked ? 'Unlock' : 'lock'} ${user.name}?`}
                onConfirm={() => {
                  console.log('done ya bro');
                }}
              />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 py-4 space-y-3">
          {/* Name */}
          <div className="flex items-center py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500">Name</div>
            <div className="flex-1 text-sm text-gray-800 font-mono">
              {user.name}
            </div>
          </div>
          {/* Username */}
          <div className="flex items-center py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500">
              Username
            </div>
            <div className="flex-1 text-sm text-gray-800 font-mono">
              {user.userName}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500">Email</div>
            <div className="flex-1 text-sm text-gray-800">{user.email}</div>
          </div>

          {/* Status */}
          <div className="flex items-center py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500">Status</div>
            <div className="flex-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                />
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          {/* Status */}
          <div className="flex items-center py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500">Locked</div>
            <div className="flex-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  !user.locked
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${!user.locked ? 'bg-green-500' : 'bg-red-500'}`}
                />
                {user.locked ? 'Locked' : 'Unlocked'}
              </span>
            </div>
          </div>

          {/* User Type */}
          <div className="flex items-center py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500">
              User Type
            </div>
            <div className="flex-1">
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {user.userType}
              </span>
            </div>
          </div>

          {/* Roles */}
          <div className="flex items-start py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500 pt-0.5">
              Roles
            </div>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {user.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-center py-2 border-b border-gray-50">
            <div className="w-28 text-sm font-medium text-gray-500">
              User ID
            </div>
            <div className="flex-1 text-xs font-mono text-gray-500 break-all">
              {user.id}
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center py-2">
            <div className="w-28 text-sm font-medium text-gray-500">
              Created
            </div>
            <div className="flex-1 text-sm text-gray-800">
              {moment(user.createdDate).format('MMMM D, YYYY, hh:mm A')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
