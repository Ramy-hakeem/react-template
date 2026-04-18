// src/components/ProtectedRoute.tsx
import RootLayout from '@/components/layout/root-layout/RootLayout';
import { useAuthStore } from '@/features/auth/hooks';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated && token !== 'initial-token') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <RootLayout>{children ? <>children</> : <Outlet />}</RootLayout>;
}
