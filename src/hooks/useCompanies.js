import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/company.service';
import toast from 'react-hot-toast';

export function useCompanies(params = {}) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companyService.list(params),
    select: (res) => res.data,
  });
}

export function useCompany(id) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => companyService.getById(id),
    enabled: !!id,
    select: (res) => res.data,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to create company';
      toast.error(msg);
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => companyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company updated successfully');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to update company';
      toast.error(msg);
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to delete company';
      toast.error(msg);
    },
  });
}
