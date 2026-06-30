import type { User } from './user';
import type { AuthUser } from './admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  access_token: string;
  user: User;
}

export interface LoginAdminResponse {
  access_token: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access_token: string;
}
