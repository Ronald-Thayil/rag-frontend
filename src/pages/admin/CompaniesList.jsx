import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanies, useDeleteCompany } from '../../hooks/useCompanies';
import { CompanyCard } from '../../components/Company/CompanyCard';

export default function CompaniesList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const params = { page, limit };
  if (search) params.search = search;

  const { data, isLoading, isError, error } = useCompanies(params);
  const deleteCompany = useDeleteCompany();

  const companies = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteCompany.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <Link
          to="/admin/companies/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          + New Company
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full sm:w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-500">Loading companies...</div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-600">
          Error loading companies: {error?.response?.data?.message || error.message}
        </div>
      )}

      {!isLoading && !isError && companies.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No companies found.
        </div>
      )}

      {!isLoading && !isError && companies.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <div key={company.id} className="relative">
                <CompanyCard company={company} />
                <button
                  onClick={() => handleDelete(company.id, company.name)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete company"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
