import { useEffect, useState } from "react";
import { usePaymentsStore, type Payment } from "../lib/stores";

// Custom hook for payment operations
export function usePaymentActions() {
  const { addPayment, updatePayment, deletePayment, setLoading, setError } = usePaymentsStore();

  const createPayment = async (paymentData: Omit<Payment, 'id'>): Promise<Payment> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPayment = {
        ...paymentData,
        id: crypto.randomUUID(),
      };

      addPayment(newPayment);
      return newPayment;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create payment';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removePayment = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      deletePayment(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete payment';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    removePayment,
    updatePayment,
  };
}

// Custom hook for debounced search
export function useDebouncedSearch(delay: number = 300) {
  const { setSearchTerm } = usePaymentsStore();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchValue, setSearchTerm, delay]);

  return {
    searchValue,
    setSearchValue,
  };
}

// Custom hook for payment statistics
export function usePaymentStats() {
  const payments = usePaymentsStore((state) => state.payments);

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    processing: payments.filter(p => p.status === 'processing').length,
    success: payments.filter(p => p.status === 'success').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    averageAmount: payments.length > 0 ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length : 0,
  };

  return stats;
}