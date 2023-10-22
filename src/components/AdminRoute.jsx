import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

function AdminPrivateRoute() {
  const { loggedIn, isAdmin } = useUserRole();

  if (!loggedIn) {
    return <Navigate to="/auth" />;
  }

  if (isAdmin) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" />;
}

export default AdminPrivateRoute;
