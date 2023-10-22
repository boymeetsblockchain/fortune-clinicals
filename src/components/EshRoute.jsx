import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
import Loader from './Loader';

function IsESHPrivateRoute() {
  const { loggedIn, isESH } = useUserRole();

  if (!loggedIn) {
    return <Navigate to="/auth" />;
  }

  if (isESH) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" />;
}

export default IsESHPrivateRoute;
