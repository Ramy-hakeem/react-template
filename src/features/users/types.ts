import type z from "zod";
import type { updateProfileSchema } from "./validationSchemas";

export interface UserData {
  userName: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
  userType: string;
  roles: {
    id: string;
    name: string;
  }[];
  id: string;
  createdDate: string;
}

export interface GetAllUsersPayload {
  pageNumber: number;
  pageSize: number;
}

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;