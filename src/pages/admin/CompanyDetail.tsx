import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCompany, useDeleteCompany } from "../../hooks/useCompanies";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../hooks/useAuth";
import type { Company } from "../../types/company";
import type { User } from "../../types/user";

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loginAsUser } = useAuth();
  const { data, isLoading, isError } = useCompany(id);
  const deleteCompany = useDeleteCompany();

  const [userPage, setUserPage] = useState(1);
  const userLimit = 10;
  const { data: usersData, isLoading: usersLoading } = useUsers({
    page: userPage,
    limit: userLimit,
    company_id: id,
  });

  const company: Company | undefined = data?.data || undefined;
  const users: User[] = usersData?.data?.data || [];
  const totalUserPages = usersData?.data?.totalPages || 1;

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${company?.name}"? This action cannot be undone.`,
      )
    ) {
      deleteCompany.mutate(id!, {
        onSuccess: () => navigate("/admin/companies"),
      });
    }
  };

  const handleLoginAsUser = async (userId: string) => {
    await loginAsUser(userId);
    navigate("/dashboard");
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
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/companies"
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          &larr; Back to Companies
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Slug: {company.slug}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/admin/companies/${company.id}/edit`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Max Users</dt>
              <dd className="text-sm font-medium text-gray-900">
                {(company.settings as { max_users?: number })?.max_users ??
                  "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Advanced Search</dt>
              <dd className="text-sm font-medium text-gray-900">
                {(
                  company.settings as {
                    features?: { advanced_search?: boolean };
                  }
                )?.features?.advanced_search
                  ? "Enabled"
                  : "Disabled"}
              </dd>
            </div>
          </dl>
        </div>

        {company.created_at && (
          <div className="mt-4 text-xs text-gray-400">
            Created: {new Date(company.created_at).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Company Users</h2>

        {usersLoading && (
          <div className="text-center py-8 text-gray-500">
            Loading users...
          </div>
        )}

        {!usersLoading && users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found for this company.
          </div>
        )}

        {!usersLoading && users.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {u.first_name} {u.last_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "company_admin"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleLoginAsUser(u.id)}
                          className="text-amber-600 hover:text-amber-900 font-medium"
                        >
                          Login as User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalUserPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {userPage} of {totalUserPages}
                </span>
                <button
                  onClick={() =>
                    setUserPage((p) => Math.min(totalUserPages, p + 1))
                  }
                  disabled={userPage === totalUserPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
