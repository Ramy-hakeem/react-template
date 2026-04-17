// src/components/layouts/RootLayout.tsx
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/hooks';
import { LogOut } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold text-primary">
                Ana Al Fake APP
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            {isAuthenticated && (
              <Button
                onClick={() => logout()}
                variant="default"
                size="lg"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 h-full ">{<Outlet />}</main>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fake App. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
