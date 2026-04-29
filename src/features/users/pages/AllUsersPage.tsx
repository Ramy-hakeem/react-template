import { DataTable } from '@/components/layout/data-table/DataTable';
import { type ColumnDef } from '@tanstack/react-table';
import { useDeleteUserMutation, useLazyGetAllUsersQuery } from '../api';
import type { UserData } from '../types';
import { TableAction } from '@/components/layout/data-table/TableAction';
import { useNavigate } from 'react-router-dom';

const AllUsersPage: React.FC = () => {
  const [getAllUsers, { data, isLoading }] = useLazyGetAllUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => (
        <span className="text-gray-600">{info.getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'roles',
      header: 'Role',
      cell: (info) => {
        const roles = info.getValue<UserData['roles']>();

        const roleColors: Record<string, string> = {
          SuperAdmin : 'bg-red-100 text-red-800',
          Admin: 'bg-purple-100 text-purple-800',
          User: 'bg-blue-100 text-blue-800',
          Moderator: 'bg-green-100 text-green-800'
        };

        return (
          <>
           {
            roles.map((role) => (<span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              roleColors[role.name] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {role.name}
          </span>))
          }
          </>
         
          
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue<boolean>() ? 'Active' : 'Inactive';

        const statusColors: Record<string, string> = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-red-100 text-red-800',
        };

        const statusDots: Record<string, string> = {
          Active: 'bg-green-500',
          Inactive: 'bg-red-500',
        };

        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusDots[status]}`} />

            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[status]
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Action',
      cell({ row }) {
        const { id } = row.original;
        return (
          <TableAction
            actions={[
              {
                label: 'Details',
                onClick() {
                  navigate(id);
                },
              },
              {
                label: 'Delete',
                onClick: () => {
                  deleteUser(id);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTable<UserData>
      columns={columns}
      isLoading={isLoading}
      data={data?.data || []}
      handleDataChange={({ pageIndex, pageSize, searchTerm, sortBy }) => {
        getAllUsers({
          pageNumber: pageIndex,
          pageSize,
          searchTerm,
          sorts: sortBy ? [sortBy] : [],
        });
      }}
      numberOfPages={data?.totalPages}
      totalCount={data?.totalCount}
    />
  );
};

export default AllUsersPage;