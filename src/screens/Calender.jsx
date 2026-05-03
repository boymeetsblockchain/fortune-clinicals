import React from 'react';
import AdminNav from '../components/AdminNav'
import { useNavigate } from "react-router-dom";
import useMonthsData from "../hooks/useMonthData";
import { Link } from 'react-router-dom';
import Loader from '../components/Loader'
import { HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi';

function Calendar() {
  const navigate = useNavigate();
  const { filteredMonthsData } = useMonthsData(); 

  if (!filteredMonthsData) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Reports</h1>
            <p className="text-slate-500 font-medium text-sm">Monthly overview of sessions and payments</p>
          </div>
          
          <Link 
            to={'/admin/calender/new'} 
            className="flex items-center gap-2 px-8 py-4 bg-[#FF5162] text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-100 hover:bg-[#E64858] transition-all hover:scale-105 active:scale-95"
          >
            <HiOutlineCalendar size={20} />
            Switch to 2024 View
            <HiOutlineArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMonthsData.map((month, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
              onClick={() => navigate(`/payments/${month.name}`)}
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
                  <p className="text-rose-600 font-extrabold text-lg">{month.pay}</p>
                </div>
              </div>

              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-[#FF5162] uppercase tracking-tighter">
                View Full Breakdown <HiOutlineArrowRight />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Calendar;
