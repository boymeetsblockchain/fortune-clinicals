import { getAuth } from "firebase/auth";
import { useEffect,useState } from "react";


function GetUser() {
    const auth = getAuth();
    const [user, setUser] = useState(null);
  
    useEffect(() => {
    setUser(auth.currentUser)
    }, []);
  
    return user;
  }

  export default GetUser


  