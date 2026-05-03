import React, { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import { useNavigate } from "react-router-dom";
import { collection, where, query, getDocs, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { ImBin } from "react-icons/im";
import { AiTwotoneEdit } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Loader from "../../components/Loader";
import EshSession from "../../components/EshSession";
import Session from "../../components/Session";
import Input from "../../components/Input";
import InitialReview from "../../components/InitialReview";

function AdminPatientDetail() {
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
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        await deleteDoc(doc(db, "eshpatients", params.id));
        navigate(-1);
        toast.success("Deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Error deleting record");
      }
    }
  };

  const UpdatePatient = async () => {
    if (!updatedDate) {
      toast.error("Please select a date");
      return;
    }
    try {
      const docRef = doc(db, "eshpatients", params.id);
      const updatedData = { 
        ...patient, 
        updatedDate,
        updatedBy: auth.currentUser?.displayName || 'Unknown',
        lastUpdatedAt: new Date().toLocaleString()
      };
      await updateDoc(docRef, updatedData);
      toast.success("Record updated");
      navigate(0);
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-3xl font-bold text-emerald-600 shadow-inner">
                {patient?.surname?.[0]?.toUpperCase()}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {patient?.selectedTitle} {patient?.surname} {patient?.othername}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                    ESH Patient
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    patient?.selectedValue === 'In-patient' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                  }`}>
                    {patient?.selectedValue}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-100">
                    Reg: {patient?.dateRegistered}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/update/esh/${params.id}`)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <AiTwotoneEdit size={20} className="text-blue-500" />
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
                <h2 className="text-xl font-bold text-slate-800 pb-4 border-b border-slate-50">Patient Details</h2>
                
                <div className="grid grid-cols-1 gap-5">
                  {[
                    { label: "Age", value: patient?.age },
                    { label: "Gender", value: patient?.gender },
                    { label: "Phone", value: patient?.phoneNumber },
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
                      className="h-full px-6 py-4 bg-[#FF5162] text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-100 hover:bg-[#E64858] transition-all"
                    >
                      Log
                    </button>
                  </div>
                  
                  <div className="text-[10px] text-slate-400 leading-relaxed italic">
                    <p>Created by {patient?.userName} on {patient?.createdAt}</p>
                    {patient?.updatedBy && <p>Last updated by {patient?.updatedBy} on {patient?.lastUpdatedAt}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 min-h-[600px]">
                <div className="flex p-1 bg-slate-50 rounded-[1.5rem] mb-6">
                  {[
                    { id: "newsession", label: "2024 Sessions", count: newsession?.length },
                    { id: "session", label: "2023 Sessions", count: session?.length },
                    { id: "review", label: "Initial Review" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setIsActive(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                        isActive === tab.id
                          ? "bg-white text-[#FF5162] shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          isActive === tab.id ? "bg-[#FF5162] text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="px-2">
                  {isActive === "newsession" && (
                    <EshSession patientId={params.id} patientType={"esh"} />
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

export default AdminPatientDetail;
