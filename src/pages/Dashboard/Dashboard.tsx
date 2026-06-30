import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Welcome, {user?.first_name || user?.name || user?.email || 'User'}!
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Role: <span className="capitalize">{user?.role || 'N/A'}</span>
        </p>
      </div>
    </div>
  );
}
