import type z from "zod";
import type { updateProfileSchema } from "./validationSchemas";

export interface UserData {
  userName?: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  userType?: string;
  roles: string[];
  id: string;
  createdDate: string;
  phoneNumber: string | null;
}

export interface GetAllUsersPayload {
  pageNumber: number;
  pageSize: number;
  filters?: {
    propertyName: string;
    values: string[];
    type: string;
    operator: string;
  }[];
  sorts?: {
    propertyName: string;
    direction: 'asc' | 'desc'|"";
  }[];
  searchTerm?: string;
  deltaToken?: string;
  id?: string;
  role?: string;
}

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;