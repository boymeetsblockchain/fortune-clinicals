import React from 'react';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import EshNav from '../../components/EshNav';
import { HiOutlineLogout, HiOutlineCash } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";

function EshProfile() {
  const navigate = useNavigate();
  const auth = getAuth();

  const onLogOut = async () => {
    try {
      await auth.signOut();
      toast.success("Successfully logged out");
      navigate('/');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <EshNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="relative mb-8 group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
              <AiOutlineUser className="text-slate-200" size={64} />
            </div>
          </div>

          <div className="space-y-2 mb-12">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ESH Profile</h1>
            <p className="text-slate-500 font-medium">
              Portal Access: <span className="text-emerald-600 font-bold">{auth?.currentUser?.displayName || auth?.currentUser?.email}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
            <button
              onClick={() => navigate('/esh-daily')}
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 p-5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-emerald-500/30 hover:text-emerald-600 transition-all group active:scale-95 shadow-sm"
            >
              <HiOutlineCash size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
              Daily Expenditures
            </button>
            <button
              onClick={onLogOut}
              className="flex items-center justify-center gap-3 bg-[#FF5162] p-5 rounded-2xl font-bold text-white hover:bg-[#E64858] transition-all shadow-lg shadow-red-100 active:scale-95 group"
            >
              <HiOutlineLogout size={24} className="group-hover:translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-50 w-full text-slate-400 text-xs font-medium">
            <p>ESH ID: {auth?.currentUser?.uid}</p>
            <p className="mt-1">Role: ESH Practitioner</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EshProfile;