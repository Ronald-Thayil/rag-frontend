import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useUser, useDeleteUser } from "../../../hooks/useUsers";
import type { User } from "../../../types/user";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const companyId =
    currentUser?.role !== "admin"
      ? (currentUser as { company_id?: string })?.company_id
      : undefined;

  const { data, isLoading, isError } = useUser(id, companyId);
  const deleteUser = useDeleteUser();

  const userData: User | undefined = data?.data || undefined;

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${userData?.first_name} ${userData?.last_name}"? This action cannot be undone.`,
      )
    ) {
      deleteUser.mutate(
        { id: id!, companyId },
        { onSuccess: () => navigate("/admin/users") },
      );
    }
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

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/users"
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          &larr; Back to Users
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userData.first_name} {userData.last_name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/admin/users/${userData.id}/edit`}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Role</dt>
              <dd className="text-sm font-medium text-gray-900 capitalize">
                {userData.role}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="text-sm font-medium">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userData.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {userData.is_active ? "Active" : "Inactive"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Company ID</dt>
              <dd className="text-sm font-medium text-gray-900">
                {userData.company_id || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        {userData.created_at && (
          <div className="mt-4 text-xs text-gray-400">
            Created: {new Date(userData.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
