import { z } from 'zod';

export const updateProfileSchema = z.object({
  Name: z.string().min(1, 'Name is required'),
  Email: z.string().min(1, 'Email is required'),
  Gender: z.string().regex(/^[12]$/, 'Please select a gender'),
  DateOfBirth: z.string().date('Invalid date format (YYYY-MM-DD)'),
  Id: z.uuid('Invalid ID'),
  UserName: z.string().min(1, 'UserName is required'),
  // keep your current phone regex if this matches backend
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
