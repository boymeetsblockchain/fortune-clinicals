import React from 'react';
import useMonthsData from '../hooks/useMonthData';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import Loader from './Loader';
import { 
  AiOutlineArrowLeft, 
  AiOutlineCalendar, 
  AiOutlineArrowRight,
  AiOutlineLineChart
} from "react-icons/ai";
import { BsCashStack, BsWallet2 } from "react-icons/bs";

function BreakDown() {
  const { filteredMonthsData } = useMonthsData();
  const params = useParams();
  const { monthName } = params;
  const navigate = useNavigate();

  const selectedMonth = filteredMonthsData.find((month) => month.name === monthName);

  if (!selectedMonth) {
    return <Loader />;
  }

  const handlePatientClick = (patientId) => {
    navigate(`/admin/patient/${patientId}`);
  };

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
              <AiOutlineCalendar className="text-[#FF5162]" />
              {selectedMonth?.name} Transactions
            </h1>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center gap-8 group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className="w-20 h-20 bg-red-50 text-[#FF5162] rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-[#FF5162] group-hover:text-white transition-all">
              <BsWallet2 size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monthly Volume</p>
              <h2 className="text-4xl font-black text-slate-900">{selectedMonth.pay}</h2>
              <p className="text-xs font-bold text-slate-400 mt-1 italic">Total Payments Logged</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 flex items-center gap-8 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#FF5162]/10 rounded-full blur-3xl group-hover:bg-[#FF5162]/20 transition-all"></div>
            <div className="w-20 h-20 bg-[#FF5162] text-white rounded-3xl flex items-center justify-center shadow-lg relative z-10">
              <BsCashStack size={32} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Revenue</p>
              <h2 className="text-3xl font-black text-white tracking-tight">
                &#8358;{selectedMonth.totalPaymentsForMonth.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 mt-2">
                <AiOutlineLineChart />
                <span>FINANCIAL RECAP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily List */}
        <div className="space-y-12">
          {selectedMonth.dailyPayments
            .filter((day) => day.payments.length > 0)
            .map((dayData) => (
            <div key={dayData.day} className="relative">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-lg relative z-10 border-4 border-slate-50">
                  {dayData.day}
                </div>
                <div className="h-[2px] flex-1 bg-slate-200 rounded-full"></div>
                <div className="flex flex-col items-end">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    &#8358;{dayData.payments.reduce((total, p) => total + parseFloat(p.amount), 0).toLocaleString()}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Revenue</p>
                </div>
              </div>

              <div className="pl-8 md:pl-20 border-l-2 border-slate-100 ml-8 md:ml-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayData.payments.map((payment, index) => (
                    <div
                      key={index}
                      onClick={() => handlePatientClick(payment.patientId)}
                      className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-red-100 hover:border-red-200 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FF5162] flex items-center justify-center text-lg font-black group-hover:bg-[#FF5162] group-hover:text-white transition-all shadow-inner">
                          Tx
                        </div>
                        <AiOutlineArrowRight className="text-slate-200 group-hover:text-[#FF5162] group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-1">
                        &#8358;{parseFloat(payment.amount).toLocaleString()}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Amount</p>
                      
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase">#{payment.id.slice(-6)}</span>
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

export default BreakDown;
