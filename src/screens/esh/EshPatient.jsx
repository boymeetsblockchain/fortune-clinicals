import React, { useEffect, useState } from 'react';
import EshNav from '../../components/EshNav';

import {  FaCheck } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import { getDoc, doc, deleteDoc,collection,query,getDocs,where,updateDoc} from 'firebase/firestore'; // Import deleteDoc
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Payment from '../../components/Payment';
import Session from '../../components/Session';
import InitialReview from '../../components/InitialReview';
import Input from '../../components/Input';
import { AiTwotoneEdit } from 'react-icons/ai';
function PatientDetail() {
  const params = useParams();
  const navigate= useNavigate()
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const[updatedDate,setUpdatedDate]= useState("")
  const [payment,setPayment]= useState("")
  const [session,setSession]= useState("")
  const [isActive, setIsActive] = useState('session'); // Initialize with 'payment'

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

    const getPayment = async()=>{
      const paymentsQuery = query(collection(db, 'patientspayments'), where('patientId', '==', params.id));
      const querySnapshot = await getDocs(paymentsQuery);
  
      // Use map to directly transform querySnapshot to an array of paymentDetails
      const paymentDetails =  querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPayment(paymentDetails)
    }
    const getSession = async()=>{
      const paymentsQuery = query(collection(db, 'patientssessions'), where('patientId', '==', params.id));
      const querySnapshot = await getDocs(paymentsQuery);
  
      // Use map to directly transform querySnapshot to an array of paymentDetails
      const sessionDetails =  querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSession(sessionDetails)
    }
    getPayment()
    getSession()
    getPatient();
  }, []);

  const onDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        const docRef = doc(db, 'eshpatients', params.id);
        await deleteDoc(docRef);
        navigate('/esh/patients')
        toast.success("Deleted");
        // Redirect or perform any other action after deletion
      } catch (error) {
        console.error('Error deleting patient record:', error);
        navigate('/esh/patients')
        toast.error("Error deleting patient record");
      }
    }
  };

  const UpdatePatient = async () => {
    try {
      // Ensure updatedDate is not empty before proceeding
      if (!updatedDate) {
        toast.error('Please select or enter an updated date.');
        return;
      }

      // Update the patient data with the new updatedDate
      const docRef = doc(db, 'eshpatients', params.id);
      const updatedPatientData = { ...patient, updatedDate };
      await updateDoc(docRef, updatedPatientData);

      // Show success message and navigate
      toast.success('Patient record updated successfully.');
      navigate(0)
    } catch (error) {
      console.error('Error updating patient record:', error);
      toast.error('Error updating patient record');
    }
  };
  const UpdatePatientDetails=(params)=>{
    navigate(`/update/esh/${params}`)
   }
  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <EshNav />
      <div className="mx-auto max-w-screen-xl my-5 h-screen md:overflow-y-hidden w-full px-4 md:px-8 lg:px-12">
        <div className="flex flex-col my-4 space-y-8">
          <div className="flex top-details flex-col md:flex-row space-y-4 items-center justify-between">
            <div className="name-age-number flex space-y-4 mx-5 flex-col">
              <h1 className='bg-slate-100 text-[#fff5162] font-bold px-2 py-1.5 text-3xl rounded-md'>{patient?.selectedTitle} {""}{patient?.surname} &nbsp; {patient?.othername}</h1>
              <p> Age:&nbsp; {patient?.age}</p>
              <p> Phone Number: &nbsp; {patient?.phoneNumber}</p>
              <p>Address:&nbsp;{patient?.address}</p>
              <p>Condition:&nbsp; {patient?.condition}</p>
              <p>Acessed by:&nbsp;{patient?.clinician}</p>
              <p>Reffered by:&nbsp;{patient?.reffer}</p>
              <div className="date-updated mt-4 flex   gap-3 items-center justify-between" >
              <Input label={"Update"} type={"date"}    value={updatedDate}
          onChange={(e) => setUpdatedDate(e.target.value)} />
              <button className='bg-blue-700  text-white px-4 py-3 rounded-md' onClick={UpdatePatient}>Update</button>
              </div>
            </div>
            <div className="reg-number bg-green-500 text-2xl text-white px-2 py-1.5 ">
              <h1>{patient.selectedValue}{patient.regNumber}</h1>
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
                  <h1 className=''>SESSIONS <span className='ml-4 bg-green-500 px-3 py-1 rounded-md text-white'>{session.length}</span> </h1>
                </div>
                <div>
                  {patient?.session}
                </div>
              </div>
              <div className='flex gap-3 items-center justify-between cursor-pointer hover:opacity-50'>
                <div className="detials flex gap-2" onClick={()=>setIsActive("payment")}>
                  <FaCheck size={32} color='green' />
                  <h1 className=''>PAYMENT <span className='ml-4 bg-green-500 px-3 py-1 rounded-md text-white'>{payment.length}</span></h1>
                </div>
                <div>
                  {patient?.sessionPaid}
                </div>
              </div>
              <div className="flex gap-3 cursor-pointer hover:opacity-50" onClick={()=>UpdatePatientDetails(params.id)}>
            
            <AiTwotoneEdit size={32} color='blue'/>
           
             UPDATE PATIENT
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
