import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { Action } from './types';

export const TableAction = ({ actions }: { actions: Action[] }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions.map((action, index, array) => (
          <>
            <DropdownMenuItem key={index} onClick={action.onClick}>
              {action.label}
            </DropdownMenuItem>
            {index < array.length - 1 && <DropdownMenuSeparator />}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
