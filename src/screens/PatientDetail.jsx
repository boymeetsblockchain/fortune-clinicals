import React from 'react'
import Navbar from '../components/Navbar'
import {FaStethoscope,FaPencilAlt,FaCheck} from 'react-icons/fa'
import {ImBin} from 'react-icons/im'
import {MdOutlineTransform} from 'react-icons/md'
const PatientDetails = {
  patientName: "Jackson Kelly",
  age: 39,
  gender: "male",
  phoneNumber: "08141889944",
  dateRegistered: "2023-08-25",
  clerkedBy: "Noah",
  regNumber: "2023/34/9",
  sessionPaid:2,
  session: 10, // Number of sessions booked
  registrationFee: 3000, // Default registration fee in naira
  chargePerSession: 5000, // Charge per session in naira
};


function PatientDetail() {
  return (
     <>
     <Navbar/>
     <div className="mx-auto max-w-screen-xl my-5 h-screen   overflow-y-hidden  w-full px-4 md:px-8 lg:px-12">
    <div className="flex flex-col my-4 space-y-8">
    <div className="flex top-details items-center justify-between ">
         <div className="name-logo flex items-center jusify-between">
         <div className="text-center text-8xl bg-[#ff5162]  text-white rounded-full h-64 w-64 px-2 py-1 items-center justify-center flex font-bold">
                  {PatientDetails.patientName[0].toUpperCase()}
                </div>
         </div>
         <div className="name-age-number flex  space-y-4 mx-5  flex-col">
          <h1 className='bg-slate-100 text-[#fff5162] font-bold  px-2 py-1.5 text-3xl rounded-md'>{PatientDetails.patientName}</h1>
          <p> Age:{PatientDetails.age}</p>
          <p> Phone Number :{PatientDetails.phoneNumber}</p>
         </div>
          <div className="reg-number bg-green-500 text-2xl text-white  px-2 py-1.5 ">
            <h1>{PatientDetails.regNumber}</h1>
          </div>
      </div>
       <div className="session-payment grid  gap-x-8 grid-cols-4 h-[420px]">
        <div className="bg-slate-200 rounded-md shadow-lg col-span-3 p-4">
          <div className="header-section my-4">
            <div className='flex gap-3 items-center'>
              <span><FaStethoscope size={32} color='green'/></span>
              <span className='text-2xl text-white px-2 py-1.5  bg-[#ff5162]'> number of sessions: {PatientDetails.session}</span>
            </div>
          </div>
         <div className="completed section my-4 space-y-6">
         <div className="px-8 session-details flex justify-between items-center">
           <div className="completed flex gap-2">
              <div className="icon">
                <FaCheck size={32} color='green'/>
              </div>
              <div className="completed flex flex-col gap-y-1">
                <h1 className='text-3xl text-bold'> Completed</h1>
                <p className='text-gray-400  text-xl'>{PatientDetails.dateRegistered}</p>
                <p  className='text-xl  text-gray-400 '>1st Treatment session of 12</p>
              </div>
           </div>
           <div className="icons flex space-x-4">
            <FaPencilAlt size={32} color='blue' className='cursor-pointer'/>
            <MdOutlineTransform size={32} color='blue' className='cursor-pointer'/>
            <ImBin size={32} color='red' className='cursor-pointer'/>
           </div>
          </div>
          <div className="px-8 session-details flex justify-between items-center">
           <div className="completed flex gap-2">
              <div className="icon">
                <FaCheck size={32} color='green'/>
              </div>
              <div className="completed flex flex-col gap-y-1">
                <h1 className='text-3xl text-bold'> Completed</h1>
                <p className='text-gray-400  text-xl'>{PatientDetails.dateRegistered}</p>
                <p  className='text-xl  text-gray-400 '>2nd session the patient paid 12k for 1 hand cervical collar with jaw extenstions and semi rigid cervical</p>
              </div>
           </div>
           <div className="icons flex space-x-4">
            <FaPencilAlt size={32} color='blue' className='cursor-pointer'/>
            <MdOutlineTransform size={32} color='blue' className='cursor-pointer'/>
            <ImBin size={32} color='red' className='cursor-pointer'/>
           </div>
          </div>
         </div>
          
        </div>
        <div className="bg-slate-200 rounded-md shadow-lg flex flex-col justify-center space-y-4 p-6 col-span-1">
          <div className='flex gap-3'>
          <FaCheck size={32} color='green'/>
           <h1 className=''>DETAILS</h1>
          </div>
          <div className='flex gap-3 items-center justify-between hover:opacity-50'>
            <div className="detials flex  gap-2">
            <FaCheck size={32} color='green'/>
           <h1 className=''>SESSIONS</h1>
            </div>
            <div>
              {PatientDetails.session}
            </div>
          </div>
          <div className='flex gap-3 items-center justify-between hover:opacity-50'>
            <div className="detials flex  gap-2">
            <FaCheck size={32} color='green'/>
           <h1 className=''>PAYMENT</h1>
            </div>
            <div>
              {PatientDetails.sessionPaid}
            </div>
          </div>
          <div className='flex gap-3'>
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