// PaymentForm component - allows users to add new payments to the Zustand store
// Demonstrates integration with Zustand state management and form validation

import { useState } from "react";
import { usePayments } from "../lib/stores";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function PaymentForm() {
  // Get addPayment action and loading state from Zustand store
  const { addPayment, isLoading } = usePayments();
  
  // Local form state
  const [formData, setFormData] = useState({
    email: "",
    amount: "",
    status: "pending" as const,
  });

  // Handle form submission - validates and adds payment to store
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.email || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    // Create new payment object with unique ID
    const newPayment = {
      id: crypto.randomUUID(),
      email: formData.email,
      amount: Number(formData.amount),
      status: formData.status,
    };

    addPayment(newPayment);
    setFormData({ email: "", amount: "", status: "pending" });
    toast.success("Payment added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Add New Payment</h3>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="user@example.com"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="100"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Payment"}
      </Button>
    </form>
  );
}