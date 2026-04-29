import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
    watch,
    reset,
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      Name: '',
      Email: '',
      Gender: '',
      DateOfBirth: '',
      Id: '',
      UserName: '',
      PhoneNumber: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        Name: data.name || '',
        Id: data.id || '',
        Email: data.email || '',
        DateOfBirth: data.dateOfBirth || '',
        Gender:
          data.gender === 'Male'
            ? '1'
            : data.gender === 'Female'
              ? '2'
              : data.gender || '',
        UserName: data.userName || '',
        PhoneNumber: data.phoneNumber || '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: UpdateProfileForm) => {
    try {
      await updateProfile(formData).unwrap();
      navigate('/profile');
    } catch (err: any) {
      setError('root', {
        message: err?.data?.message || 'Failed to update profile',
      });
    }
  };
  console.log('DateOfBirth', watch('DateOfBirth'));
  console.log('PhoneNumber', watch('PhoneNumber'));
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
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Update Profile
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('Id')} />
          <Field>
            <Label htmlFor="Name">Name</Label>
            <Input
              id="Name"
              {...register('Name')}
              placeholder="Enter your name"
            />
            {errors.Name && (
              <p className="text-red-600 text-sm">{errors.Name.message}</p>
            )}
          </Field>
          <Field>
            <Label htmlFor="UserName">UserName</Label>
            <Input
              id="UserName"
              {...register('UserName')}
              placeholder="Enter your username"
              disabled
              className="bg-slate-100 text-slate-500 cursor-not-allowed"
            />
            {errors.UserName && (
              <p className="text-red-600 text-sm">{errors.UserName.message}</p>
            )}
          </Field>
          <Field>
            <Label htmlFor="Email">Email</Label>
            <Input
              id="Email"
              type="email"
              {...register('Email')}
              placeholder="Enter your email"
              disabled
              className="bg-slate-100 text-slate-500"
            />
            {errors.Email && (
              <p className="text-red-600 text-sm">{errors.Email.message}</p>
            )}
          </Field>
          <Field>
            <Label htmlFor="DateOfBirth">Date of Birth</Label>
            <Input
              id="DateOfBirth"
              type="date"
              {...register('DateOfBirth')}
              placeholder="Enter your date of birth"
            />
            {errors.DateOfBirth && (
              <p className="text-red-600 text-sm">
                {errors.DateOfBirth.message}
              </p>
            )}
          </Field>
          <Field>
            <Label htmlFor="Gender">Gender</Label>
            <select
              id="Gender"
              {...register('Gender')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select your gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
            {errors.Gender && (
              <p className="text-red-600 text-sm">{errors.Gender.message}</p>
            )}
          </Field>

          <Field>
            <Label htmlFor="PhoneNumber">Phone Number</Label>
            <Input
              id="PhoneNumber"
              {...register('PhoneNumber')}
              placeholder="Enter your phone number"
            />
            {errors.PhoneNumber && (
              <p className="text-red-600 text-sm">
                {errors.PhoneNumber.message}
              </p>
            )}
          </Field>
          {errors.root && (
            <p className="text-red-600 text-sm">{errors.root.message}</p>
          )}
          <div className="flex gap-4">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
