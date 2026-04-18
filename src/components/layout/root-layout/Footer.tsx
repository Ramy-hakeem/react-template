import { useAuthStore } from '@/features/auth/hooks';
import { useGetCurrentUserQuery } from '@/features/users/api';
import { Link } from 'react-router-dom';

function Footer() {
  // fetching
  const { data } = useGetCurrentUserQuery({});
  const user = data?.data;

  // store
  const { isAuthenticated } = useAuthStore();
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left side - Brand */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-lg font-bold text-primary">
              Ana Al Fake APP
            </Link>
            {isAuthenticated && user && (
              <span className="text-xs text-muted-foreground border-l pl-2 ml-2">
                Welcome, {user.userName}
              </span>
            )}
          </div>

          {/* Center - User status (compact) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{user.userType}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Roles:</span>
                <span className="font-medium">
                  {user.roles.map((r) => r.name).join(', ')}
                </span>
              </div>
              <div
                className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </div>
          )}

          {/* Right side - Copyright */}
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Ana Al Fake APP. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
