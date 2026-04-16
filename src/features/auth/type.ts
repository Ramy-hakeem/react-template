import type z from 'zod';
import type { signupSchema } from './validationSchemas';

export interface LoginRequest {
  userName: string;
  password: string;
  forceLogin: boolean;
}
export interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  need2FA: boolean;
  userName: string;
  isLockout: boolean;
  isNotAllowed: boolean;
  anotherDeviceLoggedIn: boolean;
}
export type SignupFormData = z.infer<typeof signupSchema>;
export type SignupPayload = Omit<SignupFormData, 'confirmPassword'>;

export interface ProfileData {
  userName: string;
  email: string;
  isActive: boolean;
  userType: string;
  roles: {
    id: string;
    name: string;
  }[];
  id: string;
  createdDate: string;
}
