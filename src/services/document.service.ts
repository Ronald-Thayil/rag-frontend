import api from './api';
import type { IApiResponse, PaginatedData } from '../types/api';
import type { Document, DocumentStatusResponse, UploadResult, Chunk } from '../types/document';

export const documentService = {
  list: (companyId: string, params?: Record<string, unknown>,) =>
    api.get<IApiResponse<PaginatedData<Document>>>('/documents', { params, headers: { 'x-company-id': companyId } }).then(res => res.data),

  getById: (id: string, companyId: string) =>
    api.get<IApiResponse<Document>>(`/documents/${id}`, { headers: { 'x-company-id': companyId } }).then(res => res.data),

  getStatus: (id: string, companyId: string) =>
    api.get<IApiResponse<DocumentStatusResponse>>(`/documents/${id}/status`, { headers: { 'x-company-id': companyId } }).then(res => res.data),

  getChunks: (id: string, companyId: string, params?: Record<string, unknown>) =>
    api.get<IApiResponse<PaginatedData<Chunk>>>(`/documents/${id}/chunks`, { headers: { 'x-company-id': companyId }, params }).then(res => res.data),

  upload: (formData: FormData, companyId: string) =>
    api.post<IApiResponse<UploadResult>>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'x-company-id': companyId },
    }).then(res => res.data),
};
