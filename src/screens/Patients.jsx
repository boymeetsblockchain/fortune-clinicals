import React, { useCallback } from 'react';
import Navbar from '../components/Navbar';
import { ImBin } from 'react-icons/im';
import { patientsArray } from '../data';
import { useNavigate } from 'react-router-dom';
import { toast  } from 'react-hot-toast';
function Patients() {
  const navigate= useNavigate()
  const onView = useCallback(()=>{
    navigate('/dashboard/patients/1')
  },[navigate])
  const onDelete = ()=>{
    window.confirm("are you sure you want to delete this patient record")
    toast.success("deleted")
  }
  return (
    
    <>
      <Navbar />
      <div className="px-4 md:px-8 lg:px-8 mx-auto my-5">
        <div className="patient-box grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {patientsArray.map(patient => (
            <div
              className="h-30 py-4 w-auto shadow-md rounded-lg flex flex-col items-start"
              key={patient.name}
            >
              <div className="flex flex-row  justify-evenly px-4">
                <div className="text-center text-5xl text-[#ff5162] h-20 w-20 px-2 py-1 items-center flex bg-white font-bold">
                  {patient.patientName[0].toUpperCase()}
                </div>
                <div className="flex ml-4 space-y-2 flex-col">
                  <p className="text-sm">
                    Name:{' '}
                    <span className="text-gray-400">{patient.patientName}</span>
                  </p>
                  <p className="text-sm">
                    Clinicians:{' '}
                    <span className="text-gray-400">{patient.registeredBy}</span>
                  </p>
                  <p className="text-sm">
                    Date:{' '}
                    <span className="text-gray-400 text-xs">
                      {patient.dateRegistered}
                    </span>
                  </p>
                  <button className="px-2 py-0.5 text-sm bg-[#FF5162] text-white" onClick={onView}>
                    View
                  </button>
                </div>
                <div className="deletebutton ml-5" onClick={onDelete}>
                  <ImBin size={20} className="text-[#ff5162] cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Patients;
