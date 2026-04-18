import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Searchbar({
  className,
  onClick,
  searchTerm,
  setSearchTerm,
  isLoading,
}: {
  className?: string;
  onClick?: (searchTerm: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading?: boolean;
}) {
  if (!onClick) return null;
  if (searchTerm === undefined || setSearchTerm === undefined) {
    throw new Error(
      "Both 'searchTerm' and 'setSearchTerm' must be provided to enable the search feature.",
    );
  }

  const handleClear = () => {
    setSearchTerm('');
    if (onClick) {
      onClick('');
    }
  };

  return (
    <div className={cn('relative', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClick?.(searchTerm);
        }}
      >
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-20"
            disabled={isLoading}
          />

          {searchTerm && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-20 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            className="absolute right-0 top-0 bottom-0 rounded-l-none"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
    </div>
  );
}
