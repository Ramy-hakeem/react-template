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
    ],
  },
]);
