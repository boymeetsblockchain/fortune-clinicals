import React, { useState, useEffect } from 'react'
import { AiOutlineUser, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { toast } from 'react-hot-toast'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../../firebase.config'
import EshNav from '../../components/EshNav'
import { ageData, titleOptions, Eshoptions } from '../../data'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'

function UpdatePatient() {
  const navigate = useNavigate()
  const params = useParams();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  
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
  const [comment, setComment] = useState("");
  const [amountPerSession, setAmountPerSession] = useState("");
  const [selectedValue, setSelectedValue] = useState("In-patient")
  const [selectedTitle, setSelectedTitle] = useState("Mr")
  const [reffer, setReffer] = useState("")
  const [ageRange, setAgeRange] = useState("Year")
  const [regNum, setRegNum] = useState("")
  const [gender, setGender] = useState("Male");

  useEffect(() => {
    const getPatient = async () => {
      try {
        const docRef = doc(db, 'eshpatients', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
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
          setSelectedValue(data.selectedValue || "In-patient");
          setSelectedTitle(data.selectedTitle || "Mr");
          setReffer(data.reffer || "");
          setAgeRange(data.ageRange || "Year");
          setRegNum(data.regNum || "");
          setGender(data.gender || "Male");
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch record");
      }
    };
    getPatient();
  }, [params.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'eshpatients', params.id);
      const updatedData = {
        surname, othername, address, age, phoneNumber, phoneNumber2,
        caregiver, condition, clinician, dateRegistered, numOfSessions,
        paidSessions, amountPerSession, reffer, comment, selectedValue,
        selectedTitle, ageRange, regNum, gender,
        updatedBy: auth.currentUser?.displayName || 'Unknown',
        lastUpdatedAt: new Date().toLocaleString()
      };
      await updateDoc(docRef, updatedData);
      toast.success('Record updated successfully');
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50">
      <EshNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all group">
              <AiOutlineArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="text-center flex-1">
              <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>Update ESH Record</h1>
              <p className="text-slate-500 font-medium text-sm">Refining patient data for {surname}</p>
            </div>
            <div className="w-12"></div>
          </div>

          <form className='space-y-8' onSubmit={handleUpdate}>
            <div className='flex justify-center mb-8'>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
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
                label="ESH Status"
                options={Eshoptions}
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

              <Input label={"Address"} type={"text"} value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input label={"Registration Number"} type={"text"} value={regNum} onChange={(e) => setRegNum(e.target.value)} />
              <Input label={"Phone Number"} type={"number"} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <Input label={"Emergency Phone"} type={"number"} value={phoneNumber2} onChange={(e) => setPhoneNumber2(e.target.value)} />
              <Input label={"Caregiver Details"} type={"text"} value={caregiver} onChange={(e) => setCareGiver(e.target.value)} />
              <Input label={"Condition"} type={"text"} value={condition} onChange={(e) => setCondition(e.target.value)} />
              <Input label={"Assigned Clinician"} type={"text"} value={clinician} onChange={(e) => setClinician(e.target.value)} />
              <Input label={"Referring Source"} type={"text"} value={reffer} onChange={(e) => setReffer(e.target.value)} />
              <Input label={"Date Registered"} type={"date"} value={dateRegistered} onChange={(e) => setDateRegistered(e.target.value)} />
            </div>

            <div className="pt-8 border-t border-slate-50">
              <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Clinical Sessions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label={"Total Sessions"} type={"number"} value={numOfSessions} onChange={(e) => setNumOfSessions(e.target.value)} />
                <Input label={"Paid Sessions"} type={"number"} value={paidSessions} onChange={(e) => setPaidSessions(e.target.value)} />
                <Input label={"Rate Per Session"} type={"number"} value={amountPerSession} onChange={(e) => setAmountPerSession(e.target.value)} />
              </div>
            </div>

            <div className="space-y-6">
              <Input label={"Internal Comments"} type={"text"} value={comment} onChange={(e) => setComment(e.target.value)} />
              
              <button 
                type="submit"
                className="w-full bg-emerald-500 py-5 flex items-center justify-center gap-3 text-white font-bold rounded-[1.5rem] shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-[0.98]"
              >
                Update Clinical Record <AiOutlineArrowRight />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default UpdatePatient