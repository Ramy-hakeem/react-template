import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Searchbar from "../Searchbar";
import { SortDescIcon, SortAscIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleSearch?: (searchTerm: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleSearch,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {
      minSize: 60,
      maxSize: 500,
      size: 150,
    },
  });
  table.getHeaderGroups()?.[0]?.headers.map((header) => {
    console.log(
      "Header:",
      header.id,
      "is Sorted:",
      header.column.getIsSorted(),
    );
    return null; // Just for logging, we don't need to render anything here
  });
  return (
    <>
      <Searchbar
        className="w-1/4"
        onClick={(searchTerm) => handleSearch?.(searchTerm)}
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
                        position: "relative",
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
                          onClick={header.column.getToggleSortingHandler()}
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <SortAscIcon className="ml-1 inline-block h-4 w-4" />
                          ) : (
                            <SortDescIcon className="ml-1 inline-block h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {header.column.getCanResize() && (
                        <div
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-border hover:bg-primary/50 ${
                            header.column.getIsResizing() ? "bg-primary" : ""
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
                  data-state={row.getIsSelected() && "selected"}
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
    </>
  );
}
// test for the data table component