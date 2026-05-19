// src/router/index.tsx
import NotFoundPage from '@/components/layout/not-found/NotFoundPage';
import AddUserPage from '@/features/auth/pages/AddUserPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import ProfilePage from '@/features/users/pages/ProfilePage';
import { createBrowserRouter } from 'react-router-dom';
import AllUsersPage from '@/features/users/pages/AllUsersPage';
import ProtectedRoute from './providers/ProtectedRoute';
import UpdateProfilePage from '@/features/users/pages/UpdateProfilePage';
import ChangePasswordPage from '@/features/users/pages/ChangePasswordPage';
import UserDetailsPage from '@/features/users/pages/UserDetailsPage';
import PermissionsPage from '@/features/Permissions/pages/permissionsPage';
import AssignPermissionToUserPage from '@/features/Permissions/pages/AssignPermissionToUserPage';
import AssignPermissionToRolePage from '@/features/Permissions/pages/AssignPermissionToRolePage';
import RolesManagerPage from '@/features/roles/pages/RolesManagerPage';
import ChatPage from '@/features/chat/pages/ChatPage';

export const router = createBrowserRouter([
  // Public route
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
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
        path: 'add-user',
        element: <AddUserPage />,
      },
      {
        path: 'all-users',
        element: <AllUsersPage />,
      },
      {
        path: 'all-users/:userId',
        element: <UserDetailsPage />,
      },
      {
        path: 'all-Permissions',
        element: <PermissionsPage />,
      },
      {
        path: 'roles',
        element: <RolesManagerPage />,
      },
      {
        path: 'all-Permissions/assign-to-user',
        element: <AssignPermissionToUserPage />,
      },
      {
        path: 'all-Permissions/assign-to-role',
        element: <AssignPermissionToRolePage />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
    ],
  },
]);
