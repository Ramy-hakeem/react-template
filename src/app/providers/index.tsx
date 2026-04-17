// src/components/AuthWrapper.tsx
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

export default function Providers() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
