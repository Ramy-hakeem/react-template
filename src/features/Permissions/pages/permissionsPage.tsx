import { DataTable } from '@/components/layout/data-table/DataTable';
import { type ColumnDef } from '@tanstack/react-table';
import { useLazyGetAllPermissionsQuery } from '../api';
import { TableAction } from '@/components/layout/data-table/TableAction';
import { useNavigate } from 'react-router-dom';
import type { PermissionData } from '../types';

const PermissionsPage: React.FC = () => {
  const [getAllPermissions, { data, isLoading }] =
    useLazyGetAllPermissionsQuery();

  const navigate = useNavigate();
  const columns: ColumnDef<PermissionData>[] = [
    {
      accessorKey: 'id',
      header: 'Name',
      cell: (info) => info.getValue<string>().split('.')[1],
    },
    {
      accessorKey: 'id',
      header: 'Permission',
      cell: (info) => info.getValue<string>().split('.')[2],
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => (
        <span className="text-gray-600">{info.getValue<string>()}</span>
      ),
    },

    {
      header: 'Action',
      cell({ row }) {
        const { id } = row.original;
        return (
          <TableAction
            actions={[
              {
                label: 'Add to User',
                onClick() {
                  navigate(`assign-to-user?permission=${id}`);
                },
              },
              {
                label: 'Add to Role',
                onClick: () => {
                  navigate(`assign-to-role?permission=${id}`);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTable<PermissionData>
      columns={columns}
      isLoading={isLoading}
      data={data?.data || []}
      handleDataChange={({ pageNumber, pageSize, searchTerm, sorts }) => {
        getAllPermissions({
          pageNumber,
          pageSize,
          searchTerm,
          sorts,
        });
      }}
      numberOfPages={data?.totalPages}
      totalCount={data?.totalCount}
    />
  );
};

export default PermissionsPage;
