import React, { useState } from "react";
import EshProducts from "./admincomponents/EshProducts";
import Products from "./admincomponents/Products";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from 'react-icons/hi';

const Navbar = ({ activePatient, setActivePatient }) => {
    const navigate = useNavigate();
    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-slate-600 hover:text-[#FF5162] font-bold text-sm transition-colors group"
                    >
                        <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-[#FF5162]/10 transition-colors">
                            <HiOutlineArrowLeft size={20} />
                        </div>
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </button>

                    <div className="flex p-1 bg-slate-50 rounded-2xl">
                        <button
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activePatient === 'patient1'
                                    ? 'bg-white text-[#FF5162] shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                            onClick={() => setActivePatient('patient1')}
                        >
                            Fortune Inventory
                        </button>
                        <button
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activePatient === 'patient2'
                                    ? 'bg-white text-[#FF5162] shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                            onClick={() => setActivePatient('patient2')}
                        >
                            ESH Inventory
                        </button>
                    </div>
                    
                    <div className="w-10 sm:w-40"></div>
                </div>
            </div>
        </nav>
    );
};

const ProductDetail = ({ activePatient }) => {
  return (
    <div className="flex-grow">
      {activePatient === "patient1" && (
        <Products />
      )}
      {activePatient === "patient2" && (
        <EshProducts />
      )}
    </div>
  );
};

const AdminProducts = () => {
  const [activePatient, setActivePatient] = useState("patient1");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        activePatient={activePatient}
        setActivePatient={setActivePatient}
      />
      <main>
        <ProductDetail activePatient={activePatient} />
      </main>
    </div>
  );
};

export default AdminProducts;
