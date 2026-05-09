import React, { useMemo } from "react";
import useNewMonthData from "../hooks/useNewMonthData";
import { useParams, useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import Loader from "./Loader";
import { 
  AiOutlineArrowLeft, 
  AiOutlineCalendar, 
  AiOutlineArrowRight,
  AiOutlineLineChart,
  AiOutlineHistory
} from "react-icons/ai";
import { BsCashStack, BsWallet2, BsCheck2Circle } from "react-icons/bs";

function BreakDown() {
  const { yearsData } = useNewMonthData();
  const params = useParams();
  const { year, monthName } = params;
  const navigate = useNavigate();

  const selectedYear = useMemo(
    () => yearsData.find((yearData) => yearData.year === year),
    [yearsData, year]
  );

  const selectedMonth = useMemo(
    () =>
      selectedYear
        ? selectedYear.monthsData.find((month) => month.name === monthName)
        : null,
    [selectedYear, monthName]
  );

  if (!selectedMonth) {
    return <Loader />;
  }

  const handlePatientClick = (patientId) => {
    navigate(`/admin/patient/${patientId}`);
  };

  const mappedPayments = selectedMonth.dailyPayments.map(
    (paymentsForDay, index) => {
      return {
        day: index + 1,
        payments: paymentsForDay.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          comment: payment.comment,
          patientId: payment.patientId,
          patientType: payment.patientType,
          datePayed: payment.datePayed,
        })),
      };
    }
  );

  const activeDays = mappedPayments.filter(day => day.payments.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
          >
            <AiOutlineArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <AiOutlineHistory className="text-[#FF5162]" />
              {selectedMonth?.name} Transactions Recipient
              <span className="text-slate-300 font-light ml-1">({year})</span>
            </h1>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 text-[#FF5162] rounded-2xl group-hover:bg-[#FF5162] group-hover:text-white transition-colors">
                <BsWallet2 size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Volume</span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{selectedMonth.totalPaymentsForMonth ? (selectedMonth.dailyPayments.flat().length) : 0}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 italic">Total Payments Processed</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BsCheck2Circle size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Days</span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{activeDays.length}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 italic">Days with transactions</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200 flex flex-col justify-between group relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#FF5162]/10 rounded-full blur-3xl group-hover:bg-[#FF5162]/20 transition-all"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-[#FF5162] text-white rounded-2xl shadow-lg shadow-red-500/20">
                <BsCashStack size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Net Revenue</span>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black text-white tracking-tight">
                ₦{selectedMonth.totalPaymentsForMonth?.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 mt-2 uppercase tracking-tighter">
                <AiOutlineLineChart />
                <span>Monthly Financial Recap</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-16">
          {activeDays.map((dayData) => (
            <div key={dayData.day} className="relative">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-xl relative z-10 border-4 border-white transform hover:rotate-6 transition-transform">
                  {dayData.day}
                </div>
                <div className="h-[2px] flex-1 bg-slate-100 rounded-full"></div>
                <div className="flex flex-col items-end">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    ₦{dayData.payments.reduce((total, p) => total + parseFloat(p.amount), 0).toLocaleString()}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Revenue</p>
                </div>
              </div>

              <div className="pl-8 md:pl-20 border-l-2 border-slate-100 ml-8 md:ml-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayData.payments.map((payment, index) => (
                    <div
                      key={index}
                      onClick={() => handlePatientClick(payment.patientId)}
                      className="group bg-white p-6 rounded-[2.25rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-2 h-full ${
                        payment.patientType === "Home-Patient" ? "bg-emerald-500" :
                        payment.patientType === "Hospital-Calls" ? "bg-purple-500" :
                        payment.patientType === "Home-Patient-Admin" ? "bg-amber-500" :
                        payment.patientType === "Vip" ? "bg-blue-500" :
                        "bg-[#FF5162]"
                      }`}></div>
                      
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner ${
                          payment.patientType === "Home-Patient" ? "bg-emerald-50 text-emerald-600" :
                          payment.patientType === "Hospital-Calls" ? "bg-purple-50 text-purple-600" :
                          payment.patientType === "Home-Patient-Admin" ? "bg-amber-50 text-amber-600" :
                          payment.patientType === "Vip" ? "bg-blue-50 text-blue-600" :
                          "bg-red-50 text-[#FF5162]"
                        }`}>
                          Tx
                        </div>
                        <AiOutlineArrowRight className="text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-900">
                          ₦{parseFloat(payment.amount).toLocaleString()}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Transaction Amount</p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            payment.patientType === "Home-Patient" ? "bg-emerald-50 text-emerald-600" :
                            payment.patientType === "Hospital-Calls" ? "bg-purple-50 text-purple-600" :
                            payment.patientType === "Home-Patient-Admin" ? "bg-amber-50 text-amber-600" :
                            payment.patientType === "Vip" ? "bg-blue-50 text-blue-600" :
                            "bg-red-50 text-[#FF5162]"
                          }`}>
                            {payment.patientType}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reference</p>
                          <p className="text-[10px] font-black text-slate-900 uppercase">#{payment.id.slice(-6)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeDays.length === 0 && (
          <div className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
              <AiOutlineCalendar size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">No Transactions Recorded</h3>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
              We couldn't find any transaction data for {selectedMonth?.name} {year}. 
              Please check back later or verify the date filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default BreakDown;
