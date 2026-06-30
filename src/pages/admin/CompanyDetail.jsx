import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCompany, useDeleteCompany } from '../../hooks/useCompanies';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCompany(id);
  const deleteCompany = useDeleteCompany();

  const company = data?.data;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${company?.name}"? This action cannot be undone.`)) {
      deleteCompany.mutate(id, {
        onSuccess: () => navigate('/admin/companies'),
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading company...</div>;
  }

  if (isError || !company) {
    return <div className="text-center py-12 text-red-600">Company not found.</div>;
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
                {company.settings?.max_users || 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Advanced Search</dt>
              <dd className="text-sm font-medium text-gray-900">
                {company.settings?.features?.advanced_search ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
          </dl>
        </div>

        {company.createdAt && (
          <div className="mt-4 text-xs text-gray-400">
            Created: {new Date(company.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
