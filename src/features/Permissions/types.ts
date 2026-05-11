export interface PermissionData {
  id: string;
  displayName: string;
  description: string | null;
}

export interface AssignPermissionToRolePayload {
  roleId: string;
  permissionIds: string[];
}

export interface AssignPermissionToUserPayload {
  userId: string;
  permissionIds: string[];
}
