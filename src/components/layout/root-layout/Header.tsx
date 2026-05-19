import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/features/Permissions/constants';
import { usePermissions, type PermissionValue } from '@/features/Permissions/hooks';
import { useLogoutMutation } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/hooks';
import NotificationBell from '@/features/notifications/components/NotificationBell';
import { useGetCurrentUserQuery } from '@/features/users/api';
import { ChevronDown, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type NavigationItem = {
  name: string;
  href: string;
  permission?: PermissionValue;
};

function Header() {
  //   fetching
  const { data: user, isLoading } = useGetCurrentUserQuery(null);
  const [logout] = useLogoutMutation();
  const { hasPermission } = usePermissions();
  //   store
  const { isAuthenticated } = useAuthStore();
  //   others
  const location = useLocation();
  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/' },
    { name: 'Profile', href: '/profile' },
    {
      name: 'Users',
      href: '/all-users',
      permission: PERMISSIONS.users.view,
    },
    {
      name: 'Permissions',
      href: '/all-Permissions',
      permission: PERMISSIONS.users.view,
    },
    {
      name: 'Roles',
      href: '/roles',
      permission: PERMISSIONS.roles.view,
    },
  ];

  const visibleNavigation = navigation.filter((item) => {
    if (!item.permission) {
      return true;
    }

    return hasPermission(item.permission);
  });

  if (isLoading) {
    return null;
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-primary">
              Ana Al Fake APP
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {visibleNavigation.map((item) => (
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
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <NotificationBell />
              {/* User Info Dropdown */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 px-3"
                >
                  {/* Avatar with user initial */}
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>

                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="rounded-lg border bg-popover shadow-lg">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-base font-semibold text-primary">
                            {user.userName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{user.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* User metadata */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            User Type
                          </span>
                          <span className="font-medium capitalize">
                            {user.userType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span
                            className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Roles</span>
                          <span className="font-medium">
                            {user.roles.map((role) => role.name).join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Member Since
                          </span>
                          <span className="font-medium text-xs">
                            {new Date(user.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Button
                        onClick={() => logout({})}
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
