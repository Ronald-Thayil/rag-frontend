import api from './api';
import type { IApiResponse } from '../types/api';
import type { LoginUserResponse, LoginAdminResponse } from '../types/auth';

export const authService = {
  loginUser: (credentials: { email: string; password: string }) =>
    api.post<IApiResponse<LoginUserResponse>>('/auth/login/user', credentials),

  loginAdmin: (credentials: { email: string; password: string }) =>
    api.post<IApiResponse<LoginAdminResponse>>('/auth/login/admin', credentials),

  refresh: () =>
    api.post<IApiResponse<{ access_token: string }>>('/auth/refresh'),

  logout: () =>
    api.post<IApiResponse<null>>('/auth/logout'),
};
