import { useForm } from 'react-hook-form';
import type { Company } from '../../types/company';

interface UserFormValues {
  company_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  companies?: Company[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  currentUserRole?: string;
}

export function UserForm({ defaultValues, companies, onSubmit, loading, currentUserRole }: UserFormProps) {
  const isAdmin = currentUserRole === 'admin';

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormValues>({
    defaultValues: defaultValues as UserFormValues || {
      company_id: '',
      email: '',
      password_hash: '',
      first_name: '',
      last_name: '',
      role: 'member',
      is_active: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isAdmin && companies && (
        <div>
          <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <select
            id="company_id"
            {...register('company_id', { required: isAdmin ? 'Company is required' : false })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a company</option>
            {companies?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.company_id && (
            <p className="mt-1 text-sm text-red-600">{errors.company_id.message}</p>
          )}
        </div>
      )}

      {!isAdmin && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          User will be created under your company.
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {!defaultValues && (
        <div>
          <label htmlFor="password_hash" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            id="password_hash"
            type="password"
            {...register('password_hash', { required: 'Password is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password_hash && (
            <p className="mt-1 text-sm text-red-600">{errors.password_hash.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            id="first_name"
            {...register('first_name', { required: 'First name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            id="last_name"
            {...register('last_name', { required: 'Last name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="role"
          {...register('role')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="member">Member</option>
          <option value="company_admin">Company Admin</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          type="checkbox"
          {...register('is_active')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Saving...' : defaultValues ? 'Update User' : 'Create User'}
      </button>
    </form>
  );
}
