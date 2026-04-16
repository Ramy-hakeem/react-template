// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/root-layout/RootLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import NotFoundPage from '@/components/layout/not-found/NotFoundPage';
import Providers from './providers';
import ProfilePage from '@/features/users/pages/Profile';

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
            path: 'signup',
            element: <SignupPage />,
          },
        ],
      },
    ],
  },
]);
