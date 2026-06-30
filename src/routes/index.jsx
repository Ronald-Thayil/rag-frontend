import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/Layout/MainLayout';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import CompaniesList from '../pages/admin/CompaniesList';
import CompanyCreate from '../pages/admin/CompanyCreate';
import CompanyEdit from '../pages/admin/CompanyEdit';
import CompanyDetail from '../pages/admin/CompanyDetail';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/companies" element={<CompaniesList />} />
        <Route path="/admin/companies/new" element={<CompanyCreate />} />
        <Route path="/admin/companies/:id/edit" element={<CompanyEdit />} />
        <Route path="/admin/companies/:id" element={<CompanyDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
