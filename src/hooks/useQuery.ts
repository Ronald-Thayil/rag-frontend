import { useMutation } from '@tanstack/react-query';
import { queryService } from '../services/query.service';
import toast from 'react-hot-toast';
import type { QueryRequest } from '../types/document';

export function useAskQuery(companyId: string) {
  return useMutation({
    mutationFn: (data: QueryRequest) => queryService.ask(data, companyId),
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to get answer';
      toast.error(msg);
    },
  });
}
