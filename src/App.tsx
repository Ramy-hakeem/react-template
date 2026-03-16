// Main App component - demonstrates Zustand state management
// Refactored to use Zustand stores instead of local state for better scalability

import {
  DataTable,
  type DataTableRef,
} from './components/layout/data-table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { toast, Toaster } from 'sonner'; // if you want to add toast notifications
import { TableAction } from './components/layout/data-table/TableAction';
import { ZustandDemo } from './components/ZustandDemo';
import { PaymentForm } from './components/PaymentForm';
import { usePayments, type Payment } from './lib/stores';
import { useRef, useState } from 'react';
import { Button } from './components/ui/button';

// Handle edit action for a payment - shows toast notification
const handleEdit = (payment: Payment) => {
  console.log('Edit payment:', payment);
  // Implement your edit logic here
  toast?.success(`Editing payment ${payment.id}`);
};

// Handle delete action for a payment
const handleDelete = (payment: Payment) => {
  console.log('Delete payment:', payment);
  // Implement your delete logic here
  toast?.success(`Deleting payment ${payment.id}`);
};

// Handle view action for a payment
const handleView = (payment: Payment) => {
  console.log('View payment:', payment);
  // Implement your view logic here
  toast?.success(`Viewing payment ${payment.id}`);
};

// Define table columns for the payment data table
const columns: ColumnDef<Payment>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      // Define color mapping for each status
      const colorMap: Record<string, string> = {
        pending: 'orange',
        processing: 'blue',
        success: 'green',
        failed: 'red',
      };

      const color = colorMap[status] || 'gray';

      return (
        <p className="font-medium" style={{ color: color }}>
          {status}
        </p>
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'Amount',
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

// Main App component
export default function App() {
  const { filteredPayments, setSearchTerm } = usePayments();
  const gridRef = useRef<DataTableRef>(null);

  // Refresh data - resets pagination and filters
  function refreshData() {
    gridRef.current?.refresh();
  }

  // Handle search input - updates store and shows result count
  function handleSearch(searchTerm: string) {
    setSearchTerm(searchTerm);
    toast?.success(`Found ${filteredPayments.length} results for "${searchTerm}"`);
  }

  return (
    <>
      <div className="flex flex-col justify-around my-10 items-center gap-4 ">
        <h1>GET THE MAIN DATA</h1>
        <Button onClick={refreshData} className="mb-4">
          Refresh Data
        </Button>
      </div>
      <div className="container mx-auto py-10 scroll-auto">
        <ZustandDemo />
        <PaymentForm />
        <DataTable
          ref={gridRef}
          columns={columns}
          data={filteredPayments}
          numberOfPages={5}
          handleSearch={handleSearch}
        />
      </div>

      <Toaster richColors position="bottom-left" />
    </>
  );
}
