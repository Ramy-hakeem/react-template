// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useRefreshToken } from '@/features/auth/api';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  redirectTo?: string;
}

export default function AuthProvider({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const { mutateAsync: refreshAccessToken, isPending } = useRefreshToken();
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated && !isPending) {
      refreshAccessToken();
    }
  }, []);
  console.log(
    'AuthProvider - isAuthenticated:',
    isAuthenticated,
    'isPending:',
    isPending,
  );
  // Show loading spinner while checking authentication
  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // // Check role requirement
  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Authenticated and authorized - render content
  return children ? <>{children}</> : <Outlet />;
}
