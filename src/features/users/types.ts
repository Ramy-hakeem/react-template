export interface UserData {
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

export interface GetAllUsersPayload {
  pageNumber: number;
  pageSize: number;
}
