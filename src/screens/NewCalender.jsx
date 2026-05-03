import React from "react";
import AdminNav from "../components/AdminNav";
import { useNavigate } from "react-router-dom";
import useNewMonthData from "../hooks/useNewMonthData";
import Loader from "../components/Loader";
import { HiOutlineCalendar, HiOutlineArrowRight, HiOutlineTrendingUp } from 'react-icons/hi';

function Calendar() {
  const navigate = useNavigate();
  const { yearsData } = useNewMonthData();

  if (!yearsData) {
    return <Loader />;
  }

  const currentYear = new Date().getFullYear();
  const sortedYearsData = [...yearsData].sort((a, b) => {
    if (a.year === currentYear) return -1;
    if (b.year === currentYear) return 1;
    return b.year - a.year;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Annual Performance</h1>
          <p className="text-slate-500 font-medium text-sm">Year-over-year clinical data analysis</p>
        </div>

        <div className="space-y-20">
          {sortedYearsData.map((yearData) => (
            <div key={yearData.year} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className={`px-6 py-2 rounded-2xl text-xl font-black shadow-sm border ${
                  yearData.year === currentYear
                    ? "bg-[#FF5162] text-white border-red-400 shadow-red-100"
                    : "bg-white text-slate-900 border-slate-200 shadow-slate-100"
                }`}>
                  {yearData.year}
                </div>
                <div className="flex-1 h-px bg-slate-200"></div>
                {yearData.year === currentYear && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <HiOutlineTrendingUp /> Active Year
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {yearData.monthsData.map((month, index) => (
                  <div
                    key={index}
                    className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
                    onClick={() => navigate(`/payments/new/${yearData.year}/${month.name}`)}
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6 group-hover:bg-[#FF5162]/5 group-hover:text-[#FF5162] transition-colors">
                      <HiOutlineCalendar size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4 group-hover:text-[#FF5162] transition-colors">
                      {month.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 w-full pt-6 border-t border-slate-50">
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sessions</span>
                        <p className="text-emerald-600 font-extrabold text-lg">{month.ses}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payments</span>
                        <p className="text-rose-600 font-extrabold text-lg">{month?.pay || 0}</p>
                      </div>
                    </div>

                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-[#FF5162] uppercase tracking-tighter">
                      View Detailed Stats <HiOutlineArrowRight />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Calendar;
