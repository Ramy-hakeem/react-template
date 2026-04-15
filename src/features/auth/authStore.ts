import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  formData: Record<string, any>; // For storing form data dynamically

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setFormData: (key: string, value: any) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    formData: {},
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token, isAuthenticated: !!token }),
    setFormData: (key, value) => set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),
  })),
);
