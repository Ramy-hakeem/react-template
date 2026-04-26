import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  id: z.uuid('Invalid ID'),
  // email: z.email('Invalid email address'),
  email: z.string('Invalid email address'),
  dateOfBirth: z.string().date('Invalid date format (YYYY-MM-DD)'),
  gender: z.string().regex(/^[12]$/, 'Please select a gender'),
  UserName: z.string().min(1, 'UserName is required'),
  PhoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(6, 'Confirm new password is required'),
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmNewPassword'],
    },
  );
