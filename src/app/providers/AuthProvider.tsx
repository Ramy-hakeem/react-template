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

export default function AuthProvider({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const {
    mutateAsync: refreshAccessToken,
    isPending,
    isSuccess,
  } = useRefreshToken();
  console.log('isSuccess', isSuccess);
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated && !isPending) {
      refreshAccessToken();
    }
  }, []);

  // Show loading spinner while checking authentication
  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated && isSuccess) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  // // Check role requirement
  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Authenticated and authorized - render content
  return children ? <>{children}</> : <Outlet />;
}
