import React, { useMemo, useState, useEffect } from "react";
import useEshData from "../hooks/useEshData";
import { useParams, useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import Loader from "./Loader";
import { fetchFeeTable } from "../hooks/feeTables";
import { 
  AiOutlineArrowLeft, 
  AiOutlineCalendar, 
  AiOutlineLineChart,
  AiOutlineUser,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
  AiOutlineArrowDown
} from "react-icons/ai";
import { BsCashStack, BsPersonCheck, BsPersonBadge } from "react-icons/bs";

function EshBreakDown() {
  const { yearsData, loading: dataLoading } = useEshData();
  const params = useParams();
  const navigate = useNavigate();

  const [inpatientFee, setInpatientFee] = useState(null);
  const [outpatientFee, setOutpatientFee] = useState(null);
  const [loading, setLoading] = useState(true);

  const { year, monthName } = params;

  useEffect(() => {
    async function loadFees() {
      try {
        const [inpatient, outpatient] = await Promise.all([
          fetchFeeTable("inpatientfee"),
          fetchFeeTable("outpatientfee"),
        ]);
        setInpatientFee(inpatient);
        setOutpatientFee(outpatient);
      } finally {
        setLoading(false);
      }
    }
    loadFees();
  }, []);

  const inpatientMultiplier = inpatientFee?.[0]?.fee || 2000;
  const outpatientMultiplier = outpatientFee?.[0]?.fee || 2000;

  const selectedYear = useMemo(
    () => yearsData.find((yearData) => yearData.year === year),
    [yearsData, year]
  );

  const selectedMonth = useMemo(
    () =>
      selectedYear?.monthsData?.find((month) => month.name === monthName) ||
      null,
    [selectedYear, monthName]
  );

  if (loading || dataLoading || !inpatientFee || !outpatientFee || !selectedMonth) {
    return <Loader />;
  }

  const dailySessionsWithFilteredPatients = selectedMonth.dailySessions
    .filter((dayData) => dayData.sessions.length > 0)
    .map((dayData) => {
      const inPatients = dayData.sessions.filter(
        (patient) => patient.patientType === "In-patient"
      );
      const outPatients = dayData.sessions.filter(
        (patient) => patient.patientType === "Out-patient"
      );
      return { ...dayData, inPatients, outPatients };
    }
  );

  const totalInPatients = dailySessionsWithFilteredPatients.reduce(
    (total, dayData) => total + dayData.inPatients.length,
    0
  );

  const totalOutPatients = dailySessionsWithFilteredPatients.reduce(
    (total, dayData) => total + dayData.outPatients.length,
    0
  );

  const inRevenue = totalInPatients * inpatientMultiplier;
  const outRevenue = totalOutPatients * outpatientMultiplier;
  const totalRevenue = inRevenue + outRevenue;

  const handlePatientClick = (patientId) => {
    navigate(`/admin/patient/esh/${patientId}`);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      <AdminNav />
      
      {/* Floating Snap Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        <button 
          onClick={scrollToTop}
          className="w-14 h-14 bg-white text-slate-400 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-90 border border-slate-100 group"
          title="Scroll to First Day"
        >
          <AiOutlineArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
        <button 
          onClick={scrollToBottom}
          className="w-14 h-14 bg-white text-slate-400 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-90 border border-slate-100 group"
          title="Scroll to Last Day"
        >
          <AiOutlineArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
          >
            <AiOutlineArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <AiOutlineCalendar className="text-emerald-500" />
              {selectedMonth?.name} Daily Sessions
              <span className="text-slate-300 font-light ml-1">({year})</span>
            </h1>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <AiOutlineUser size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sessions</span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{selectedMonth.ses}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 italic">Confirmed Sessions</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BsPersonBadge size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In-Patients</span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{totalInPatients}</p>
              <p className="text-xs font-bold text-emerald-500 mt-1 uppercase tracking-tighter">
                {inRevenue.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <BsPersonCheck size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Out-Patients</span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{totalOutPatients}</p>
              <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-tighter">
                {outRevenue.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl">
                <BsCashStack size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</span>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-black text-white tracking-tight">
                {totalRevenue.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 mt-2">
                <AiOutlineLineChart />
                <span>MONTHLY PERFORMANCE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Reports Section */}
        <div className="space-y-12">
          {dailySessionsWithFilteredPatients.map((dayData) => (
            <div key={dayData.day} className="relative">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-lg relative z-10 border-4 border-slate-50">
                  {dayData.day}
                </div>
                <div className="h-[2px] flex-1 bg-slate-200 rounded-full"></div>
                <h2 className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">Day Break-down</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pl-8 md:pl-20 border-l-2 border-slate-100 ml-8 md:ml-10">
                {/* In-Patients Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      In-patients Records
                    </h3>
                    <span className="px-3 py-1 bg-white text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 shadow-sm">
                      {dayData.inPatients.length}
                    </span>
                  </div>
                  
                  {dayData.inPatients.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {dayData.inPatients.map((patient, index) => (
                        <div
                          key={index}
                          onClick={() => handlePatientClick(patient.patientId)}
                          className="group bg-white p-5 rounded-[1.75rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                              Rx
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{patient?.comment || "Consultation Record"}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{patient.patientId.slice(-6)}</p>
                            </div>
                          </div>
                          <AiOutlineArrowRight className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active in-patient logs</p>
                    </div>
                  )}
                </div>

                {/* Out-Patients Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                    <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      Out-patients Records
                    </h3>
                    <span className="px-3 py-1 bg-white text-blue-600 text-[10px] font-black rounded-full border border-blue-100 shadow-sm">
                      {dayData.outPatients.length}
                    </span>
                  </div>

                  {dayData.outPatients.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {dayData.outPatients.map((patient, index) => (
                        <div
                          key={index}
                          onClick={() => handlePatientClick(patient.patientId)}
                          className="group bg-white p-5 rounded-[1.75rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                              Rx
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{patient?.comment || "Consultation Record"}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{patient.patientId.slice(-6)}</p>
                            </div>
                          </div>
                          <AiOutlineArrowRight className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active out-patient logs</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {dailySessionsWithFilteredPatients.length === 0 && (
          <div className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 animate-pulse">
              <AiOutlineCalendar size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">No Sessions Found</h3>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
              There are no session records available for {selectedMonth?.name} {year}. 
              New clinical sessions will appear here as they are recorded.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default EshBreakDown;
