import React, { useEffect, useState } from "react";
import EshNav from "../../components/EshNav";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase.config";
import {
  getDoc,
  doc,
  deleteDoc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Loader from "../../components/Loader";
import EshSession from "../../components/EshSession";
import Session from "../../components/Session";
import InitialReview from "../../components/InitialReview";
import Input from "../../components/Input";
import { AiTwotoneEdit, AiOutlineUser, AiOutlineArrowLeft } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import { toast } from "react-hot-toast";

function PatientDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [updatedDate, setUpdatedDate] = useState("");
  const [session, setSession] = useState([]);
  const [newsession, setNewSession] = useState([]);
  const [isActive, setIsActive] = useState("newsession");

  useEffect(() => {
    const getPatient = async () => {
      const docRef = doc(db, "eshpatients", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatient(docSnap.data());
        setLoading(false);
      }
    };

    const getSessionData = async () => {
      const q2023 = query(collection(db, "patientssessions"), where("patientId", "==", params.id));
      const q2024 = query(collection(db, "eshsessions"), where("patientId", "==", params.id));
      
      const snap2023 = await getDocs(q2023);
      const snap2024 = await getDocs(q2024);

      setSession(snap2023.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setNewSession(snap2024.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    getPatient();
    getSessionData();
  }, [params.id]);

  const onDelete = async () => {
    if (window.confirm("Delete this patient record from ESH database?")) {
      try {
        await deleteDoc(doc(db, "eshpatients", params.id));
        toast.success("Deleted successfully");
        navigate("/esh/patients");
      } catch (error) {
        console.error(error);
        toast.error("Error deleting record");
      }
    }
  };

  const UpdatePatient = async () => {
    if (!updatedDate) {
      toast.error("Select a log date");
      return;
    }
    try {
      const docRef = doc(db, "eshpatients", params.id);
      await updateDoc(docRef, { 
        ...patient, 
        updatedDate,
        updatedBy: auth.currentUser?.displayName || 'Unknown',
        lastUpdatedAt: new Date().toLocaleString()
      });
      toast.success("Activity logged");
      navigate(0);
    } catch (error) {
      console.error(error);
      toast.error("Log failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <EshNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          
          {/* Hero Section */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-bold shadow-inner ${
                patient?.selectedValue === 'In-patient' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {patient?.surname?.[0]?.toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {patient?.selectedTitle} {patient?.surname} {patient?.othername}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 uppercase tracking-widest`}>
                    ESH {patient?.selectedValue}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100 uppercase tracking-widest">
                    Reg: {patient?.dateRegistered}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/esh-update-patient/${params.id}`)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <AiTwotoneEdit size={20} className="text-emerald-500" />
                Edit Profile
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-red-600 font-bold text-sm hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 shadow-sm"
              >
                <ImBin size={18} />
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">Identity Details</h2>
                  <AiOutlineUser className="text-slate-200" size={24} />
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  {[
                    { label: "Age", value: patient?.age + " " + (patient?.ageRange || "Year") },
                    { label: "Gender", value: patient?.gender },
                    { label: "Phone", value: patient?.phoneNumber },
                    { label: "Emergency", value: patient?.phoneNumber2 },
                    { label: "Condition", value: patient?.condition },
                    { label: "Clinician", value: patient?.clinician },
                    { label: "Referrer", value: patient?.reffer },
                    { label: "Address", value: patient?.address },
                  ].map((info, i) => (
                    <div key={i} className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{info.label}</span>
                      <p className="text-slate-700 font-semibold">{info.value || "N/A"}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        label="Log Date"
                        type="date"
                        value={updatedDate}
                        onChange={(e) => setUpdatedDate(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={UpdatePatient}
                      className="mt-6 px-6 py-3.5 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95"
                    >
                      Update
                    </button>
                  </div>
                  
                  <div className="text-[10px] text-slate-400 leading-relaxed italic border-t border-slate-50 pt-4">
                    <p>Created by {patient?.userName} on {patient?.createdAt}</p>
                    {patient?.updatedBy && <p>Last updated by {patient?.updatedBy} on {patient?.lastUpdatedAt}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 min-h-[600px]">
                <div className="flex p-1.5 bg-slate-50 rounded-[1.75rem] mb-6">
                  {[
                    { id: "newsession", label: "2024 Sessions", count: newsession?.length },
                    { id: "session", label: "2023 Sessions", count: session?.length },
                    { id: "review", label: "Initial Review" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setIsActive(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        isActive === tab.id
                          ? "bg-white text-emerald-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          isActive === tab.id ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="px-4 py-2">
                  {isActive === "newsession" && (
                    <EshSession patientId={params.id} patientType={patient?.selectedValue} />
                  )}
                  {isActive === "session" && (
                    <Session patientId={params.id} patientType={"esh"} />
                  )}
                  {isActive === "review" && <InitialReview patientId={params.id} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientDetail;
