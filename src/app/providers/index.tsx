// src/components/AuthWrapper.tsx
import { Outlet } from 'react-router-dom';
import AuthProvider from './AuthProvider';

export default function Providers() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
