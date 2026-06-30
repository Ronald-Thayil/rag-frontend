import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/company.service';
import toast from 'react-hot-toast';
import type { IApiResponse, PaginatedData } from '../types/api';
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../types/company';

export function useCompanies(params?: Record<string, unknown>) {
  return useQuery<IApiResponse<PaginatedData<Company>>>({
    queryKey: ['companies', params],
    queryFn: () => companyService.list(params),
  });
}

export function useCompany(id: string | undefined) {
  return useQuery<IApiResponse<Company>>({
    queryKey: ['companies', id],
    queryFn: () => companyService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyRequest) => companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create company';
      toast.error(msg);
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyRequest }) => companyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company updated successfully');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update company';
      toast.error(msg);
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete company';
      toast.error(msg);
    },
  });
}
