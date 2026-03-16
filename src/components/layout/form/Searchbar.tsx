import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Searchbar({
  className,
  onClick,
  searchTerm,
  setSearchTerm,
}: {
  className?: string;
  onClick?: (searchTerm: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  if (!onClick) return null;
  if (searchTerm === undefined || setSearchTerm === undefined) {
    throw new Error(
      "Both 'searchTerm' and 'setSearchTerm' must be provided to enable the search feature.",
    );
  }
  return (
    <form>
      <Field className={cn(className, 'mb-4')}>
        <ButtonGroup>
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            id="input-button-group"
            placeholder="Type to search..."
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClick?.(searchTerm);
              setSearchTerm('');
            }}
            type={'submit'}
            variant="outline"
          >
            Search
          </Button>
        </ButtonGroup>
      </Field>
    </form>
  );
}
