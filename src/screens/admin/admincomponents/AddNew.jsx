import React, { useState } from 'react'
import { AiOutlineUser, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import Select from '../../../components/Select'
import Input from '../../../components/Input'
import { toast } from 'react-hot-toast'
import { getAuth } from 'firebase/auth'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../../../firebase.config'
import { options, titleOptions, ageData } from '../../../data'
import AdminNav from '../../../components/AdminNav'
import { Link, useNavigate } from 'react-router-dom'

function AddNewPatient() {
  const navigate = useNavigate()
  const auth = getAuth()
  
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
  const [selectedValue, setSelectedValue] = useState("Basic")
  const [selectedTitle, setSelectedTitle] = useState("Mr")
  const [reffer, setReffer] = useState("")
  const [ageRange, setAgeRange] = useState("Year")
  const [regNum, setRegNum] = useState("")
  const [updatedDate, setUpdatedDate] = useState("")
  const [gender, setGender] = useState("Male");

  const registerPatient = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        surname, othername, address, age, phoneNumber, condition,
        clinician, dateRegistered, numOfSessions, paidSessions,
        amountPerSession, reffer, comment, selectedValue,
        selectedTitle, phoneNumber2, caregiver, ageRange,
        regNum, updatedDate, gender
      }
      
      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
        userId: auth?.currentUser?.uid,
        userName: auth.currentUser?.displayName || 'Unknown',
        userEmail: auth.currentUser?.email || 'N/A',
        createdAt: new Date().toLocaleString(),
      }
      const data = await addDoc(collection(db, 'patients'), formDataCopy)
      toast.success("Patient saved successfully")
      navigate(`/admin/patient/${data.id}`)
    } catch (error) {
      console.log(error)
      toast.error("Failed to save patient")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <Link to={'/admin/patients'} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-[#FF5162] hover:bg-[#FF5162]/5 transition-all group">
              <AiOutlineArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="text-center flex-1">
              <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight capitalize'>New Patient</h1>
              <p className="text-slate-500 font-medium text-sm">Fill in the clinical records below</p>
            </div>
            <div className="w-12"></div>
          </div>

          <form className='space-y-8' onSubmit={registerPatient}>
            <div className='flex justify-center mb-8'>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF5162] to-rose-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center border border-slate-100">
                  <AiOutlineUser className='text-slate-300' size={48} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label={"Surname"} type={"text"} value={surname} onChange={(e) => setSurname(e.target.value)} />
              <Input label={"Other Name"} type={"text"} value={othername} onChange={(e) => setOthername(e.target.value)} />
              
              <div className="flex gap-4">
                <div className="w-1/3">
                  <Select
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    label="Title"
                    options={titleOptions}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input label={"Age"} type={"number"} value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className="w-24">
                      <Select
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                        label="Unit"
                        options={ageData}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                label="Patient Category"
                options={options}
              />

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Gender</label>
                <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setGender("Male")}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                      gender === "Male"
                        ? "bg-white text-blue-500 shadow-sm border border-blue-50"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("Female")}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                      gender === "Female"
                        ? "bg-white text-pink-500 shadow-sm border border-pink-50"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <Input label={"Registration Number"} type={"text"} value={regNum} onChange={(e) => setRegNum(e.target.value)} />
              <Input label={"Address"} type={"text"} value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input label={"Phone Number"} type={"number"} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <Input label={"Emergency Phone"} type={"number"} value={phoneNumber2} onChange={(e) => setPhoneNumber2(e.target.value)} />
              <Input label={"Caregiver Details"} type={"text"} value={caregiver} onChange={(e) => setCareGiver(e.target.value)} />
              <Input label={"Condition"} type={"text"} value={condition} onChange={(e) => setCondition(e.target.value)} />
              <Input label={"Assigned Clinician"} type={"text"} value={clinician} onChange={(e) => setClinician(e.target.value)} />
              <Input label={"Referring Source"} type={"text"} value={reffer} onChange={(e) => setReffer(e.target.value)} />
              <Input label={"Date Registered"} type={"date"} value={dateRegistered} onChange={(e) => setDateRegistered(e.target.value)} />
            </div>

            <div className="pt-8 border-t border-slate-50">
              <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Session Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label={"Total Sessions"} type={"number"} value={numOfSessions} onChange={(e) => setNumOfSessions(e.target.value)} />
                <Input label={"Paid Sessions"} type={"number"} value={paidSessions} onChange={(e) => setPaidSessions(e.target.value)} />
                <Input label={"Rate Per Session"} type={"number"} value={amountPerSession} onChange={(e) => setAmountPerSession(e.target.value)} />
              </div>
            </div>

            <div className="space-y-6">
              <Input label={"Additional Comments"} type={"text"} value={comment} onChange={(e) => setComment(e.target.value)} />
              
              <button 
                type="submit"
                className="w-full bg-[#FF5162] py-5 flex items-center justify-center gap-3 text-white font-bold rounded-[1.5rem] shadow-xl shadow-red-100 hover:bg-[#E64858] hover:shadow-red-200 transition-all active:scale-[0.98]"
              >
                Create Record <AiOutlineArrowRight />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddNewPatient