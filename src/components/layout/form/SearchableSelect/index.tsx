import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  items: Array<{ id: string; name: string }>;
  value?: string; // Accept an id as the initial value
  onSelect: (id: string, name: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchableSelect({
  items,
  value,
  onSelect,
  placeholder = 'Start typing to search...',
  className,
}: SearchableSelectProps) {
  const [search, setSearch] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Track previous value to detect external changes
  const prevValueRef = React.useRef(value);
  const isInitialMount = React.useRef(true);

  // Find the selected item based on value prop
  const selectedItem = React.useMemo(() => {
    if (!value) return null;
    return items.find((item) => item.id === value);
  }, [items, value]);

  // Handle initial value and external changes
  React.useEffect(() => {
    if (isInitialMount.current) {
      // Set initial search value from selected item
      if (selectedItem) {
        setSearch(selectedItem.name);
      }
      isInitialMount.current = false;
      prevValueRef.current = value;
      return;
    }

    // Check if value changed externally (not from this component)
    if (prevValueRef.current !== value) {
      if (selectedItem) {
        setSearch(selectedItem.name);
      } else if (!value) {
        setSearch('');
      }
      prevValueRef.current = value;
    }
  }, [selectedItem, value]);

  // Filter items based on search input
  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  // Show all items when input is focused and has no search
  const displayItems = React.useMemo(() => {
    if (!search.trim() && isOpen) return items;
    return filteredItems;
  }, [search, isOpen, items, filteredItems]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: { id: string; name: string }) => {
    setSearch(item.name);
    onSelect(item.id, item.name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setIsOpen(true);

    // If user is typing, clear the external selection
    if (value) {
      onSelect('', '');
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setSearch('');
    onSelect('', '');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && displayItems.length === 1) {
      handleSelect(displayItems[0]);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full pr-8',
            selectedItem && 'border-green-500 focus:border-green-500',
          )}
        />

        {/* Clear button */}
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
            aria-label="Clear selection"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Dropdown arrow */}
        {!search && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && displayItems.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[300px] overflow-auto"
        >
          <div className="py-1">
            {/* Header with count */}
            {search && (
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                {filteredItems.length} result
                {filteredItems.length !== 1 ? 's' : ''} found
              </div>
            )}

            {/* Items list */}
            {displayItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={cn(
                  'px-3 py-2 cursor-pointer transition-colors',
                  'hover:bg-blue-50 hover:text-blue-700',
                  value === item.id && 'bg-blue-50 text-blue-700 font-medium',
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {value === item.id && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && search && filteredItems.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <svg
            className="w-8 h-8 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-gray-600">
            No results found for "<span className="font-medium">{search}</span>"
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try typing a different name
          </p>
        </div>
      )}

      {/* Selected item indicator */}
      {selectedItem && (
        <div className="absolute -top-2 left-2 px-1 text-xs text-green-600 bg-white">
          Selected
        </div>
      )}
    </div>
  );
}
