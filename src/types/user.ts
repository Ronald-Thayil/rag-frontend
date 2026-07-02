export type UserRole = 'member' | 'company_admin' | 'admin';

export interface User {
  id: string;
  company_id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CreateUserRequest {
  company_id: string;
  email: string;
  password_hash: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: UserRole;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password_hash?: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: UserRole;
  is_active?: boolean;
}
