export interface PermissionData {
  id: string;
  displayName: string;
  description: string | null;
}
export interface AssignPermissionToRolePayload {
  roleId: string;
  permissionIds: string[];
}
