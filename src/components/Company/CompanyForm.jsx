import { useForm } from 'react-hook-form';

export function CompanyForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      name: '',
      slug: '',
      settings: {
        max_users: 50,
        features: { advanced_search: false },
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          id="name"
          {...register('name', { required: 'Company name is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug *
        </label>
        <input
          id="slug"
          {...register('slug', {
            required: 'Slug is required',
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: 'Slug must be lowercase letters, numbers, and hyphens only',
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="max_users" className="block text-sm font-medium text-gray-700 mb-1">
          Max Users
        </label>
        <input
          id="max_users"
          type="number"
          min={1}
          {...register('settings.max_users', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="advanced_search"
          type="checkbox"
          {...register('settings.features.advanced_search')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="advanced_search" className="text-sm text-gray-700">
          Enable Advanced Search
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Saving...' : defaultValues ? 'Update Company' : 'Create Company'}
      </button>
    </form>
  );
}
