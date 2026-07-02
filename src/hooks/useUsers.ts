import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import toast from 'react-hot-toast';
import type { IApiResponse, PaginatedData } from '../types/api';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

export function useUsers(params?: Record<string, unknown>, companyId?: string) {
  return useQuery<IApiResponse<PaginatedData<User>>>({
    queryKey: ['users', params, companyId],
    queryFn: () => userService.list(params, companyId).then(res => res.data),
  });
}

export function useUser(id: string | undefined, companyId?: string) {
  return useQuery<IApiResponse<User>>({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id!, companyId).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, companyId }: { data: CreateUserRequest; companyId?: string }) =>
      userService.create(data, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create user';
      toast.error(msg);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, companyId }: { id: string; data: UpdateUserRequest; companyId?: string }) =>
      userService.update(id, data, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update user';
      toast.error(msg);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyId }: { id: string; companyId?: string }) =>
      userService.delete(id, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete user';
      toast.error(msg);
    },
  });
}
