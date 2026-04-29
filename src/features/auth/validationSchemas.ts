import { z } from 'zod';

// Signup schema with validation rules
export const signupSchema = z
  .object({
    Name: z.string().min(1, 'Full Name is required'),
    userName: z.string().min(1, 'User Name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password is required'),
  })
  .refine(
    ({ password, confirmPassword }) => {
      return password === confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  );
