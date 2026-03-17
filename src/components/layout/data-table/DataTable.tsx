// DataTable component - Reusable table component with sorting functionality
// Uses TanStack React Table for table logic and customizable column definitions

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Searchbar from '../form/Searchbar';
import { SortDescIcon, SortAscIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  numberOfPages?: number;
  data: TData[];
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
}
// Define the type for the ref methods
export type DataTableRef = {
  refresh: () => void;
};
function DataTableComponent<TData>(
  { columns, data, numberOfPages, handleDataChange }: DataTableProps<TData>,
  ref: React.ForwardedRef<DataTableRef>,
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean }>({
    id: '',
    desc: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    manualPagination: true,
    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: 60,
      maxSize: 500,
      size: 150,
    },
  });
  useImperativeHandle(
    ref,
    () => ({
      refresh: () => {
        console.log('Refreshing data...');
        // Reset local state
        table.setPageIndex(0);
        table.resetSorting();
        table.resetGlobalFilter();
        setSearchTerm('');
        handleDataChange?.({
          sortBy: { id: '', desc: false },
          searchTerm: '',
          pageIndex: 0,
          pageSize: table.getState().pagination.pageSize,
        });
      },

      // You can add more methods as needed
      getCurrentState: () => ({
        searchTerm,
        sortBy,
        pageIndex: table.getState().pagination.pageIndex,
        pageSize: table.getState().pagination.pageSize,
      }),

      resetSearch: () => {
        setSearchTerm('');
      },

      resetSorting: () => {
        setSortBy({ id: '', desc: false });
      },
      resetPagination: () => {
        table.setPageIndex(0);
      },
    }),
    [searchTerm, sortBy, table, handleDataChange],
  );
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  useEffect(() => {
    console.log('Data changed:', { sortBy, searchTerm, pageIndex, pageSize });
    handleDataChange?.({ sortBy, searchTerm, pageIndex, pageSize });
  }, [sortBy, pageIndex, pageSize]);

  const generatePaginationLinks = () => {
    const currentPage = pageIndex;
    const totalPages = numberOfPages || table.getPageCount();
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (currentPage > 2) {
        pages.push(-1); // Ellipsis
      }

      // Show current page and neighbors
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i > 0 && i < totalPages - 1) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push(-1); // Ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };
  return (
    <>
      <Searchbar
        className="w-1/4"
        onClick={
          handleDataChange
            ? () => {
                if (pageIndex !== 0) {
                  table.setPageIndex(0); // Reset to first page on new search
                } else {
                  handleDataChange({
                    sortBy,
                    searchTerm,
                    pageIndex: 0,
                    pageSize,
                  });
                }
              }
            : undefined
        }
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="overflow-hidden rounded-md border">
        <Table style={{ width: table.getTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        position: 'relative',
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanSort() && (
                        <Button
                          onClick={() => {
                            header.column.toggleSorting();
                            setSortBy({
                              id: header.id,
                              desc: header.column.getIsSorted() === 'desc',
                            });
                          }}
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                        >
                          {header.column.getIsSorted() === 'asc' ? (
                            <SortAscIcon className="ml-1 inline-block h-4 w-4" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <SortDescIcon className="ml-1 inline-block h-4 w-4" />
                          ) : (
                            <SortAscIcon className="ml-1 inline-block h-4 w-4 opacity-30" />
                          )}
                        </Button>
                      )}
                      {header.column.getCanResize() && (
                        <div
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-border hover:bg-primary/50 ${
                            header.column.getIsResizing() ? 'bg-primary' : ''
                          }`}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      className="text-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 mt-2">
        <p className="text-sm text-nowrap" data-slot="pagination-info">
          page {table.getState().pagination.pageIndex + 1} of {numberOfPages}
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {generatePaginationLinks().map((page, index) => (
              <PaginationItem key={index}>
                {page === -1 ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => table.setPageIndex(page)}
                    isActive={pageIndex === page}
                    className="cursor-pointer"
                  >
                    {page + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  pageIndex >=
                  (numberOfPages ? numberOfPages - 1 : table.getPageCount() - 1)
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
// test for the data table component

export const DataTable = forwardRef(DataTableComponent) as <TData>(
  props: DataTableProps<TData> & {
    ref?: React.ForwardedRef<DataTableRef>;
  },
) => React.ReactElement;
