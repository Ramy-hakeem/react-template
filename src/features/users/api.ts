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
  { pageNumber: number; pageSize: number },
  { data: UserData[]; total: number }
>({
  url: '/api/Account/list',
  method: 'POST',
});

export const useGetAllUsers = ({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: ['allUsers', pageNumber, pageSize],
    queryFn: async () => {
      const response = await getAllUsers({ pageNumber, pageSize });
      return response;
    },
    staleTime: Infinity,
  });
};
