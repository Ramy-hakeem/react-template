import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/features/auth/authStore';

// Hook for forms with Zod validation and store integration
export function useFormWithStore(
  schema: z.ZodSchema,
  defaultValues: Record<string, unknown>,
  onSubmit?: (data: Record<string, unknown>) => void
) {
  const { setFormData } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Store the form data
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      setFormData(key, value);
    });

    // Call custom onSubmit if provided
    if (onSubmit) {
      onSubmit(data as Record<string, unknown>);
    } else {
      console.log('Form submitted:', data); // For now, just log
    }
  });

  return { ...form, handleSubmit };
}