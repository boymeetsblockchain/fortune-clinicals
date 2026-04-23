import { FadeLoader } from 'react-spinners';
import React from 'react';

function Loader() {
  return (
    
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute -inset-4 bg-[#FF5162]/10 rounded-full blur-xl animate-pulse"></div>
        <FadeLoader color="#FF5162" />
      </div>
      <p className="mt-8 text-slate-400 font-medium animate-pulse text-sm tracking-widest uppercase">Loading</p>
    </div>
  );
}

export default Loader;
