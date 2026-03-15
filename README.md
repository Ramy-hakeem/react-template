# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## State management (Zustand)

This template includes a professional Zustand setup with best practices for scalable state management.

### 🏗️ Architecture

- **Modular stores**: Separate stores for different domains (`useCounterStore`, `usePaymentsStore`)
- **TypeScript**: Full type safety with interfaces and proper typing
- **Middleware**: DevTools for debugging, Persist for localStorage
- **Custom hooks**: Reusable hooks for common operations
- **Selectors**: Performance-optimized state subscriptions

### 📁 File Structure

```
src/
├── lib/
│   └── stores.ts          # All Zustand stores with middleware
├── hooks/
│   └── usePayments.ts     # Custom hooks for business logic
└── components/
    ├── ZustandDemo.tsx    # Simple counter demo
    └── PaymentForm.tsx    # Form component using Zustand
```

### 🚀 Getting Started

1. **Run the dev server:**
   ```bash
   npm run dev
   ```

2. **Check the demo components:**
   - `ZustandDemo` - Simple counter with Zustand
   - `PaymentForm` - Add payments to the store

3. **Use stores in your components:**
   ```tsx
   import { useCounterStore } from "./lib/stores";

   export function MyComponent() {
     const count = useCounterStore((state) => state.count);
     const increment = useCounterStore((state) => state.increment);

     return <button onClick={increment}>Count: {count}</button>;
   }
   ```

### 🛠️ Best Practices Implemented

#### 1. **Store Organization**
- Separate stores by domain/feature
- Use interfaces for type safety
- Group related state and actions
- **No code duplication** - single source of truth

#### 2. **Performance**
- Use selectors to prevent unnecessary re-renders
- Custom hooks for complex logic
- Debounced search for better UX

#### 3. **Developer Experience**
- Redux DevTools integration
- Action names for debugging
- Persistent state for development

#### 4. **Error Handling**
- Loading states
- Error states
- User feedback with toasts

### 📝 Creating New Components

#### Option 1: Use Existing Store
```tsx
import { usePayments } from "../lib/stores";

export function PaymentList() {
  const { filteredPayments, isLoading, error } = usePayments();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {filteredPayments.map(payment => (
        <li key={payment.id}>{payment.email} - ${payment.amount}</li>
      ))}
    </ul>
  );
}
```

#### Option 2: Create Custom Hook
```tsx
// In src/hooks/useAuth.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    // Login logic
  },
  logout: () => set({ user: null }),
}));

// Custom hook
export const useAuth = () => {
  const { user, login, logout } = useAuthStore();
  return { user, login, logout, isAuthenticated: !!user };
};
```

#### Option 3: Add to Existing Store
```tsx
// In src/lib/stores.ts
interface AppState extends CounterState, PaymentsState {
  // Add new state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Update the store
export const useAppStore = create<AppState>()(
  // ... existing code
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
);
```

### 🔧 Available Stores

- **`useCounterStore`**: Simple counter (demo purposes)
- **`usePaymentsStore`**: Payments CRUD with search/filter
- **`useAuthStore`**: Authentication (create when needed)

### 🎯 Custom Hooks

- **`usePayments()`**: All payment operations
- **`usePaymentActions()`**: Async CRUD operations
- **`useDebouncedSearch()`**: Debounced search input
- **`usePaymentStats()`**: Computed payment statistics

### 🐛 Debugging

1. **Redux DevTools**: Install the browser extension
2. **Action names**: All actions are named for easy debugging
3. **State inspection**: Full state visible in DevTools
4. **Time travel**: Undo/redo state changes

### 📚 Advanced Patterns

#### Async Actions with Error Handling
```tsx
const myAsyncAction = async (data: SomeData) => {
  try {
    set({ isLoading: true, error: null });
    const result = await apiCall(data);
    set({ data: result, isLoading: false });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
};
```

#### Computed Selectors
```tsx
export const useCompletedPayments = () =>
  usePaymentsStore((state) =>
    state.payments.filter(p => p.status === 'success')
  );
```

#### Store Composition
```tsx
// Combine multiple stores
const useCombinedStore = () => ({
  ...useCounterStore(),
  ...usePaymentsStore(),
});
```

### 🚨 Avoiding Code Duplication

**❌ Don't do this:**
```tsx
// store.ts - Old version
export const useStore = create({...})

// stores.ts - New version  
export const useStore = create({...}) // Duplicate!
```

**✅ Do this instead:**
- **Refactor incrementally**: Update existing stores instead of creating new ones
- **Single source of truth**: Keep one store file per domain
- **Clean up old code**: Remove unused files after migration
- **Use imports**: Reference shared types/interfaces from one place
