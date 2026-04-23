import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { FaCheck } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { AiTwotoneEdit } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Loader from "../components/Loader";
import Payment from "../components/Payment";
import Session from "../components/Session";
import NewSession from "../components/NewSession";
import NewPayment from "../components/NewPayment";
import Input from "../components/Input";

function PatientDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [updatedDate, setUpdatedDate] = useState("");
  const [payment, setPayment] = useState("");
  const [session, setSession] = useState("");
  const [newsession, setNewSession] = useState("");
  const [newpayment, setNewPayment] = useState("");
  const [isActive, setIsActive] = useState("newsession");

  useEffect(() => {
    const getPatient = async () => {
      const docRef = doc(db, "patients", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatient(docSnap.data());
        console.log(docSnap.data());
        setLoading(false);
      }
    };

    const getPayment = async () => {
      const paymentsQuery = query(
        collection(db, "patientspayments"),
        where("patientId", "==", params.id)
      );
      const querySnapshot = await getDocs(paymentsQuery);

      // Use map to directly transform querySnapshot to an array of paymentDetails
      const paymentDetails = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayment(paymentDetails);
    };
    const getNewPayment = async () => {
      const paymentsQuery = query(
        collection(db, "newpayments"),
        where("patientId", "==", params.id)
      );
      const querySnapshot = await getDocs(paymentsQuery);

      // Use map to directly transform querySnapshot to an array of paymentDetails
      const paymentDetails = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewPayment(paymentDetails);
    };

    const getSession = async () => {
      const paymentsQuery = query(
        collection(db, "patientssessions"),
        where("patientId", "==", params.id)
      );
      const querySnapshot = await getDocs(paymentsQuery);

      // Use map to directly transform querySnapshot to an array of paymentDetails
      const sessionDetails = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSession(sessionDetails);
    };
    const getNewSession = async () => {
      const paymentsQuery = query(
        collection(db, "newsessions"),
        where("patientId", "==", params.id)
      );
      const querySnapshot = await getDocs(paymentsQuery);
      // Use map to directly transform querySnapshot to an array of paymentDetails
      const sessionDetails = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewSession(sessionDetails);
    };

    getPayment();
    getPatient();
    getSession();
    getNewSession();
    getNewPayment();
  }, [params.id]);

  const onDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this patient record?")
    ) {
      try {
        const docRef = doc(db, "patients", params.id);
        await deleteDoc(docRef);
        toast.success("Deleted");
        navigate("/dashboard/patients");
        // Redirect or perform any other action after deletion
      } catch (error) {
        console.error("Error deleting patient record:", error);
        toast.error("Error deleting patient record");
      }
    }
  };

  const UpdatePatient = async () => {
    try {
      // Ensure updatedDate is not empty before proceeding
      if (!updatedDate) {
        toast.error("Please select or enter an updated date.");
        return;
      }

      // Update the patient data with the new updatedDate
      const docRef = doc(db, "patients", params.id);
      const updatedPatientData = {
        ...patient,
        updatedDate,
        updatedBy: auth.currentUser?.displayName || 'Unknown',
        updatedByEmail: auth.currentUser?.email || 'N/A',
        lastUpdatedAt: new Date().toLocaleString()
      };
      await updateDoc(docRef, updatedPatientData);

      // Show success message and navigate
      toast.success("Patient record updated successfully.");
      navigate(0);
    } catch (error) {
      console.error("Error updating patient record:", error);
      toast.error("Error updating patient record");
    }
  };

  const UpdatePatientDetails = (params) => {
    navigate(`/update/${params}`);
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] bg-[#FF5162]/5 flex items-center justify-center text-3xl font-bold text-[#FF5162] shadow-inner">
                {patient?.surname?.[0].toUpperCase()}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {patient?.selectedTitle} {patient?.surname} {patient?.othername}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                    ID: {patient?.regNum}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
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
                onClick={() => UpdatePatientDetails(params.id)}
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
            {/* Sidebar - Details */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
                <h2 className="text-xl font-bold text-slate-800 pb-4 border-b border-slate-50">Patient Information</h2>

                <div className="grid grid-cols-1 gap-5">
                  {[
                    { label: "Age", value: `${patient?.age} ${patient?.ageRange}` },
                    { label: "Gender", value: patient?.gender },
                    { label: "Primary Phone", value: patient?.phoneNumber },
                    { label: "Secondary Phone", value: patient?.phoneNumber2 || "N/A" },
                    { label: "Condition", value: patient?.condition },
                    { label: "Assessed By", value: patient?.clinician },
                    { label: "Caregiver", value: patient?.caregiver || "None listed" },
                    { label: "Address", value: patient?.address },
                  ].map((info, i) => (
                    <div key={i} className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{info.label}</span>
                      <p className="text-slate-700 font-semibold">{info.value}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        label="Update Date"
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
                    {patient?.userName && <p>Created by {patient?.userName} on {patient?.createdAt}</p>}
                    {patient?.updatedBy && <p>Last updated by {patient?.updatedBy} on {patient?.lastUpdatedAt}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Sessions & Payments */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
                {/* Custom Tabs */}
                <div className="flex p-1 bg-slate-50 rounded-[1.5rem] mb-6">
                  {[
                    { id: "newsession", label: "2024 Sessions", count: newsession?.length },
                    { id: "newpayment", label: "2024 Payments", count: newpayment?.length },
                    { id: "session", label: "2023 Sessions", count: session?.length },
                    { id: "payment", label: "2023 Payments", count: payment?.length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setIsActive(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${isActive === tab.id
                        ? "bg-white text-[#FF5162] shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      {tab.label}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive === tab.id ? "bg-[#FF5162] text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                        {tab.count || 0}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="min-h-[500px]">
                  {isActive === "payment" && <Payment patientId={params.id} />}
                  {isActive === "session" && <Session patientId={params.id} />}
                  {isActive === "newsession" && (
                    <NewSession patientId={params.id} patientType={"fortune"} />
                  )}
                  {isActive === "newpayment" && (
                    <NewPayment patientId={params.id} patientType={"fortune"} />
                  )}
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
