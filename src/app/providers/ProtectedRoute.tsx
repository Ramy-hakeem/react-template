// src/components/ProtectedRoute.tsx
import { useAuthStore } from '@/features/auth/hooks';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();
  console.log('this is gard ');
  if (!isAuthenticated && token !== 'initial-token') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
