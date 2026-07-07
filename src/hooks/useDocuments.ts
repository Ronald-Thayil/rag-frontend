import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/document.service';
import toast from 'react-hot-toast';
import type { IApiResponse, PaginatedData } from '../types/api';
import type { Document, DocumentStatusResponse, Chunk } from '../types/document';

export function useDocuments(companyId: string, params?: Record<string, unknown>,) {
  return useQuery<IApiResponse<PaginatedData<Document>>>({
    queryKey: ['documents', params],
    queryFn: () => documentService.list(companyId, params),
  });
}

export function useDocument(id: string | undefined, companyId: string) {
  return useQuery<IApiResponse<Document>>({
    queryKey: ['document', id],
    queryFn: () => documentService.getById(id!, companyId),
    enabled: !!id,
  });
}

export function useDocumentStatus(id: string | undefined, companyId: string) {
  return useQuery<IApiResponse<DocumentStatusResponse>>({
    queryKey: ['document-status', id],
    queryFn: () => documentService.getStatus(id!, companyId),
    enabled: !!id,
    refetchInterval: 5000,
  });
}

export function useDocumentChunks(id: string | undefined, companyId: string, params?: Record<string, unknown>) {
  return useQuery<IApiResponse<PaginatedData<Chunk>>>({
    queryKey: ['document-chunks', id, params],
    queryFn: () => documentService.getChunks(id!, companyId, params),
    enabled: !!id,
  });
}

export function useUploadDocument(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => documentService.upload(formData, companyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully');
      return data;
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload document';
      toast.error(msg);
    },
  });
}

export function useRefreshDocumentStatus(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentService.getStatus(id, companyId),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document status refreshed');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to refresh status';
      toast.error(msg);
    },
  });
}
