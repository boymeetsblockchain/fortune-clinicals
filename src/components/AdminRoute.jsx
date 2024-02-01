
import { Navigate, Outlet,} from 'react-router-dom';
import useAdminStatus from '../hooks/useUserAdmin';
import Loader from './Loader';

const PrivateRoute = () => {
  const { isAdmin, loading } = useAdminStatus();

if(loading){
  return <Loader/>
}
return isAdmin ? <Outlet /> : <Navigate to='/' />
};

export default PrivateRoute;
