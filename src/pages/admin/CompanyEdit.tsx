import { useParams, useNavigate } from "react-router-dom";
import { useCompany, useUpdateCompany } from "../../hooks/useCompanies";
import {
  CompanyForm,
  CompanyFormValues,
} from "../../components/Company/CompanyForm";
import type { Company } from "../../types/company";

export default function CompanyEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCompany(id);
  const updateCompany = useUpdateCompany();
  const company: Company | undefined | null = data?.data;
  const onSubmit = async (formData: CompanyFormValues) => {
    try {
      await updateCompany.mutateAsync({ id: id!, data: formData });
      navigate("/admin/companies");
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading company...</div>
    );
  }

  if (isError || !company) {
    return (
      <div className="text-center py-12 text-red-600">Company not found.</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Company</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <CompanyForm
          defaultValues={{
            name: company.name || "",
            slug: company.slug || "",
            settings: {
              max_users:
                (company.settings as { max_users?: number })?.max_users ?? 50,
              features: {
                advanced_search:
                  (
                    company.settings as {
                      features?: { advanced_search?: boolean };
                    }
                  )?.features?.advanced_search ?? false,
              },
            },
          }}
          onSubmit={onSubmit}
          loading={updateCompany.isPending}
        />
      </div>
    </div>
  );
}
