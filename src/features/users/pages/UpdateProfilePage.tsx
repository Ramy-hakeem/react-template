import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCurrentUserQuery, useUpdateProfileMutation } from '../api';
import { updateProfileSchema } from '../validationSchemas';

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export default function UpdateProfilePage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetCurrentUserQuery(null);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: data ? { userName: data.userName, email: data.email } : {},
  });

  const onSubmit = async (formData: UpdateProfileForm) => {
    try {
      await updateProfile(formData).unwrap();
      navigate('/profile');
    } catch (err: any) {
      setError('root', { message: err?.data?.message || 'Failed to update profile' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Failed to Load Profile
          </h2>
          <p className="text-slate-500 mb-4">
            Unable to fetch user profile data. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Update Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              {...register('userName')}
              placeholder="Enter your username"
            />
            {errors.userName && (
              <p className="text-red-600 text-sm">{errors.userName.message}</p>
            )}
          </Field>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </Field>
          {errors.root && (
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          )}
          <div className="flex gap-4">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
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