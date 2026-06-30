import api from './api';
import type { IApiResponse, PaginatedData } from '../types/api';
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../types/company';

export const companyService = {
  list: (params?: Record<string, unknown>) =>
    api.get<IApiResponse<PaginatedData<Company>>>('/companies', { params }).then(res => res.data),

  getById: (id: string) =>
    api.get<IApiResponse<Company>>(`/companies/${id}`).then(res => res.data),

  create: (data: CreateCompanyRequest) =>
    api.post<IApiResponse<Company>>('/companies', data).then(res => res.data),

  update: (id: string, data: UpdateCompanyRequest) =>
    api.put<IApiResponse<Company>>(`/companies/${id}`, data).then(res => res.data),

  delete: (id: string) =>
    api.delete<IApiResponse<null>>(`/companies/${id}`).then(res => res.data),
};
