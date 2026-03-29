import { PaymentForm } from './components/PaymentForm';
import { YupFormDemo } from './components/YupFormDemo';
import { LoginFormExample } from './components/LoginFormExample';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">React Form Validation</h1>
          <p className="text-gray-600">Yup + React Hook Form Integration</p>
        </div>

        {/* Demos */}
        <div className="grid gap-8 md:grid-cols-2">
          <YupFormDemo />
          <LoginFormExample />
        </div>

        {/* Original Payment Form */}
        <div className="max-w-md mx-auto">
          <PaymentForm />
        </div>
      </div>
    </div>
  );
}
