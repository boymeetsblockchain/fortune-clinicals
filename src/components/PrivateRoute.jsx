import { Navigate,Outlet } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Loader from "./Loader"
function PrivateRoute() {
    const {loading,loggedIn}= useAuthStatus()

    if(loading){
        return(
          <Loader/>
        )
    }
  return loggedIn ? <Outlet/> :<Navigate to={'/auth'}/>
}

export default PrivateRoute