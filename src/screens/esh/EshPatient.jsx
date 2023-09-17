import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

import {  FaCheck } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import { getDoc, doc, deleteDoc } from 'firebase/firestore'; // Import deleteDoc
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Payment from '../../components/Payment';
import Session from '../../components/Session';
import InitialReview from '../../components/InitialReview';
function PatientDetail() {
  const params = useParams();
  const navigate= useNavigate()
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [isActive, setIsActive] = useState('payment'); // Initialize with 'payment'

  useEffect(() => {
    const getPatient = async () => {
      const docRef = doc(db, 'eshpatients', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatient(docSnap.data());
        console.log(docSnap.data());
        setLoading(false);
      }
    };
    getPatient();
  }, []);

  const onDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        const docRef = doc(db, 'eshpatients', params.id);
        await deleteDoc(docRef);
        navigate('/esh-patients')
        toast.success("Deleted");
        // Redirect or perform any other action after deletion
      } catch (error) {
        console.error('Error deleting patient record:', error);
        navigate('/esh/patients')
        toast.error("Error deleting patient record");
      }
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-xl my-5 h-screen md:overflow-y-hidden w-full px-4 md:px-8 lg:px-12">
        <div className="flex flex-col my-4 space-y-8">
          <div className="flex top-details flex-col md:flex-row space-y-4 items-center justify-between">
            <div className="name-logo flex items-center jusify-between">
              <div className="text-center text-8xl bg-[#ff5162] text-white rounded-full h-64 w-64 px-2 py-1 items-center justify-center flex font-bold">
                {patient?.name[0].toUpperCase()}
              </div>
            </div>
            <div className="name-age-number flex space-y-4 mx-5 flex-col">
              <h1 className='bg-slate-100 text-[#fff5162] font-bold px-2 py-1.5 text-3xl rounded-md'>{patient?.selectedTitle} {""}{patient?.name}</h1>
              <p> Age:&nbsp; {patient?.age}</p>
              <p> Phone Number: &nbsp; {patient?.phoneNumber}</p>
              <p>Address:&nbsp;{patient?.address}</p>
              <p>Condition:&nbsp; {patient?.condition}</p>
              <p>Acessed by:&nbsp;{patient?.clinician}</p>
              <p>Reffered by:&nbsp;{patient?.reffer}</p>
           
            </div>
            <div className="reg-number bg-green-500 text-2xl text-white px-2 py-1.5 ">
              <h1>{patient.regNumber}</h1>
            </div>
          </div>
          <div className="session-payment md:grid md:gap-x-8 md:grid-cols-4 md:h-[420px] flex flex-col gap-4 justify-center">
            <div className="bg-slate-200 rounded-md shadow-lg col-span-3 p-4 overflow-y-auto">
              {isActive === 'payment' && <Payment patientId={params.id} />}
              {isActive === 'session' && <Session patientId={params.id} />}
              {isActive === 'review' && <InitialReview patientId={params.id} />}
            </div>
            <div className="bg-slate-200 rounded-md shadow-lg col-span-1 flex flex-col justify-center space-y-4 p-6 col-span-">
              <div className='flex gap-3 cursor-pointer hover:opacity-50' onClick={() => setIsActive('payment')}>
                <FaCheck size={32} color='green' />
                <h1 className=''>DETAILS</h1>
              </div>
              <div className='flex gap-3 cursor-pointer hover:opacity-50' onClick={() => setIsActive('review')}>
                <FaCheck size={32} color='green' />
                <h1 className=''>INTIAL REVIEW</h1>
              </div>
              <div className='flex gap-3 items-center justify-between cursor-pointer hover:opacity-50'>
                <div className="detials flex gap-2" onClick={() => setIsActive('session')}>
                  <FaCheck size={32} color='green' />
                  <h1 className=''>SESSIONS</h1>
                </div>
                <div>
                  {patient?.session}
                </div>
              </div>
              <div className='flex gap-3 items-center justify-between cursor-pointer hover:opacity-50'>
                <div className="detials flex gap-2" onClick={()=>setIsActive("payment")}>
                  <FaCheck size={32} color='green' />
                  <h1 className=''>PAYMENT</h1>
                </div>
                <div>
                  {patient?.sessionPaid}
                </div>
              </div>
              <div className='flex gap-3 cursor-pointer hover:opacity-50' onClick={onDelete}>
                <ImBin size={32} color='red' />
                <h1 className=''>DELETE</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PatientDetail;
