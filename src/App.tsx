import { DataTable } from "./components/layout/data-table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { toast, Toaster } from "sonner"; // if you want to add toast notifications
import { TableAction } from "./components/layout/data-table/TableAction";
import { useState } from "react";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};
const handleEdit = (payment: Payment) => {
  console.log("Edit payment:", payment);
  // Implement your edit logic here
  toast?.success(`Editing payment ${payment.id}`);
};

const handleDelete = (payment: Payment) => {
  console.log("Delete payment:", payment);
  // Implement your delete logic here
  toast?.success(`Deleting payment ${payment.id}`);
};

const handleView = (payment: Payment) => {
  console.log("View payment:", payment);
  // Implement your view logic here
  toast?.success(`Viewing payment ${payment.id}`);
};
const columns: ColumnDef<Payment>[] = [
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      // Define color mapping for each status
      const colorMap: Record<string, string> = {
        pending: "orange",
        processing: "blue",
        success: "green",
        failed: "red",
      };

      const color = colorMap[status] || "gray";

      return (
        <p className="font-medium" style={{ color: color }}>
          {status}
        </p>
      );
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <TableAction
          actions={[
            { label: "Edit", onClick: () => handleEdit(row.original) },
            {
              label: <p className="text-red-900">Delete</p>,
              onClick: () => handleDelete(row.original),
            },
            { label: "View", onClick: () => handleView(row.original) },
          ]}
        />
      );
    },
  },
];

export default function App() {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "success",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "failed",
      email: "example@gmail.com",
    },
  ];
  const [filteredData, setFilteredData] = useState<Payment[]>(data);
  // Use the `use` hook to read the promise
  function handleSearch(searchTerm: string) {
    console.log("hello");
    const results = data.filter((payment) =>
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredData(results);
    toast?.success(`Found ${results.length} results for "${searchTerm}"`);
  }
  return (
    <>
      <div className="container mx-auto py-10 scroll-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          handleSearch={handleSearch}
        />
      </div>
      <Toaster richColors position="bottom-left" />
    </>
  );
}
