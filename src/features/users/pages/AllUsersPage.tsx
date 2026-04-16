import { DataTable } from '@/components/layout/data-table/DataTable';
import { type ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { useGetAllUsers } from '../api';
import type { UserData } from '../types';

// TypeScript interface for User data

// Mock data generator

const AllUsersPage: React.FC = () => {
  const { data, isLoading } = useGetAllUsers(1, 10);
  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
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
        const role = info.getValue<string>()[0];
        const roleColors = {
          Admin: 'bg-purple-100 text-purple-800',
          User: 'bg-blue-100 text-blue-800',
          Moderator: 'bg-green-100 text-green-800',
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}
          >
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue<boolean>() ? 'Active' : 'Inactive';
        console.log(status);
        const statusColors = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-red-100 text-red-800',
        };
        const statusDots = {
          Active: 'bg-green-500',
          Inactive: 'bg-red-500',
        };
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusDots[status as keyof typeof statusDots]}`}
            ></div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {/* Table */}
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
