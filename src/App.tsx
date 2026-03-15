import { DataTable } from "./components/layout/data-table/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { toast, Toaster } from "sonner"; // if you want to add toast notifications
import { TableAction } from "./components/layout/data-table/TableAction";
import { ZustandDemo } from "./components/ZustandDemo";
import { PaymentForm } from "./components/PaymentForm";
import { usePayments, type Payment } from "./lib/stores";

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
  const { filteredPayments, setSearchTerm } = usePayments();

  function handleSearch(searchTerm: string) {
    setSearchTerm(searchTerm);
    toast?.success(`Found ${filteredPayments.length} results for "${searchTerm}"`);
  }

  return (
    <>
      <div className="container mx-auto py-10 scroll-auto">
        <ZustandDemo />
        <PaymentForm />
        <DataTable
          columns={columns}
          data={filteredPayments}
          handleSearch={handleSearch}
        />
      </div>
      <Toaster richColors position="bottom-left" />
    </>
  );
}
