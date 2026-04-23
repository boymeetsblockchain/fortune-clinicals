import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth,signInWithPopup,GoogleAuthProvider } from 'firebase/auth'
import{doc,setDoc,getDoc,serverTimestamp} from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { db } from '../firebase.config'
import{FcGoogle} from 'react-icons/fc'
function Oauth() {
   
    const navigate= useNavigate()


    const onGoogleClick=async()=>{
      try {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth,provider)

        const user =result.user

        const docRef= doc(db,"users",user.uid)
        const docSnap= await getDoc(docRef)

        if(!docSnap.exists()){
            await setDoc(doc(db,"users",user.uid),{
                name:user.displayName,
                email:user.email,
                timestamp: serverTimestamp()
            })
        }
        toast.success("succesfully logged in ")
        navigate('/dashboard')
      } catch (error) {
        console.log(error)
        toast.error("Could not authorized")
      }
    }
  return (
    <button 
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center space-x-3 w-full py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
    >
      <FcGoogle size={24} />
      <span className="text-slate-700 font-medium">Continue with Google</span>
    </button>
  );
}


export default Oauth