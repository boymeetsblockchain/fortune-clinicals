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
        navigate('/')
      } catch (error) {
        console.log(error)
        toast.error("Could not authorized")
      }
    }
  return (
    <div className=' flex items-center mx-auto w-auto cursor-pointer'onClick={onGoogleClick}>
        <p className="flex items-center space-x-4">
           <span className='text-xl'>
           Sign In with</span> <FcGoogle size={32}/>
        </p>
    </div>
  )
}

export default Oauth