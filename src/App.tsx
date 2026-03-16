import {
  DataTable,
  type DataTableRef,
} from './components/layout/data-table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { toast, Toaster } from 'sonner'; // if you want to add toast notifications
import { TableAction } from './components/layout/data-table/TableAction';
import { useEffect, useRef, useState } from 'react';
import { Button } from './components/ui/button';

export type Product = {
  id: string;
  price: number;
  title: string;
  slug: string;
};

const handleEdit = (payment: Product) => {
  console.log('Edit payment:', payment);
  // Implement your edit logic here
  toast?.success(`Editing payment ${payment.id}`);
};

const handleDelete = (payment: Product) => {
  console.log('Delete payment:', payment);
  // Implement your delete logic here
  toast?.success(`Deleting payment ${payment.id}`);
};

const handleView = (payment: Product) => {
  console.log('View payment:', payment);
  // Implement your view logic here
  toast?.success(`Viewing payment ${payment.id}`);
};
const columns: ColumnDef<Product>[] = [
  {
    id: 'status',
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    id: 'amount',
    accessorKey: 'price',
    header: 'Price',
  },
  {
    id: 'actions',
    header: 'Actions',
    enablePinning: true,
    cell: ({ row }) => {
      return (
        <TableAction
          actions={[
            { label: 'Edit', onClick: () => handleEdit(row.original) },
            {
              label: <p className="text-red-900">Delete</p>,
              onClick: () => handleDelete(row.original),
            },
            { label: 'View', onClick: () => handleView(row.original) },
          ]}
        />
      );
    },
  },
];

export default function App() {
  const [data, setData] = useState<Product[]>([]);
  const gridRef = useRef<DataTableRef>(null);

  // Use the `use` hook to read the promise
  function refreshData() {
    gridRef.current?.refresh();
  }

  return (
    <>
      <div className="flex flex-col  justify-around my-10 items-center gap-4 ">
        <h1>GET THE MAIN DATA</h1>
        <Button onClick={refreshData} className="mb-4">
          Refresh Data
        </Button>
      </div>
      <div className="container mx-auto py-10 scroll-auto">
        <DataTable<Product>
          ref={gridRef}
          columns={columns}
          data={data}
          numberOfPages={5}
          handleDataChange={async (data) => {
            const response = await fetch(
              `https://api.escuelajs.co/api/v1/products?limit=${data.pageSize}&offset=${data.pageIndex * data.pageSize}&price=${data.searchTerm}`,
            );
            const res = await response.json();
            console.log(res);
            setData(res);
          }}
        />
      </div>

      <Toaster richColors position="bottom-left" />
    </>
  );
}
