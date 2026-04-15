import { z } from 'zod';

// Signup schema with validation rules
export const signupSchema = z.object({
  userName: z.string().min(1, 'User Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Type inferred from schema
export type SignupFormData = z.infer<typeof signupSchema>;