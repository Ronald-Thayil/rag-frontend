import { createContext } from 'react';
import type { User } from '../types/user';
import type { AuthUser } from '../types/admin';

export type ContextUser = User | AuthUser;

export interface AuthContextType {
  user: ContextUser | null;
  loginUser: (email: string, password: string) => Promise<ContextUser>;
  loginAdmin: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
