// src/router/index.tsx
import NotFoundPage from '@/components/layout/not-found/NotFoundPage';
import RootLayout from '@/components/layout/root-layout/RootLayout';
import AddUserPage from '@/features/auth/pages/AddUserPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import ProfilePage from '@/features/users/pages/ProfilePage';
import { createBrowserRouter } from 'react-router-dom';
import Providers from './providers';
import AllUsersPage from '@/features/users/pages/AllUsersPage';

export const router = createBrowserRouter([
  {
    // Public routes wrapper (no auth required)
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <div>Home Page</div>,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      // Protected routes group
      {
        element: <Providers />,
        children: [
          {
            path: 'profile',
            element: <ProfilePage />,
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
    ],
  },
]);
