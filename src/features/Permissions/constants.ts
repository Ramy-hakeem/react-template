export const PERMISSIONS = {
  users: {
    view: 'Permissions.Users.View',
    edit: 'Permissions.Users.Edit',
    delete: 'Permissions.Users.Delete',
  },

  roles: {
    view: 'Permissions.Roles.View',
    create: 'Permissions.Roles.Create',
    edit: 'Permissions.Roles.Edit',
    delete: 'Permissions.Roles.Delete',
  },
} as const;

export type PermissionId =
  | (typeof PERMISSIONS.users)[keyof typeof PERMISSIONS.users]
  | (typeof PERMISSIONS.roles)[keyof typeof PERMISSIONS.roles];
