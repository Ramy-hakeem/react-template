import { useMemo, useRef, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit2, Plus, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '@/components/layout/data-table/DataTable';
import { TableAction } from '@/components/layout/data-table/TableAction';
import type { Action, DataTableRef } from '@/components/layout/data-table/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllPermissionsQuery, useGetMyPermissionsQuery } from '@/features/Permissions/api';
import type { PermissionData } from '@/features/Permissions/types';
import {
  useAssignRolePermissionsMutation,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useLazyGetAllRolesQuery,
  useUpdateRoleMutation,
} from '../api';
import type { RoleData } from '../types';

const ROLE_PERMISSION_IDS = {
  view: 'Permissions.Roles.View',
  create: 'Permissions.Roles.Create',
  edit: 'Permissions.Roles.Edit',
  delete: 'Permissions.Roles.Delete',
} as const;

const CORE_ROLE_NAMES = ['Admin', 'SuperAdmin'];

type RoleDialogMode = 'create' | 'edit';

type RoleFormState = {
  id: string;
  name: string;
  permissionIds: string[];
  permissionsTouched: boolean;
};

type ErrorShape = {
  data?: {
    message?: string;
    title?: string;
    errorCode?: string;
  };
  message?: string;
  title?: string;
  errorCode?: string;
};

const emptyForm: RoleFormState = {
  id: '',
  name: '',
  permissionIds: [],
  permissionsTouched: false,
};

const isCoreRole = (role: RoleData) => CORE_ROLE_NAMES.includes(role.name);

const slugifyRoleId = (value: string) =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getPermissionGroup = (permissionId: string) => {
  const [, group] = permissionId.split('.');
  return group || 'General';
};

const formatPermissionName = (permission: PermissionData) => {
  if (permission.displayName) {
    return permission.displayName;
  }

  const [, group, action] = permission.id.split('.');
  return [group, action].filter(Boolean).join(' - ') || permission.id;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const typedError = error as ErrorShape;

  return (
    typedError.data?.message ||
    typedError.data?.title ||
    typedError.data?.errorCode ||
    typedError.message ||
    typedError.title ||
    typedError.errorCode ||
    fallback
  );
};

export default function RolesManagerPage() {
  const tableRef = useRef<DataTableRef>(null);
  const [getAllRoles, { data, isLoading, isFetching }] =
    useLazyGetAllRolesQuery();
  const { data: myPermissionsData, isLoading: isCheckingPermissions } =
    useGetMyPermissionsQuery({
      pageNumber: 1,
      pageSize: 10000,
    });
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useGetAllPermissionsQuery({
      pageNumber: 1,
      pageSize: 10000,
    });

  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();
  const [assignRolePermissions, { isLoading: isAssigningPermissions }] =
    useAssignRolePermissionsMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<RoleDialogMode>('create');
  const [form, setForm] = useState<RoleFormState>(emptyForm);
  const [formError, setFormError] = useState('');

  const currentPermissionIds = useMemo(
    () => new Set(myPermissionsData?.data.map((permission) => permission.id) || []),
    [myPermissionsData],
  );

  const canViewRoles = currentPermissionIds.has(ROLE_PERMISSION_IDS.view);
  const canCreateRoles = currentPermissionIds.has(ROLE_PERMISSION_IDS.create);
  const canEditRoles = currentPermissionIds.has(ROLE_PERMISSION_IDS.edit);
  const canDeleteRoles = currentPermissionIds.has(ROLE_PERMISSION_IDS.delete);

  const permissions = permissionsData?.data || [];

  const permissionsByGroup = useMemo(() => {
    return permissions.reduce<Record<string, PermissionData[]>>(
      (groups, permission) => {
        const group = getPermissionGroup(permission.id);
        groups[group] = [...(groups[group] || []), permission];
        return groups;
      },
      {},
    );
  }, [permissions]);

  const isSaving = isCreatingRole || isUpdatingRole || isAssigningPermissions;

  const resetDialog = () => {
    setForm(emptyForm);
    setFormError('');
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setForm({ ...emptyForm, permissionsTouched: true });
    setFormError('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (role: RoleData) => {
    setDialogMode('edit');
    setForm({
      id: role.id,
      name: role.name,
      permissionIds: [],
      permissionsTouched: false,
    });
    setFormError('');
    setIsDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((currentForm) => {
      const previousAutoId = slugifyRoleId(currentForm.name);
      const nextAutoId = slugifyRoleId(name);
      const shouldAutoUpdateId =
        dialogMode === 'create' &&
        (!currentForm.id || currentForm.id === previousAutoId);

      return {
        ...currentForm,
        name,
        id: shouldAutoUpdateId ? nextAutoId : currentForm.id,
      };
    });
  };

  const setPermissionChecked = (permissionId: string, checked: boolean) => {
    setForm((currentForm) => {
      const permissionIds = checked
        ? Array.from(new Set([...currentForm.permissionIds, permissionId]))
        : currentForm.permissionIds.filter((id) => id !== permissionId);

      return {
        ...currentForm,
        permissionIds,
        permissionsTouched: true,
      };
    });
  };

  const setGroupChecked = (groupPermissions: PermissionData[], checked: boolean) => {
    setForm((currentForm) => {
      const groupPermissionIds = groupPermissions.map((permission) => permission.id);
      const permissionIds = checked
        ? Array.from(new Set([...currentForm.permissionIds, ...groupPermissionIds]))
        : currentForm.permissionIds.filter((id) => !groupPermissionIds.includes(id));

      return {
        ...currentForm,
        permissionIds,
        permissionsTouched: true,
      };
    });
  };

  const handleSaveRole = async () => {
    const roleId = form.id.trim();
    const roleName = form.name.trim();

    if (!roleId || !roleName) {
      setFormError('Role ID and role name are required.');
      return;
    }

    if (dialogMode === 'create' && form.permissionIds.length === 0) {
      setFormError('Select at least one permission before creating the role.');
      return;
    }

    if (dialogMode === 'edit' && form.permissionsTouched && form.permissionIds.length === 0) {
      setFormError(
        'Select at least one permission, or leave the permissions section untouched to keep the current backend permissions unchanged.',
      );
      return;
    }

    try {
      if (dialogMode === 'create') {
        const createdRole = await createRole({ id: roleId, name: roleName }).unwrap();
        await assignRolePermissions({
          roleId: createdRole.id || roleId,
          permissionIds: form.permissionIds,
        }).unwrap();
        toast.success('Role created and permissions assigned.');
      } else {
        await updateRole({ id: roleId, name: roleName }).unwrap();

        if (form.permissionsTouched) {
          await assignRolePermissions({
            roleId,
            permissionIds: form.permissionIds,
          }).unwrap();
          toast.success('Role updated and permissions replaced.');
        } else {
          toast.success('Role updated.');
        }
      }

      setIsDialogOpen(false);
      resetDialog();
      tableRef.current?.refresh();
    } catch (error) {
      setFormError(getErrorMessage(error, 'Failed to save role.'));
    }
  };

  const handleDeleteRole = async (role: RoleData) => {
    if (!canDeleteRoles) {
      toast.error('You do not have permission to delete roles.');
      return;
    }

    if (isCoreRole(role)) {
      toast.error(`${role.name} is a core system role and cannot be deleted.`);
      return;
    }

    const confirmed = window.confirm(
      `Delete role "${role.name}"? This will remove the role from users assigned to it.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRole(role.id).unwrap();
      toast.success('Role deleted.');
      tableRef.current?.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete role.'));
    }
  };

  const columns: ColumnDef<RoleData>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Role Name',
      cell: (info) => {
        const role = info.row.original;

        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{info.getValue<string>()}</span>
            {isCoreRole(role) && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Core
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'permissions',
      header: 'Permissions',
      enableSorting: false,
      cell: () => (
        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          Permission group
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      enableSorting: false,
      cell: ({ row }) => {
        const role = row.original;
        const actions: Action[] = [];

        if (canEditRoles && !isCoreRole(role)) {
          actions.push({
            label: (
              <span className="flex items-center gap-2">
                <Edit2 className="h-4 w-4" /> Edit
              </span>
            ),
            onClick: () => openEditDialog(role),
          });
        }

        if (canDeleteRoles && !isCoreRole(role)) {
          actions.push({
            label: (
              <span className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-4 w-4" /> Delete
              </span>
            ),
            onClick: () => handleDeleteRole(role),
          });
        }

        if (actions.length === 0) {
          return (
            <span className="text-xs text-muted-foreground">
              {isCoreRole(role) ? 'Protected' : 'No actions'}
            </span>
          );
        }

        return <TableAction actions={actions} />;
      },
    },
  ];

  if (isCheckingPermissions) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Checking your role permissions...
      </div>
    );
  }

  if (!canViewRoles) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Roles access denied</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your account needs the {ROLE_PERMISSION_IDS.view} permission before the
          roles manager can load role data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles Manager</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create, update, delete, and assign permission groups to roles.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          disabled={!canCreateRoles || isLoadingPermissions}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      {!canCreateRoles && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          You can view roles, but your account does not have {ROLE_PERMISSION_IDS.create}.
        </div>
      )}

      <DataTable<RoleData>
        ref={tableRef}
        columns={columns}
        isLoading={isLoading || isFetching || isDeletingRole}
        data={data?.data || []}
        handleDataChange={({ pageNumber, pageSize, searchTerm, sorts }) => {
          getAllRoles({
            pageNumber,
            pageSize,
            searchTerm,
            sorts,
          });
        }}
        numberOfPages={data?.totalPages}
        totalCount={data?.totalCount}
      />

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);

          if (!open) {
            resetDialog();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create Role' : 'Edit Role'}
            </DialogTitle>
            <DialogDescription>
              Roles are permission groups. Select the permissions carefully before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role-id">Role ID</Label>
                <Input
                  id="role-id"
                  value={form.id}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      id: event.target.value,
                    }))
                  }
                  disabled={dialogMode === 'edit'}
                  placeholder="Example: BranchManager"
                />
                <p className="text-xs text-muted-foreground">
                  {dialogMode === 'edit'
                    ? 'Role ID cannot be changed after creation.'
                    : 'This is sent to the backend as the role identifier.'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Example: Branch Manager"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    {dialogMode === 'create'
                      ? 'Choose the permissions that will be assigned after the role is created.'
                      : 'The backend does not expose current role permissions, so this section is only applied if you change it.'}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      permissionIds: [],
                      permissionsTouched: true,
                    }))
                  }
                  disabled={isLoadingPermissions}
                >
                  Clear
                </Button>
              </div>

              {dialogMode === 'edit' && !form.permissionsTouched && (
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                  Existing permissions cannot be preloaded without adding a backend endpoint.
                  Tick permissions here only when you want to replace this role&apos;s permission set.
                </div>
              )}

              {isLoadingPermissions ? (
                <div className="text-sm text-muted-foreground">Loading permissions...</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(permissionsByGroup).map(([group, groupPermissions]) => {
                    const selectedInGroup = groupPermissions.filter((permission) =>
                      form.permissionIds.includes(permission.id),
                    ).length;
                    const allGroupSelected = selectedInGroup === groupPermissions.length;

                    return (
                      <div key={group} className="rounded-md border bg-gray-50 p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{group}</h4>
                            <p className="text-xs text-muted-foreground">
                              {selectedInGroup} of {groupPermissions.length} selected
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGroupChecked(groupPermissions, !allGroupSelected)}
                          >
                            {allGroupSelected ? 'Unselect group' : 'Select group'}
                          </Button>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {groupPermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex cursor-pointer items-start gap-2 rounded-md bg-white p-2 text-sm hover:bg-muted"
                            >
                              <input
                                type="checkbox"
                                className="mt-1"
                                checked={form.permissionIds.includes(permission.id)}
                                onChange={(event) =>
                                  setPermissionChecked(permission.id, event.target.checked)
                                }
                              />
                              <span>
                                <span className="block font-medium text-gray-900">
                                  {formatPermissionName(permission)}
                                </span>
                                {permission.description && (
                                  <span className="block text-xs text-muted-foreground">
                                    {permission.description}
                                  </span>
                                )}
                                <span className="block text-[11px] text-muted-foreground">
                                  {permission.id}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSaveRole}
              disabled={
                isSaving ||
                (dialogMode === 'create' && !canCreateRoles) ||
                (dialogMode === 'edit' && !canEditRoles)
              }
            >
              {isSaving ? 'Saving...' : 'Save Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
