import createApi from '@/app/api/axiosBaseQuery';
import { useQuery } from '@tanstack/react-query';
import type { UserData } from './types';

// Get Current User
const getUser = createApi<null, UserData>({
  url: '/api/Account/GetCurrentUser',
  method: 'GET',
});

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const response = await getUser();

      if (!response.isSuccess) {
        throw new Error('Failed to fetch user');
      }

      return response.data;
    },
  });
};

const getAllUsers = createApi<
  { pageindex: number; pageSize: number },
  { data: UserData[]; total: number }
>({
  url: '/api/Account/list',
  method: 'POST',
});

export const useGetAllUsers = (pageIndex: number, pageSize: number) => {
  return useQuery({
    queryKey: ['allUsers', pageIndex, pageSize],
    queryFn: async () => {
      const response = await getAllUsers({ pageindex: pageIndex, pageSize });
      if (response.isSuccess) {
        return response.data;
      } else {
        return [];
      }
    },
    staleTime: Infinity,
  });
};
