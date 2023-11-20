import React from 'react'
import EshNav from '../../components/EshNav'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { db } from '../../firebase.config'
import { serverTimestamp,addDoc,collection } from 'firebase/firestore'
import {AiOutlineUser,AiOutlineArrowLeft,AiOutlineArrowRight} from 'react-icons/ai'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import {getAuth} from 'firebase/auth'
import { ageData, titleOptions } from '../../data'
import { Eshoptions } from '../../data'
import { Link, useNavigate } from 'react-router-dom'
function EshPatient() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [surname, setSurname] = useState("");
  const [othername, setOthername] = useState("");
  const[ageRange,setAgeRange]= useState("")
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [regNumber, setRegnumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [caregiver, setCareGiver] = useState("");
  const [condition, setCondition] = useState("");
  const [clinician, setClinician] = useState("");
  const [dateRegistered, setDateRegistered] = useState("");
  const [numOfSessions, setNumOfSessions] = useState("");
  const [paidSessions, setPaidSessions] = useState("");
  const [comment, setComment] = useState([]);
  const [amountPerSession, setAmountPerSession] = useState("");
  const[selectedValue,setSelectedValue]=useState("In-patient")
  const[selectedTitle,setSelectedTitle]=useState("Mr")
  const[reffer,setReffer]= useState("")


  const formData = {
    surname,othername,
    age,address,phoneNumber,clinician,dateRegistered,reffer,selectedValue,
    numOfSessions,paidSessions,comment,condition,regNumber,phoneNumber2,caregiver
  }
  const registerPatient = async (e) => {
    e.preventDefault();
  
    // Check if the required fields are filled
    if (!surname || !othername) {
      toast.error("Please fill in both 'Surname' and 'Other Name' fields");
      return;
    }
  
    try {
      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
        userId: auth?.currentUser?.uid,
      };
      const data = await addDoc(collection(db, 'eshpatients'), formDataCopy);
      console.log(data);
      toast.success('Patient saved');
      navigate(`/esh-patient/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
   <>
   <EshNav/>
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 md:px-8 lg:px-12">
      <Link to={'/dashboard/patients'}>
          <AiOutlineArrowLeft size={32} className='my-2  text-[#FF5162]  cursor-pointer'/>
          </Link>

          <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Add new ESH Patient</h1>
            <form className='flex flex-col space-y-4 justify-center w-full mx-auto' onSubmit={registerPatient}>
            <div className='flex  justify-center'> 
                <AiOutlineUser className='rounded-full  text-gray-400 ' size={64} />
            </div>
            <Input label={"Surname"} type={"text"} value={surname} onChange={(e) => setSurname(e.target.value)} />
            <Input label={"Other Name"} type={"text"} value={othername} onChange={(e) => setOthername(e.target.value)} />
            <Select
  id="selectInput"
  value={selectedTitle}
  onChange={(e)=>setSelectedTitle(e.target.value)}
  label="Select an option"
  options={titleOptions}
/>
<Input label={"Age"} type={"number"} value={age} onChange={(e) => setAge(e.target.value)} />
              <Select
  id="selectInput"
  value={ageRange}
  onChange={(e)=>setAgeRange(e.target.value)}
  label="in"
  options={ageData}
/>
            <Select
  id="selectInput"
  value={selectedValue}
  onChange={(e)=>setSelectedValue(e.target.value)}
  label="Select an option"
  options={Eshoptions}
/>
           <Input label={"Registration Number"} type={"text"} value={regNumber} onChange={(e)=>setRegnumber(e.target.value)}/>
           <Input label={"Address"} type={"text"} value={address} onChange={(e) => setAddress(e.target.value)} />
         <Input label={"Phone Number"} type={"number"} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
         <Input label={"Phone Number 2"} type={"number"} value={phoneNumber2} onChange={(e) => setPhoneNumber2(e.target.value)} />
         <Input label={"Add Care giver details"} type={"text"} value={caregiver} onChange={(e) => setCareGiver(e.target.value)} />
         <Input label={"Condition"} type={"text"} value={condition} onChange={(e) => setCondition(e.target.value)} />
         <Input label={"Clinician attending to"} type={"text"} value={clinician} onChange={(e) => setClinician(e.target.value)} />
         <Input label={"Reffering Person"} type={"text"} value={reffer} onChange={(e) => setReffer(e.target.value)} />
        <Input label={"Date Registered"} type={"date"} value={dateRegistered} onChange={(e) => setDateRegistered(e.target.value)} />

            <div className="flex items-center flex-col md:flex-row gap-4  justify-between ">
            <Input label={"Number of Session"} type={"number"} value={numOfSessions} onChange={(e) => setNumOfSessions(e.target.value)} />
  <Input label={"Paid Session"} type={"number"} value={paidSessions} onChange={(e) => setPaidSessions(e.target.value)} />
  <Input label={"Amount per Session"} type={"number"} value={amountPerSession} onChange={(e) => setAmountPerSession(e.target.value)} />

            </div>
            <Input label={"Comment"} type={"text"} value={comment} onChange={(e) => setComment(e.target.value)} />
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

export default EshPatient