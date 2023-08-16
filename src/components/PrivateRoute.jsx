import { Navigate,Outlet } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Loader from "./Loader"
function PrivateRoute() {
    const {checkingStatus,loggedIn}= useAuthStatus()

    if(checkingStatus){
        return(
          <Loader/>
        )
    }
  return loggedIn ? <Outlet/> :<Navigate to={'/auth'}/>
}

export default PrivateRoute
