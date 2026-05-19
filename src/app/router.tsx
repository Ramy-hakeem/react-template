// src/router/index.tsx
import NotFoundPage from '@/components/layout/not-found/NotFoundPage';
import AddUserPage from '@/features/auth/pages/AddUserPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import ProfilePage from '@/features/users/pages/ProfilePage';
import { createBrowserRouter } from 'react-router-dom';
import AllUsersPage from '@/features/users/pages/AllUsersPage';
import ProtectedRoute from './providers/ProtectedRoute';
import PermissionRoute from './providers/PermissionRoute';
import UpdateProfilePage from '@/features/users/pages/UpdateProfilePage';
import ChangePasswordPage from '@/features/users/pages/ChangePasswordPage';
import UserDetailsPage from '@/features/users/pages/UserDetailsPage';
import PermissionsPage from '@/features/Permissions/pages/permissionsPage';
import AssignPermissionToUserPage from '@/features/Permissions/pages/AssignPermissionToUserPage';
import AssignPermissionToRolePage from '@/features/Permissions/pages/AssignPermissionToRolePage';
import RolesManagerPage from '@/features/roles/pages/RolesManagerPage';
import { PERMISSIONS } from '@/features/Permissions/constants';

export const router = createBrowserRouter([
  // Public route
  {
    path: 'login',
    element: <LoginPage />,
  },

  // Protected routes
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <div>Home Page</div>,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'update-profile',
        element: <UpdateProfilePage />,
      },
      {
        path: 'change-password',
        element: <ChangePasswordPage />,
      },
      {
        element: <PermissionRoute permissions={[PERMISSIONS.users.edit]} />,
        children: [
          {
            path: 'add-user',
            element: <AddUserPage />,
          },
        ],
      },
      {
        element: <PermissionRoute permissions={[PERMISSIONS.users.view]} />,
        children: [
          {
            path: 'all-users',
            element: <AllUsersPage />,
          },
          {
            path: 'all-users/:userId',
            element: <UserDetailsPage />,
          },
        ],
      },
      {
        element: <PermissionRoute permissions={[PERMISSIONS.users.view]} />,
        children: [
          {
            path: 'all-Permissions',
            element: <PermissionsPage />,
          },
        ],
      },
      {
        element: <PermissionRoute permissions={[PERMISSIONS.roles.view]} />,
        children: [
          {
            path: 'roles',
            element: <RolesManagerPage />,
          },
        ],
      },
      {
        element: <PermissionRoute permissions={[PERMISSIONS.users.edit]} />,
        children: [
          {
            path: 'all-Permissions/assign-to-user',
            element: <AssignPermissionToUserPage />,
          },
        ],
      },
      {
        element: <PermissionRoute permissions={[PERMISSIONS.roles.edit]} />,
        children: [
          {
            path: 'all-Permissions/assign-to-role',
            element: <AssignPermissionToRolePage />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
