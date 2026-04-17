// src/components/ProtectedRoute.tsx
import { useRefreshTokenMutation } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/hooks';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const [refreshToken, { isLoading, isError, data }] =
    useRefreshTokenMutation();
  useEffect(() => {
    if (!isAuthenticated) {
      refreshToken({});
    }
  }, []);
  const location = useLocation();
  console.log('isLoading', isLoading, data);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  // Redirect if refresh failed or user is not authenticated
  if (isError || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
