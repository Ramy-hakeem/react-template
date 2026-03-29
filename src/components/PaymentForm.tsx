// PaymentForm component - allows users to add new payments to the Zustand store
// Demonstrates integration with Zustand state management and form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePayments } from "../lib/stores";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

// Validation schema
const paymentSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email required"),
  amount: yup.number().positive("Amount must be positive").required("Amount required"),
});

type PaymentFormData = yup.InferType<typeof paymentSchema>
type PaymentStatus = "pending" | "processing" | "success" | "failed";

export function PaymentForm() {
  // Get addPayment action and loading state from Zustand store
  const { addPayment, isLoading } = usePayments();
  
  // Form setup with Yup validation
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
    defaultValues: { email: "", amount: 0 },
  });

  // Local status state
  const [status, setStatus] = useState<PaymentStatus>("pending");

  // Handle form submission - called only if validation passes
  const onSubmit = (data: PaymentFormData) => {
    // Create new payment object with unique ID
    const newPayment = {
      id: crypto.randomUUID(),
      email: data.email,
      amount: data.amount,
      status: status,
    };

    addPayment(newPayment);
    reset();
    setStatus("pending");
    toast.success("Payment added successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Add New Payment</h3>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="user@example.com"
          disabled={isLoading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          {...register("amount", { valueAsNumber: true })}
          placeholder="100"
          disabled={isLoading}
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus)}
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