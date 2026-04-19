import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={router} />;
    </Provider>
  );
}
