import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineUnorderedList } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import EshNav from '../../components/EshNav';

const eshMenuItems = [
  {
    to: '/esh/patients',
    text: 'Patient Directory',
    subtext: 'Manage ESH patient records',
    icon: AiOutlineUnorderedList,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    to: '/esh/products',
    text: 'ESH Inventory',
    subtext: 'Track available ESH products',
    icon: AiOutlineShoppingCart,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    to: '/esh/profile',
    text: 'My Profile',
    subtext: 'Access your account details',
    icon: AiOutlineUser,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    to: '/esh/message',
    text: 'Communications',
    subtext: 'Send and receive messages',
    icon: BiMessageDetail,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
];

function ESH() {
  return (
    <div className="min-h-screen bg-slate-50">
      <EshNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <AiOutlineUnorderedList className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              ESH Portal
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl">
            Welcome to the ESH Clinical Management System. Streamlined tools for patient data and inventory tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eshMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-200/30 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start gap-6"
            >
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} transition-colors group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-100`}>
                <item.icon size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {item.text}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {item.subtext}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ESH;