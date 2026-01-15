/**
 * Permissions and Roles System
 */

export type Role = 'owner' | 'editor' | 'viewer';

export type Action = 'edit' | 'delete' | 'add' | 'view' | 'share' | 'export';

export const rolePermissions: Record<Role, Action[]> = {
  owner: ['edit', 'delete', 'add', 'view', 'share', 'export'],
  editor: ['edit', 'delete', 'add', 'view', 'export'],
  viewer: ['view', 'export'],
};

export function canPerformAction(role: Role, action: Action): boolean {
  return rolePermissions[role].includes(action);
}

export function isReadOnly(role: Role): boolean {
  return role === 'viewer';
}
