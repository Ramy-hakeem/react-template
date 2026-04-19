import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronsLeft,
  ChevronsRight,
  SortAscIcon,
  SortDescIcon,
} from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Searchbar from '../form/Searchbar';
import { SkeletonTable } from '../skeleton/SkeletonTable';
import { SkeletonText } from '../skeleton/SkeletonText';
import type { DataTableProps, DataTableRef } from './types';

function DataTableComponent<TData>(
  {
    columns,
    data,
    numberOfPages,
    handleDataChange,
    isLoading = false,
  }: DataTableProps<TData>,
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
    handleDataChange?.({ sortBy, searchTerm, pageIndex, pageSize });
  }, [sortBy, pageIndex, pageSize, searchTerm, handleDataChange]);

  const generatePaginationLinks = () => {
    const currentPage = pageIndex;
    const totalPages = numberOfPages || table.getPageCount();
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPage > 2) {
        pages.push(-1);
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i > 0 && i < totalPages - 1) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push(-1);
      }

      if (totalPages > 1) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Header Section with Search */}
      <div className="flex items-center justify-between gap-4">
        <Searchbar
          className="max-w-md flex-1"
          onClick={
            handleDataChange
              ? () => {
                  if (pageIndex !== 0) {
                    table.setPageIndex(0);
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
          isLoading={isLoading}
        />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={isLoading}>
            Export
          </Button>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <SkeletonTable columnsLength={columns.length} pageSize={pageSize} />
      ) : (
        <div className="relative overflow-hidden rounded-lg border bg-background shadow-sm">
          <div className="overflow-x-auto ">
            <Table
              className={` overflow-auto`}
              style={{ width: table.getTotalSize() }}
            >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b bg-muted/50"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{
                            position: 'relative',
                            width: header.getSize(),
                          }}
                          className="h-12 px-4 text-left font-semibold"
                        >
                          <div className="flex items-center gap-1">
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
                                    desc:
                                      header.column.getIsSorted() === 'desc',
                                  });
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-transparent"
                              >
                                {header.column.getIsSorted() === 'asc' ? (
                                  <SortAscIcon className="h-4 w-4" />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <SortDescIcon className="h-4 w-4" />
                                ) : (
                                  <SortAscIcon className="h-4 w-4 opacity-30" />
                                )}
                              </Button>
                            )}
                          </div>
                          {header.column.getCanResize() && (
                            <div
                              onDoubleClick={() => header.column.resetSize()}
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-border transition-colors hover:bg-primary ${
                                header.column.getIsResizing()
                                  ? 'bg-primary'
                                  : ''
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
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`transition-colors hover:bg-muted/50  ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                          className="px-4 py-3 text-left "
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
                      className="h-48 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground grow-0">
                        <div className="text-lg">No results found</div>
                        <p className="text-sm">
                          Try adjusting your search or filter to find what
                          you're looking for.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {numberOfPages && (
              <div className="p-0">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-t bg-muted/50 font-medium [&>tr]:last:border-b-0">
                  {/* Page Info - Left */}
                  <div className="flex items-center justify-start">
                    {isLoading ? (
                      <SkeletonText lines={1} className="w-32" />
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {numberOfPages && (
                          <span className="ml-2 hidden md:inline">
                            • Page {pageIndex + 1} of {numberOfPages}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls - Center */}
                  <div className="flex justify-center">
                    {isLoading ? (
                      <SkeletonText lines={1} className="w-64" />
                    ) : (
                      <Pagination>
                        <PaginationContent className="flex-wrap gap-1">
                          {/* First Page */}
                          <PaginationItem className="hidden sm:block">
                            <PaginationLink
                              onClick={() => table.setPageIndex(0)}
                              className={`cursor-pointer ${
                                !table.getCanPreviousPage()
                                  ? 'pointer-events-none opacity-50'
                                  : 'hover:bg-muted'
                              }`}
                              aria-label="First page"
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </PaginationLink>
                          </PaginationItem>

                          {/* Previous */}
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => table.previousPage()}
                              className={`cursor-pointer ${
                                !table.getCanPreviousPage()
                                  ? 'pointer-events-none opacity-50'
                                  : 'hover:bg-muted'
                              }`}
                              aria-label="Previous page"
                            />
                          </PaginationItem>

                          {/* Page Numbers */}
                          {generatePaginationLinks().map((page, index) => (
                            <PaginationItem key={index}>
                              {page === -1 ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  onClick={() => table.setPageIndex(page)}
                                  isActive={pageIndex === page}
                                  className={`cursor-pointer transition-all duration-200 min-w-[2.5rem] ${
                                    pageIndex === page
                                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                                      : 'hover:bg-muted'
                                  }`}
                                  aria-label={`Go to page ${page + 1}`}
                                  aria-current={
                                    pageIndex === page ? 'page' : undefined
                                  }
                                >
                                  {page + 1}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}

                          {/* Next */}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => table.nextPage()}
                              className={`cursor-pointer ${
                                pageIndex >=
                                (numberOfPages
                                  ? numberOfPages - 1
                                  : table.getPageCount() - 1)
                                  ? 'pointer-events-none opacity-50'
                                  : 'hover:bg-muted'
                              }`}
                              aria-label="Next page"
                            />
                          </PaginationItem>

                          {/* Last Page */}
                          <PaginationItem className="hidden sm:block">
                            <PaginationLink
                              onClick={() =>
                                table.setPageIndex(numberOfPages - 1)
                              }
                              className={`cursor-pointer ${
                                pageIndex >=
                                (numberOfPages
                                  ? numberOfPages - 1
                                  : table.getPageCount() - 1)
                                  ? 'pointer-events-none opacity-50'
                                  : 'hover:bg-muted'
                              }`}
                              aria-label="Last page"
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </PaginationLink>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>

                  {/* Page Size Selector - Right */}
                  <div className="flex items-center justify-end">
                    {isLoading ? (
                      <SkeletonText lines={1} className="w-48" />
                    ) : (
                      <div className="flex items-center gap-3 rounded-md border border-input bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring">
                        <span className="text-xs text-muted-foreground">
                          Rows
                        </span>
                        <input
                          type="number"
                          value={pageSize}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0 && value <= 1000) {
                              table.setPageSize(value);
                              table.setPageIndex(0);
                            }
                          }}
                          min="1"
                          max="1000"
                          className="w-20 border-none bg-transparent text-center text-sm outline-none"
                        />
                        <span className="text-xs text-muted-foreground">
                          per page
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination Section */}
    </div>
  );
}

export const DataTable = forwardRef(DataTableComponent) as <TData>(
  props: DataTableProps<TData> & {
    ref?: React.ForwardedRef<DataTableRef>;
  },
) => React.ReactElement;
