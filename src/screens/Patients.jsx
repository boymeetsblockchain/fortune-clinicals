import React, { useCallback,useEffect,useState } from 'react';
import Navbar from '../components/Navbar';
import { ImBin } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { toast  } from 'react-hot-toast';
import {AiOutlineUserAdd} from 'react-icons/ai'
import { Link } from 'react-router-dom';
import { db } from '../firebase.config'
import Loader from '../components/Loader';
import { getDocs,collection,} from 'firebase/firestore'
function Patients() {
  const navigate= useNavigate()
  const[patients,setPatients]= useState([])
  const [loading,setLoading]= useState(true)
  const getPatients = async () => {
    try {
      const data = await getDocs(collection(db, 'patients'));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id, // Add the id property here
        ...doc.data(),
      }));
      
      filteredData.sort((a, b) => {
        const dateA = new Date(a.dateRegistered);
        const dateB = new Date(b.dateRegistered);
        return dateB - dateA;
      });

      setPatients(filteredData);
      console.log(filteredData)
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(()=>{
         getPatients()
  },[])
  const onView = useCallback((id)=>{
    navigate(`/dashboard/patient/${id}`)
  },[navigate])
  const onDelete = ()=>{
    window.confirm("are you sure you want to delete this data? record")
    toast.success("deleted")
  }

  
    if(loading){
      return(
        <Loader/>
      )
    }
  return (
    
    <>
      <Navbar />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5 relative">
        <div className="data-box grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {patients.map(data => (
            <div
              className="h-30 py-4 w-auto shadow-md rounded-lg flex flex-col items-start"
              key={data?.id}
            >
              <div className="flex flex-row  justify-evenly px-4">
                <div className="text-center text-5xl text-[#ff5162] h-20 w-20 px-2 py-1 items-center flex bg-white font-bold">
                  {data?.surname[0].toUpperCase()}
                </div>
                <div className="flex ml-4 space-y-2 flex-col">
                  <p className="text-sm">
                    Name:{' '}
                    <span className="text-gray-800">{data?.surname} &nbsp; {data?.othername}</span>
                  </p>
                  <p className="text-sm">
                    Clinicians:{' '}
                    <span className="text-gray-800">{data?.clinician}</span>
                  </p>
                  <p className="text-sm">
                    Date:{' '}
                    <span className="text-gray-800 text-xs">
                      {data?.dateRegistered}
                    </span>
                  </p>
                  <button className="px-2 py-0.5 text-sm bg-[#FF5162] text-white" onClick={()=>onView(data?.id)}>
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
        <div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
        <Link to={'/add-new'}>
        <AiOutlineUserAdd size={64} color='red'/>
        </Link>
        </div>
      </div>
    </>
  );
}

export default Patients;
