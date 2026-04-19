import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePasswordMutation } from '../api';
import { changePasswordSchema } from '../validationSchemas';

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (formData: ChangePasswordForm) => {
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();
      reset();
      navigate('/profile');
    } catch (err: any) {
      setError('root', { message: err?.data?.message || 'Failed to change password' });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Change Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register('currentPassword')}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className="text-red-600 text-sm">{errors.currentPassword.message}</p>
            )}
          </Field>
          <Field>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              placeholder="Enter your new password"
            />
            {errors.newPassword && (
              <p className="text-red-600 text-sm">{errors.newPassword.message}</p>
            )}
          </Field>
          <Field>
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              {...register('confirmNewPassword')}
              placeholder="Confirm your new password"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-600 text-sm">{errors.confirmNewPassword.message}</p>
            )}
          </Field>
          {errors.root && (
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          )}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
