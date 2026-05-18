import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Route guard. If `roles` is provided, only users whose role is in the array
 * are allowed through; otherwise any authenticated user passes.
 *
 * Note: auth is mocked right now (see AuthContext). For the empty scaffold,
 * unauthenticated visitors are redirected to /login.
 */
export default function ProtectedRoute({ roles }) {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
