import { DataTable } from "./components/data-table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { toast, Toaster } from "sonner"; // if you want to add toast notifications
import { TableAction } from "./components/data-table/TableAction";
import { TableCaption } from "./components/ui/table";

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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "actions",
    header: "Actions",
    size: 50,
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
  // Use the `use` hook to read the promise
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

  // const columns = createColumns(handleEdit, handleDelete, handleView);
  return (
    <>
      <div className="container mx-auto py-10 scroll-auto">
        <DataTable columns={columns} data={data} />
      </div>
      <Toaster richColors position="bottom-left" />
    </>
  );
}
