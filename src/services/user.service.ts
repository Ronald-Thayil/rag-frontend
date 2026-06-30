import api from './api';
import type { IApiResponse, PaginatedData } from '../types/api';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

function getHeaders(companyId?: string): Record<string, string> {
  return companyId ? { 'x-company-id': companyId } : {};
}

export const userService = {
  list: (params?: Record<string, unknown>, companyId?: string) =>
    api.get<IApiResponse<PaginatedData<User>>>('/users', {
      params,
      headers: getHeaders(companyId),
    }),

  getById: (id: string, companyId?: string) =>
    api.get<IApiResponse<User>>(`/users/${id}`, {
      headers: getHeaders(companyId),
    }),

  create: (data: CreateUserRequest, companyId?: string) =>
    api.post<IApiResponse<User>>('/users', data, {
      headers: getHeaders(companyId),
    }),

  update: (id: string, data: UpdateUserRequest, companyId?: string) =>
    api.put<IApiResponse<User>>(`/users/${id}`, data, {
      headers: getHeaders(companyId),
    }),

  delete: (id: string, companyId?: string) =>
    api.delete<IApiResponse<null>>(`/users/${id}`, {
      headers: getHeaders(companyId),
    }),
};
