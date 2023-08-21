import React from 'react'
import {AiOutlineUser,AiOutlineArrowLeft,AiOutlineArrowRight} from 'react-icons/ai'
import Input from '../components/Input'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {getAuth} from 'firebase/auth'
import { addDoc,serverTimestamp,collection } from 'firebase/firestore'
import { db } from '../firebase.config'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
function AddNewPatient() {

   const navigate = useNavigate()
  const auth = getAuth()
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [condition, setCondition] = useState("");
    const [clinician, setClinician] = useState("");
    const [dateRegistered, setDateRegistered] = useState("");
    const [numOfSessions, setNumOfSessions] = useState("");
    const [paidSessions, setPaidSessions] = useState("");
    const [amountPerSession, setAmountPerSession] = useState("");

    const formData={
        name,
        address,
        age,
        phoneNumber,
        condition,
        clinician,
        dateRegistered,
        numOfSessions,
        paidSessions,
        amountPerSession
    }

    const registerPatient = async (e)=>{
     e.preventDefault()
      
      try {
        const formDataCopy ={
            ...formData,
            timestamp: serverTimestamp(),
            userId:auth?.currentUser?.uid
         }
         const data = await addDoc(collection(db, 'patients'), formDataCopy)
         console.log(data)
          toast.success("patient saved")
          navigate(`/dashboard/patient/${data.id}`)
          
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <>
    <Navbar/>
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 md:px-8 lg:px-12">
      <Link to={'/dashboard/patients'}>
          <AiOutlineArrowLeft size={32} className='my-2  text-[#FF5162]  cursor-pointer'/>
          </Link>

          <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Add new Patient</h1>
            <form className='flex flex-col space-y-4 justify-center w-full mx-auto' onSubmit={registerPatient}>
            <div className='flex  justify-center'> 
                <AiOutlineUser className='rounded-full  text-gray-400 ' size={64} />
            </div>
            <Input label={"Name"} type={"text"} value={name} onChange={(e) => setName(e.target.value)} />
            <Input label={"Age"} type={"number"} value={age} onChange={(e) => setAge(e.target.value)} />
           <Input label={"Address"} type={"text"} value={address} onChange={(e) => setAddress(e.target.value)} />
         <Input label={"Phone Number"} type={"number"} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
         <Input label={"Condition"} type={"text"} value={condition} onChange={(e) => setCondition(e.target.value)} />
         <Input label={"Clinician attending to"} type={"text"} value={clinician} onChange={(e) => setClinician(e.target.value)} />
        <Input label={"Date Registered"} type={"date"} value={dateRegistered} onChange={(e) => setDateRegistered(e.target.value)} />

            <div className="flex items-center flex-col md:flex-row gap-4  justify-between ">
            <Input label={"Number of Session"} type={"number"} value={numOfSessions} onChange={(e) => setNumOfSessions(e.target.value)} />
  <Input label={"Paid Session"} type={"number"} value={paidSessions} onChange={(e) => setPaidSessions(e.target.value)} />
  <Input label={"Amount per Session"} type={"number"} value={amountPerSession} onChange={(e) => setAmountPerSession(e.target.value)} />

            </div>
            <div className="flex justify-end">
                <button className="bg-[#FF5162] py-3 flex  items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition">
                 Register <AiOutlineArrowRight/>
                </button>
              </div>
          </form>
        </div>
    </>
  
  )
}

export default AddNewPatient