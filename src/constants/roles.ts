import { UserRole } from '@/types/user.types';

export interface RoleHierarchyEntry {
  role: UserRole;
  label: string;
  accountType: string;
}

export const ROLE_HIERARCHY: RoleHierarchyEntry[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', accountType: 'superadmin' },
  { role: 'ADMIN', label: 'Admin', accountType: 'admin' },
  { role: 'SUPER_MASTER', label: 'Super Master', accountType: 'supermaster' },
  { role: 'MASTER', label: 'Master', accountType: 'master' },
  { role: 'AGENT', label: 'Agent', accountType: 'agent' },
  { role: 'CLIENT', label: 'Client', accountType: 'client' },
];

/**
 * Roles a given logged-in role is allowed to create — everything below it in the hierarchy.
 */
export function getCreatableRoles(currentRole: UserRole | undefined): RoleHierarchyEntry[] {
  const index = ROLE_HIERARCHY.findIndex((entry) => entry.role === currentRole);
  if (index === -1) return [];
  return ROLE_HIERARCHY.slice(index + 1);
}
