import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useCompanies } from '../../../hooks/useCompanies';
import { useCreateUser } from '../../../hooks/useUsers';
import { UserForm } from '../../../components/User/UserForm';
import type { CreateUserRequest } from '../../../types/user';

export default function UserCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const companyId = !isAdmin ? (user as { company_id?: string })?.company_id : undefined;

  const { data: companiesData } = useCompanies({ limit: 100 });
  const companies = companiesData?.data?.data || [];

  const createUser = useCreateUser();

  const onSubmit = async (formData: Record<string, unknown>) => {
    try {
      await createUser.mutateAsync({
        data: formData as unknown as CreateUserRequest,
        companyId: (formData.company_id as string) || companyId,
      });
      navigate('/admin/users');
    } catch {
    }
  };

  const defaultValues = !isAdmin ? { company_id: companyId } : undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create User</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <UserForm
          defaultValues={defaultValues}
          companies={companies}
          onSubmit={onSubmit}
          loading={createUser.isPending}
          currentUserRole={user?.role}
        />
      </div>
    </div>
  );
}
