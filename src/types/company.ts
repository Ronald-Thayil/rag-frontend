export interface Company {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CreateCompanyRequest {
  name: string;
  slug: string;
  settings?: Record<string, unknown>;
}

export interface UpdateCompanyRequest {
  name?: string;
  slug?: string;
  settings?: Record<string, unknown>;
}
