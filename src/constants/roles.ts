import { UserRole } from '@/types/user.types';

export const USER_ROLES: Record<UserRole, { label: string; level: number; badgeColor: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', level: 1, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  ADMIN: { label: 'Admin', level: 2, badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' },
  MASTER: { label: 'Master Agent', level: 3, badgeColor: 'bg-purple-100 text-purple-900 border-purple-300' },
  AGENT: { label: 'Agent', level: 4, badgeColor: 'bg-green-100 text-green-900 border-green-300' },
  CLIENT: { label: 'Client / User', level: 5, badgeColor: 'bg-gray-100 text-gray-900 border-gray-300' },
};
