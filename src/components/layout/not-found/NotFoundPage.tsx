// src/components/NotFoundPageAdvanced.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Home, ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

interface NotFoundPageProps {
  title?: string;
  description?: string;
  showSearch?: boolean;
  showSuggestedLinks?: boolean;
}

export default function NotFoundPageAdvanced({
  title = 'Page Not Found',
  description = "The page you're looking for doesn't exist or has been moved.",
  showSearch = true,
  showSuggestedLinks = true,
}: NotFoundPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const suggestedLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement your search logic here
      console.log('Searching for:', searchQuery);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>

          <CardTitle className="text-4xl font-bold">{title}</CardTitle>
          <div className="mt-2 text-6xl font-black text-muted-foreground/20">
            404
          </div>
          <CardDescription className="mt-4 text-base">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {showSearch && (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pages..."
                className="w-full rounded-lg border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </form>
          )}

          {showSuggestedLinks && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                You might want to try:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <Link to={link.href}>
                      {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home Page
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
