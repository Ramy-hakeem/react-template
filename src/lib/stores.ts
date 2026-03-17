// Zustand stores configuration
// Centralized state management for the application with DevTools and persistence

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Payment type - represents a single payment in the system
export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

// Counter store type definition - simple example store
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (count: number) => void;
}

// Payments store type definition - manages payment data with search/filter
interface PaymentsState {
  payments: Payment[];
  searchTerm: string;
  filteredPayments: Payment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSearchTerm: (term: string) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// ============================================================================
// COUNTER STORE
// ============================================================================
// Simple counter store - demonstrates basic Zustand patterns
// Uses DevTools middleware for debugging
export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), false, "increment"),
      decrement: () => set((state) => ({ count: state.count - 1 }), false, "decrement"),
      reset: () => set({ count: 0 }, false, "reset"),
      setCount: (count) => set({ count }, false, "setCount"),
    }),
    { name: "counter-store" }
  )
);

// ============================================================================
// PAYMENTS STORE
// ============================================================================
// Payments store with data persistence and search/filter functionality
// Uses DevTools for debugging and Persist middleware for localStorage
export const usePaymentsStore = create<PaymentsState>()(
  devtools(
    persist(
      (set) => ({
        // Initial payment data for demo
        payments: [
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
            id: "728ed52f-2",
            amount: 100,
            status: "success",
            email: "m@example.com",
          },
          {
            id: "489e1d42-2",
            amount: 125,
            status: "failed",
            email: "example@gmail.com",
          },
        ],
        searchTerm: "",
        filteredPayments: [],
        isLoading: false,
        error: null,

        // Update search term and filter payments by email
        setSearchTerm: (term) => {
          set((state) => {
            const filtered = state.payments.filter((payment) =>
              payment.email.toLowerCase().includes(term.toLowerCase())
            );
            return { searchTerm: term, filteredPayments: filtered };
          }, false, "setSearchTerm");
        },

        // Add new payment to store and update filtered results
        addPayment: (payment) => {
          set((state) => ({
            payments: [...state.payments, payment],
            filteredPayments: state.searchTerm
              ? [...state.payments, payment].filter((p) =>
                  p.email.toLowerCase().includes(state.searchTerm.toLowerCase())
                )
              : [...state.payments, payment],
          }), false, "addPayment");
        },

        // Update existing payment and refresh filtered results
        updatePayment: (id, updates) => {
          set((state) => {
            const updatedPayments = state.payments.map((payment) =>
              payment.id === id ? { ...payment, ...updates } : payment
            );
            return {
              payments: updatedPayments,
              filteredPayments: state.searchTerm
                ? updatedPayments.filter((p) =>
                    p.email.toLowerCase().includes(state.searchTerm.toLowerCase())
                  )
                : updatedPayments,
            };
          }, false, "updatePayment");
        },

        // Delete payment and update filtered results
        deletePayment: (id) => {
          set((state) => {
            const updatedPayments = state.payments.filter((p) => p.id !== id);
            return {
              payments: updatedPayments,
              filteredPayments: state.searchTerm
                ? updatedPayments.filter((p) =>
                    p.email.toLowerCase().includes(state.searchTerm.toLowerCase())
                  )
                : updatedPayments,
            };
          }, false, "deletePayment");
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),
        setError: (error) => set({ error }, false, "setError"),
      }),
      {
        name: "payments-store",
        partialize: (state) => ({
          payments: state.payments,
          searchTerm: state.searchTerm,
        }),
      }
    ),
    { name: "payments-store" }
  )
);

// Custom hooks for easier component usage
export const useCounter = () => {
  const { count, increment, decrement, reset } = useCounterStore();
  return { count, increment, decrement, reset };
};

export const usePayments = () => {
  const {
    payments,
    filteredPayments,
    searchTerm,
    isLoading,
    error,
    setSearchTerm,
    addPayment,
    updatePayment,
    deletePayment,
  } = usePaymentsStore();

  return {
    payments,
    filteredPayments,
    searchTerm,
    isLoading,
    error,
    setSearchTerm,
    addPayment,
    updatePayment,
    deletePayment,
  };
};

// Selector hooks for performance
export const usePaymentCount = () => usePaymentsStore((state) => state.payments.length);
export const useFilteredPaymentCount = () => usePaymentsStore((state) => state.filteredPayments.length);
export const usePaymentsLoading = () => usePaymentsStore((state) => state.isLoading);