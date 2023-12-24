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
  <div className="header flex flex-col   justify-center  space-y-4 my-4 mx-4 ">
      <p className='text-sm md:text-2xl  capitalize'>Signed in  as <span className='ml-4 inline-block bg-green-400 text-white p-2 rounded-md'> {auth?.currentUser?.displayName}</span></p>
       <button className='text-sm md:text-xl  capitalize bg-[#FF5162] p-2 text-white rounded-md' 
       onClick={onLogOut}>signOut</button>
       <button onClick={()=> navigate('/daily')} className='text-sm md:text-xl capitalize bg-[#FF5162] p-2 text-white rounded-md'>Daily Expenditures</button>
    </div>
    </div>
   </>
  )
}

export default EshProfile