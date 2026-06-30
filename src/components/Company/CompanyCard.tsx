import { Link } from 'react-router-dom';
import type { Company } from '../../types/company';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <Link to={`/admin/companies/${company.id}`} className="hover:text-indigo-600">
              {company.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 mt-1">{company.slug}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {(company.settings as { max_users?: number })?.max_users ?? 'N/A'} users
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm">
        <Link
          to={`/admin/companies/${company.id}`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          View
        </Link>
        <Link
          to={`/admin/companies/${company.id}/edit`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
