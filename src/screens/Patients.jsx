import React from 'react'
import Navbar from '../components/Navbar'
import {ImCancelCircle} from 'react-icons/im'
import {patientsArray} from '../data'
function Patients() {
  return (
   <>
   <Navbar/>
    <div className="px-4 md:px-8 lg:px-8 mx-auto my-5">
     <div className="patient-box  grid grid-cols-2 md:grid-cols-3 gap-x-8 lg:grid-cols-5">
      {
        patientsArray.map((patient)=>(
          <div className="h-60 w-auto shadow-md rounded-lg   flex items-center" key={patient.name}>
            <div className="flex flex-row px-4">
              <div className="text-center text-6xl text-[#ff5162] h-20 w-20 px-2 py-1 items-center flex bg-white  font-bold">
              {patient.patientName[0].toUpperCase()}
              </div>
              <div className="flex ml-4 space-y-2 flex-col">
                <p className='text-sm '> Patient Name: <span className='text-gray-400'>{patient.patientName}</span></p>
                <p className='text-sm'>Clinicians: <span className='text-gray-400'>{patient.registeredBy}</span></p>
                <p className='text-sm'>Date:{""}<span className='text-gray-400 text-xs'>{patient.dateRegistered}</span></p>
                <button className='px-2 py-0.5 text-sm bg-[#FF5162] text-white'>view</button>
              </div>
               <div className="deletebutton">
                <ImCancelCircle size={20} className='text-[#ff5162] cursor-pointer'/>
               </div>
            </div>
          </div>
        ))
      }
     </div>
    </div>
   </>
  )
}

export default Patients