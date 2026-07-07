export type DocumentStatus = 'processing' | 'ready' | 'failed' | 'deleted';

export interface Document {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size_bytes: number;
  status: DocumentStatus;
  metadata: Record<string, unknown> | null;
  page_count: number | null;
  chunk_count: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface DocumentStatusResponse {
  status: DocumentStatus;
  chunk_count: number;
  completed_at: string | null;
  error_message: string | null;
}

export interface UploadResult {
  id: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSizeBytes: number;
  status: 'processing';
  createdAt: string;
}

export interface Chunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  token_count: number;
  created_at: string;
}

export interface SourceResult {
  documentId: string;
  filename: string;
  content: string;
  similarity: number;
}

export interface QueryResponse {
  answer: string;
  sources: SourceResult[];
  cacheHit: boolean;
  cacheSimilarity: number;
  processingTime: number;
}

export interface QueryRequest {
  query: string;
  documentId?: string;
  topK?: number;
  includeSources?: boolean;
}
