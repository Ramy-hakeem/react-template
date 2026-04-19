import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Circle,
  Copy,
  HelpCircle,
  Loader2,
  Lock,
  Shield,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Link } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../api';

export default function ProfilePage() {
  const { data, isLoading, error } = useGetCurrentUserQuery(null);
  const { copiedField, copyToClipboard } = useCopyToClipboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 max-w-md text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Failed to Load Profile
          </h2>
          <p className="text-slate-500 mb-4">
            {error?.data?.message ||
              'Unable to fetch user profile data. Please try again later.'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - User Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Personal Information
            </h3>
            <div className="flex gap-2">
              <Link to="/update-profile">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
              <Link to="/change-password">
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500 w-32">
                Username
              </span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-slate-800">{data.userName}</span>
                <Button
                  variant="ghost"
                  size={'icon'}
                  onClick={() => copyToClipboard(data.userName, 'username')}
                >
                  {copiedField === 'username' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500 w-32">
                Email Address
              </span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-slate-800">{data.email}</span>
                <Button
                  variant="ghost"
                  size={'icon'}
                  onClick={() => copyToClipboard(data.email, 'email')}
                >
                  {copiedField === 'email' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500 w-32">
                User ID
              </span>
              <div className="flex items-center gap-2 flex-1">
                <code className="text-sm bg-slate-50 px-2 py-1 rounded text-slate-600 font-mono">
                  {data.id}
                </code>
                <Button
                  variant="ghost"
                  size={'icon'}
                  onClick={() => copyToClipboard(data.id, 'id')}
                >
                  {copiedField === 'id' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center py-2">
              <span className="text-sm font-medium text-slate-500 w-32">
                Member Since
              </span>
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-800">
                  {moment(data.createdDate).format('MMMM D, YYYY, hh:mm A')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Roles & Permissions
          </h3>
          <div className="space-y-3">
            {data.roles.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{role.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      Role ID:
                      {role.id || (
                        <HelpCircle className="h-3 w-3 text-slate-400" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Status & Activity */}
      <div className="space-y-6">
        {/* Account Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Account Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <div className="flex items-center gap-2">
                <Circle
                  className={`h-3 w-3 ${data.isActive ? 'text-emerald-500 fill-emerald-500' : 'text-red-500 fill-red-500'}`}
                />
                <span
                  className={`text-sm font-medium ${data.isActive ? 'text-emerald-700' : 'text-red-700'}`}
                >
                  {data.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">User Type</span>
              <span className="text-sm font-medium text-slate-700 capitalize">
                {data.userType}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              variant={'ghost'}
              size={'lg'}
              className="w-full  hover:bg-slate-50 transition-colors flex justify-start items-center gap-3 group"
            >
              <Link to={'/update-profile'} className="flex gap-3 items-center">
                <User className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-sm text-slate-600 group-hover:text-indigo-600">
                  Update Profile
                </span>
              </Link>
            </Button>
            <Button
              variant={'ghost'}
              size={'lg'}
              className="w-full  hover:bg-slate-50 transition-colors flex justify-start items-center gap-3 group"
            >
              <Link to={'/change-password'} className="flex gap-3 items-center">
                <Lock className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-sm text-slate-600 group-hover:text-indigo-600">
                  Change Password
                </span>
              </Link>
            </Button>
            <Button
              variant={'ghost'}
              size={'lg'}
              className="w-full  hover:bg-slate-50 transition-colors flex justify-start items-center gap-3 group"
            >
              <Link to={'/add-user'} className="flex gap-3 items-center">
                <UserPlus className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-sm text-slate-600 group-hover:text-indigo-600">
                  Add User
                </span>
              </Link>
            </Button>
            <Button
              variant={'ghost'}
              size={'lg'}
              className="w-full  hover:bg-slate-50 transition-colors flex justify-start items-center gap-3 group"
            >
              <Link to={'/all-users'} className="flex gap-3 items-center">
                <Users className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-sm text-slate-600 group-hover:text-indigo-600">
                  Users
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
