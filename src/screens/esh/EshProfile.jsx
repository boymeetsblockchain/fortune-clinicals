import React  from 'react'
import {getAuth} from 'firebase/auth'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import EshNav from '../../components/EshNav'


function EshProfile() {
  const navigate =useNavigate()
  const auth= getAuth()
  

  const onLogOut = async()=>{
      await auth.signOut()
      toast.success("successfully loggedout")
      navigate('/')
  }
  return (
   <>
    <EshNav/>
  <div className='h-full w-full flex md:flex-col max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12'>
    <div className="header flex items-center my-8 justify-between">
      <p className='text-2xl capitalize'>Signed in  as <span className='ml-4 bg-[#ff5162] text-white p-2 rounded-md'> {auth?.currentUser?.displayName}</span></p>
       <button className='text-xl capitalize bg-[#FF5162] p-2 text-white rounded-md' 
       onClick={onLogOut}>signOut</button>
        <button onClick={()=> navigate('/esh-daily')} className='text-xl capitalize bg-[#FF5162] p-2 text-white rounded-md'>Daily Expenditures</button>
    </div>

    </div>
   </>
  )
}

export default EshProfile