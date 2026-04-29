import type z from 'zod';
import type {
  changePasswordSchema,
  updateProfileSchema,
} from './validationSchemas';

export interface UserData {
  userName: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
  locked: boolean;
  userType: string;
  roles: {
    id: string;
    name: string;
  }[];
  id: string;
  createdDate: string;
  phoneNumber: string;
}

export interface GetAllUsersPayload {
  pageNumber: number;
  pageSize: number;
}

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export type ChangePasswordPayload = Omit<
  z.infer<typeof changePasswordSchema>,
  'confirmNewPassword'
>;

export interface UpdateStatusPayload {
  UserId: string;
  status: 'Active' | 'Inactive';
}
