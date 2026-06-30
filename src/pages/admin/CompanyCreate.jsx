import { useNavigate } from 'react-router-dom';
import { useCreateCompany } from '../../hooks/useCompanies';
import { CompanyForm } from '../../components/Company/CompanyForm';

export default function CompanyCreate() {
  const navigate = useNavigate();
  const createCompany = useCreateCompany();

  const onSubmit = async (data) => {
    try {
      await createCompany.mutateAsync(data);
      navigate('/admin/companies');
    } catch {
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Company</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <CompanyForm onSubmit={onSubmit} loading={createCompany.isPending} />
      </div>
    </div>
  );
}
