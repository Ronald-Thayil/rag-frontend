import api from './api';
import type { IApiResponse } from '../types/api';
import type { QueryRequest, QueryResponse } from '../types/document';

export const queryService = {
  ask: (data: QueryRequest, companyId: string) =>
    api.post<IApiResponse<QueryResponse>>('/query', data, { headers: { 'x-company-id': companyId } }).then(res => res.data),
};
