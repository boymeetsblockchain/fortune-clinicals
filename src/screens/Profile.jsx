import React from 'react'
import {getAuth} from 'firebase/auth'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
function Profile() {
  const navigate =useNavigate()

  const onLogOut = async()=>{
    const auth= getAuth()
    
      await auth.signOut()
      toast.success("successfully loggedout")
      navigate('/auth')
   
  }
  return (
    <div className='h-screen w-full flex items-center justify-center max-w-screen-xl mx-auto'>
       <button  className='bg-red-500 px-2 py-2 rounded-md  text-white' onClick={onLogOut}>
        Logout
       </button>
    </div>
  )
}

export default Profile