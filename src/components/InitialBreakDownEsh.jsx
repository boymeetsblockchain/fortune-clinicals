import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EshNav from "./EshNav";
import Loader from "./Loader";
import useInitialReview from "../hooks/useEshInitial";
import { fetchFeeTable } from "../hooks/feeTables";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import toast from "react-hot-toast";
import { 
  AiOutlineArrowLeft, 
  AiOutlineCalendar, 
  AiOutlineStar,
  AiOutlineArrowRight,
  AiOutlineLineChart,
  AiOutlineArrowUp,
  AiOutlineArrowDown
} from "react-icons/ai";
import { BsCashStack, BsCardChecklist } from "react-icons/bs";
import { ImBin } from "react-icons/im";

function InitialBreakDownEsh() {
  const { yearsData, refetch } = useInitialReview();
  const { year, monthName } = useParams();
  const navigate = useNavigate();
  const [inpatientFee, setInpatientFee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isClearingMonth, setIsClearingMonth] = useState(false);

  useEffect(() => {
    fetchFeeTable("initialreviewfee").then((fee) => {
      setInpatientFee(fee);
      setLoading(false);
    });
  }, []);

  const inpatientMultiplier = inpatientFee?.[0]?.fee || 2000;

  if (loading || !yearsData || yearsData.length === 0) {
    return <Loader />;
  }

  const selectedYear = yearsData.find((yearData) => yearData.year === year);
  const selectedMonth = selectedYear?.monthsData.find(
    (month) => month.name === monthName
  );

  if (!selectedMonth) {
    return (
      <div className="min-h-screen bg-slate-50">
        <EshNav />
        <main className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <AiOutlineCalendar size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">No Data Available</h1>
          <p className="text-slate-400 font-medium">No initial reviews found for {monthName} {year}.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all"
          >
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const handlePatientClick = (patientId) => {
    navigate(`/esh-patient/${patientId}`);
  };

  const handleDeleteReview = async (e, reviewId) => {
    e.stopPropagation();

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this initial review? This action cannot be undone."
    );

    if (!isConfirmed) return;

    try {
      setDeletingId(reviewId);
      await deleteDoc(doc(db, "reviews", reviewId));
      toast.success("Initial review deleted successfully");
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete initial review");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearMonth = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete all ${selectedMonth.rev} initial reviews for ${selectedMonth.name} ${year}? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      setIsClearingMonth(true);
      const allMonthReviewIds = selectedMonth.dailyReviews
        .flatMap((dayData) => dayData.reviews.map((r) => r.id))
        .filter(Boolean);

      await Promise.all(
        allMonthReviewIds.map((reviewId) =>
          deleteDoc(doc(db, "reviews", reviewId))
        )
      );

      toast.success(`All initial reviews for ${selectedMonth.name} deleted successfully`);
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      console.error("Error clearing month reviews:", error);
      toast.error("Failed to clear initial reviews for this month");
    } finally {
      setIsClearingMonth(false);
    }
  };

  const totalRevenue = selectedMonth.rev * inpatientMultiplier;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      <EshNav />

      {/* Floating Snap Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        <button 
          onClick={scrollToTop}
          className="w-14 h-14 bg-white text-slate-400 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-90 border border-slate-100 group"
          title="Scroll to Top"
        >
          <AiOutlineArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
        <button 
          onClick={scrollToBottom}
          className="w-14 h-14 bg-white text-slate-400 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-90 border border-slate-100 group"
          title="Scroll to Bottom"
        >
          <AiOutlineArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
              title="Go Back"
            >
              <AiOutlineArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <AiOutlineStar className="text-amber-500" />
                {selectedMonth?.name} Initial Reviews
                <span className="text-slate-300 font-light ml-1">({year})</span>
              </h1>
            </div>
          </div>

          {selectedMonth?.rev > 0 && (
            <button
              onClick={handleClearMonth}
              disabled={isClearingMonth}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-xs border border-red-200 transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
              title="Delete all initial reviews in this month"
            >
              {isClearingMonth ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ImBin size={14} />
              )}
              <span>Delete Month's Reviews</span>
            </button>
          )}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center gap-8 group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-amber-600 group-hover:text-white transition-all">
              <BsCardChecklist size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Reviews</p>
              <h2 className="text-4xl font-black text-slate-900">{selectedMonth.rev}</h2>
              <p className="text-xs font-bold text-slate-400 mt-1 italic">Confirmed Case Files</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 flex items-center gap-8 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
            <div className="w-20 h-20 bg-amber-500 text-white rounded-3xl flex items-center justify-center shadow-lg relative z-10">
              <BsCashStack size={32} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Revenue Generated</p>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {totalRevenue.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 mt-2">
                <AiOutlineLineChart />
                <span>FINANCIAL PERFORMANCE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-12">
          {selectedMonth.dailyReviews
            .filter((dayData) => dayData.reviews.length > 0)
            .map((dayData) => (
            <div key={dayData.day} className="relative">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-lg relative z-10 border-4 border-slate-50">
                  {dayData.day}
                </div>
                <div className="h-[2px] flex-1 bg-slate-200 rounded-full"></div>
                <h2 className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">Daily Intake</h2>
              </div>

              <div className="pl-8 md:pl-20 border-l-2 border-slate-100 ml-8 md:ml-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayData.reviews.map((patient, index) => (
                    <div
                      key={patient.id || index}
                      onClick={() => handlePatientClick(patient.patientId)}
                      className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-amber-100 hover:border-amber-200 transition-all cursor-pointer relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-black group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner">
                            {index + 1}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteReview(e, patient.id)}
                              disabled={deletingId === patient.id}
                              className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 disabled:opacity-50 group/btn"
                              title="Delete Initial Review"
                            >
                              {deletingId === patient.id ? (
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <ImBin size={16} className="group-hover/btn:scale-110 transition-transform" />
                              )}
                            </button>

                            <div className="p-1 text-slate-200 group-hover:text-amber-500 group-hover:translate-x-1 transition-all">
                              <AiOutlineArrowRight size={18} />
                            </div>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] mb-2 leading-relaxed">
                          {patient?.comment || "Standard Initial Review Record"}
                        </h3>

                        {(patient?.userName || patient?.createdAt) && (
                          <p className="text-[10px] text-slate-400 italic mb-2">
                            {patient?.userName ? `By ${patient.userName}` : ""}
                            {patient?.userName && patient?.createdAt ? " • " : ""}
                            {patient?.createdAt || ""}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Ref</span>
                        <span className="text-[10px] font-black text-slate-900">
                          #{patient.patientId ? patient.patientId.slice(-6).toUpperCase() : "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default InitialBreakDownEsh;
