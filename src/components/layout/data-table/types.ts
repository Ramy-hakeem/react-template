import type { JSX } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

export type Action = {
  label: string | JSX.Element;
  onClick: () => void;
};

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  numberOfPages?: number;
  data: TData[];
  isLoading?: boolean;
  handleSort?: (
    columnId: string,
    isSorted: boolean | 'asc' | 'desc' | undefined,
  ) => void;

  handleDataChange?: (data: {
    sortBy: { id: string; desc: boolean };
    searchTerm: string;
    pageIndex: number;
    pageSize: number;
  }) => void;
};

export type DataTableRef = {
  refresh: () => void;
};
