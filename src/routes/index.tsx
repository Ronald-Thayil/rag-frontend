import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/Layout/MainLayout';
import Login from '../pages/Login/Login';
import AdminLogin from '../pages/Login/AdminLogin';
import Dashboard from '../pages/Dashboard/Dashboard';
import CompaniesList from '../pages/admin/CompaniesList';
import CompanyCreate from '../pages/admin/CompanyCreate';
import CompanyEdit from '../pages/admin/CompanyEdit';
import CompanyDetail from '../pages/admin/CompanyDetail';
import UsersList from '../pages/admin/users/UsersList';
import UserCreate from '../pages/admin/users/UserCreate';
import UserEdit from '../pages/admin/users/UserEdit';
import UserDetail from '../pages/admin/users/UserDetail';
import DocumentsList from '../pages/documents/DocumentsList';
import DocumentUpload from '../pages/documents/DocumentUpload';
import AskAI from '../pages/ask-ai/AskAI';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/companies" element={<CompaniesList />} />
          <Route path="/admin/companies/new" element={<CompanyCreate />} />
          <Route path="/admin/companies/:id/edit" element={<CompanyEdit />} />
          <Route path="/admin/companies/:id" element={<CompanyDetail />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'company_admin']} />}>
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/users/new" element={<UserCreate />} />
          <Route path="/admin/users/:id/edit" element={<UserEdit />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
        </Route>

        <Route path="/documents" element={<DocumentsList />} />
        <Route path="/documents/upload" element={<DocumentUpload />} />
        <Route path="/ask-ai" element={<AskAI />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
