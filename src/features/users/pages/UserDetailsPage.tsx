import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  useGetUserQuery,
  useUpdateUserStatusMutation,
  useSetPasswordMutation,
} from '../api';

const UserDetailPage = () => {
  const { userId } = useParams();
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(userId || '');
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [setPassword] = useSetPasswordMutation();

  // State for modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    if (!user) return;

    const action = user.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} ${user.userName}?`)) {
      try {
        setIsUpdating(true);
        // await updateUserStatus({
        //   id: user.id,
        //   isActive: !user.isActive,
        // }).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to update user status:', err);
        alert(`Failed to ${action} user. Please try again.`);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSetPassword = async () => {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsUpdating(true);
      // await setPassword({
      //   id: user.id,
      //   password: newPassword,
      // }).unwrap();
      alert('Password has been set successfully!');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to set password:', err);
      alert('Failed to set password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

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
              {/* Set Password Button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                disabled={isUpdating}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Set Password
              </button>

              {/* Lock/Unlock Button */}
              <button
                onClick={handleToggleStatus}
                disabled={isUpdating}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 ${
                  user.isActive
                    ? 'text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 focus:ring-red-500'
                    : 'text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 focus:ring-green-500'
                }`}
              >
                {user.isActive ? 'Lock User' : 'Unlock User'}
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 py-4 space-y-3">
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
                {user.isActive ? 'Active' : 'Locked'}
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
              {new Date(user.createdDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Set Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Set Password for {user.userName}
              </h3>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="text-sm text-gray-500">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Minimum 6 characters</li>
                  <li>Should be strong and unique</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSetPassword}
                disabled={isUpdating || !newPassword || !confirmPassword}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Setting...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
