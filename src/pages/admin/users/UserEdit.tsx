import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCompanies } from "../../../hooks/useCompanies";
import { useUser, useUpdateUser } from "../../../hooks/useUsers";
import { UserForm } from "../../../components/User/UserForm";
import type { User, UpdateUserRequest } from "../../../types/user";

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const companyId = !isAdmin
    ? (user as { company_id?: string })?.company_id
    : undefined;

  const { data, isLoading, isError } = useUser(id);
  const { data: companiesData } = useCompanies({ limit: 100 });
  const companies = companiesData?.data?.data || [];
  const updateUser = useUpdateUser();

  const userData: User | undefined = data?.data;

  const onSubmit = async (formData: Record<string, unknown>) => {
    try {
      await updateUser.mutateAsync({
        id: id!,
        data: formData as unknown as UpdateUserRequest,
        companyId: (formData.company_id as string) || companyId,
      });
      navigate("/admin/users");
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading user...</div>
    );
  }

  if (isError || !userData) {
    return (
      <div className="text-center py-12 text-red-600">User not found.</div>
    );
  }

  const defaultValues = {
    company_id: userData.company_id || "",
    email: userData.email || "",
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    role: userData.role || "member",
    is_active: userData.is_active ?? true,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <UserForm
          defaultValues={defaultValues}
          companies={companies}
          onSubmit={onSubmit}
          loading={updateUser.isPending}
          currentUserRole={user?.role}
        />
      </div>
    </div>
  );
}
