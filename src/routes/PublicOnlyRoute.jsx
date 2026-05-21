import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const HOME_BY_ROLE = {
  admin: '/admin',
  doctor: '/doctor',
  patient: '/patient',
};

/**
 * Guard for public-only pages (login / register). A signed-in user is bounced
 * to their own dashboard so they can't see the auth forms again.
 */
export default function PublicOnlyRoute() {
  const { user, role } = useAuth();
  if (user) return <Navigate to={HOME_BY_ROLE[role] ?? '/'} replace />;
  return <Outlet />;
}
