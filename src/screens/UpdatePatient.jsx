import React from 'react'
import {AiOutlineUser,AiOutlineArrowLeft,AiOutlineArrowRight} from 'react-icons/ai'
import Input from '../components/Input'
import Select from '../components/Select'
import { useState,useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import Navbar from '../components/Navbar'
import { options,titleOptions, ageData } from '../data'
import { Link, useNavigate,useParams} from 'react-router-dom'
function UpdatePatient() {
  const navigate = useNavigate()
  const params = useParams();
    const [surname, setSurname] = useState("");
    const [othername, setOthername] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
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
    const[selectedValue,setSelectedValue]=useState("Basic")
    const[selectedTitle,setSelectedTitle]=useState("Mr")
    const[reffer,setReffer]= useState("")
    const[ageRange,setAgeRange]= useState("Year")
    const[regNum,setRegNum]= useState("")
   

    useEffect(() => {
      const getPatient = async () => {
        const docRef = doc(db, 'patients', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
    
          // Set the data from Firestore into the corresponding state variables
          setSurname(data.surname || "");
          setOthername(data.othername || "");
          setAddress(data.address || "");
          setAge(data.age || "");
          setPhoneNumber(data.phoneNumber || "");
          setPhoneNumber2(data.phoneNumber2 || "");
          setCareGiver(data.caregiver || "");
          setCondition(data.condition || "");
          setClinician(data.clinician || "");
          setDateRegistered(data.dateRegistered || "");
          setNumOfSessions(data.numOfSessions || "");
          setPaidSessions(data.paidSessions || "");
          setComment(data.comment || "");
          setAmountPerSession(data.amountPerSession || "");
          setSelectedValue(data.selectedValue || "Basic");
          setSelectedTitle(data.selectedTitle || "Mr");
          setReffer(data.reffer || "");
          setAgeRange(data.ageRange || "Year");
          setRegNum(data.regNum || "");
        }
      };
    
      getPatient();
    }, [params.id]);
    ;
  
    
  
    const updatePatient = async (e) => {
      e.preventDefault();
    
      try {
        const docRef = doc(db, 'patients', params.id);
        const docSnap = await getDoc(docRef);
    
        if (!docSnap.exists()) {
          toast.error('Patient does not exist.');
          return;
        }
    
        // Create an object with the updated data
        const updatedData = {
          surname,
          othername,
          address,
          age,
          phoneNumber,
          phoneNumber2,
          caregiver,
          condition,
          clinician,
          dateRegistered,
          numOfSessions,
          paidSessions,
          amountPerSession,
          reffer,
          comment,
          selectedValue,
          selectedTitle,
          ageRange,
          regNum,
        };
    
        // Update the document in Firestore
        await updateDoc(docRef, updatedData);
    
        toast.success('Patient updated successfully.');
        navigate(-1); // Redirect to the patient list after update
      } catch (error) {
        console.error('Error updating patient:', error);
        toast.error('Error updating patient data.');
      }
    };
    

  return (
    <>
    <Navbar/>
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 md:px-8 lg:px-12">
      <Link to={'/dashboard/patients'}>
          <AiOutlineArrowLeft size={32} className='my-2  text-[#FF5162]  cursor-pointer'/>
          </Link>

          <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Update Patient</h1>
            <form className='flex flex-col space-y-4 justify-center w-full mx-auto' onSubmit={updatePatient}>
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
            <div className="age flex justify-evenly ">
              <Input label={"Age"} type={"number"} value={age} onChange={(e) => setAge(e.target.value)} />
              <Select
  id="selectInput"
  value={ageRange}
  onChange={(e)=>setAgeRange(e.target.value)}
  label="in"
  options={ageData}
/>
            </div>
            <Select
  id="selectInput"
  value={selectedValue}
  onChange={(e)=>setSelectedValue(e.target.value)}
  label="Select an option"
  options={options}
/>
          <Input label={"Address"} type={"text"} value={address} onChange={(e) => setAddress(e.target.value)} />
          <Input label={"Registration Number"} type={"text"} value={regNum} onChange={(e) => setRegNum(e.target.value)} />
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
                 Update <AiOutlineArrowRight/>
                </button>
              </div>
          </form>
        </div>
    </>
  
  )
}

export default UpdatePatient