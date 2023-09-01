import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import {FaPencilAlt,FaCheck} from 'react-icons/fa'
import {ImBin} from 'react-icons/im'
import { toast } from 'react-hot-toast'
import{GrDocumentUpdate} from 'react-icons/gr'
import {MdOutlineTransform} from 'react-icons/md'
import { db } from '../firebase.config'
import { getDoc,doc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'


function PatientDetail() {
  const params = useParams()
  const [loading,setLoading]= useState(true)
  const [patient,setPatient]= useState(null)
  const [isActive,setIsActive]= useState(true)


  useEffect(()=>{
    const getPatient = async()=>{
      const docRef = doc(db, 'patients', params.id)
      const docSnap = await getDoc(docRef)
     if(docSnap.exists()){
      setPatient(docSnap.data())
      console.log(docSnap.data())
      setLoading(false)
     }
 }
  getPatient()
  },[])
  const onDelete = ()=>{
    window.confirm("are you sure you want to delete this patient? record")
    toast.success("deleted")
  }

if(loading){
  return(
    <Loader/>
    )
}
  return (
     <>
     <Navbar/>
     <div className="mx-auto max-w-screen-xl my-5 h-screen   md:overflow-y-hidden  w-full px-4 md:px-8 lg:px-12">
    <div className="flex flex-col my-4 space-y-8">
    <div className="flex top-details  flex-col md:flex-row space-y-4 items-center justify-between ">
         <div className="name-logo flex items-center jusify-between">
         <div className="text-center text-8xl bg-[#ff5162]  text-white rounded-full h-64 w-64 px-2 py-1 items-center justify-center flex font-bold">
                  {patient?.name[0].toUpperCase()}
                </div>
         </div>
         <div className="name-age-number flex  space-y-4 mx-5  flex-col">
          <h1 className='bg-slate-100 text-[#fff5162] font-bold  px-2 py-1.5 text-3xl rounded-md'>{patient?.selectedTitle} {""}{patient?.name}</h1>
          <p> Age:&nbsp; {patient?.age}</p>
          <p> Phone Number: &nbsp; {patient?.phoneNumber}</p>
          <p>Condition:&nbsp; {patient?.condition}</p>
          <p>Acessed by:&nbsp;{patient?.clinician}</p>
         </div>
          <div className="reg-number bg-green-500 text-2xl text-white  px-2 py-1.5 ">
            <h1>{patient?.dateRegistered}/{patient?.selectedValue}</h1>
          </div>
      </div>
       <div className="session-payment md:grid  md:gap-x-8 md:grid-cols-4 md:h-[420px] flex flex-col gap-4 justify-center">
       <div className="bg-slate-200 rounded-md shadow-lg col-span-3 p-4">
      
       </div>
       <div className="bg-slate-200 rounded-md shadow-lg col-span-1  flex flex-col justify-center space-y-4 p-6 col-span-">
       <div className='flex gap-3   cursor-pointer hover:opacity-50'>
          <FaCheck size={32} color='green'/>
           <h1 className=''>DETAILS</h1>
          </div>
          <div className='flex gap-3 items-center justify-between cursor-pointer hover:opacity-50'>
            <div className="detials flex  gap-2">
            <FaCheck size={32} color='green'/>
           <h1 className=''>SESSIONS</h1>
            </div>
            <div>
              {patient?.session}
            </div>
          </div>
          <div className='flex gap-3 items-center justify-between cursor-pointer hover:opacity-50'>
            <div className="detials flex  gap-2">
            <FaCheck size={32} color='green'/>
           <h1 className=''>PAYMENT</h1>
            </div>
            <div>
              {patient?.sessionPaid}
            </div>
          </div>
          <div className='flex gap-3 cursor-pointer hover:opacity-50'  onClick={onDelete}>
          <ImBin size={32} color='red'/>
           <h1 className=''>DELETE</h1>
          </div>

       </div>
          
       </div>
    </div>
     </div>
     </>
  )
}

export default PatientDetail