export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MASTER' | 'AGENT' | 'CLIENT';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  exposure: number;
  creditLimit: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  avatarUrl?: string;
  createdAt: string;
}
