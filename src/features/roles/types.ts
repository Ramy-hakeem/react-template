export interface RoleData {
  id: string;
  name: string;
}

export interface UpsertRolePayload {
  id: string;
  name: string;
}

export interface AssignRolePermissionsPayload {
  roleId: string;
  permissionIds: string[];
}
