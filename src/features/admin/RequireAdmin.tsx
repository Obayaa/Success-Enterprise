import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/admin/AuthContext';

export function RequireAdmin() {
  const { session, loading } = useAuth();

  if (loading) {
    return <p className="text-neutral-500 text-sm py-16 text-center">Loading…</p>;
  }
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
