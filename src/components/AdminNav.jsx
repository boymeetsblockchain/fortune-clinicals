import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineUnorderedList,
  AiTwotoneCalendar,
  AiOutlineMessage
} from 'react-icons/ai';
import { BsFillGridFill } from 'react-icons/bs';

const adminLinks = [
  { to: '/admin', title: 'Dashboard', icon: BsFillGridFill },
  { to: '/admin/messages', title: 'Messages', icon: AiOutlineMessage },
  { to: '/admin/patients', title: 'Patients', icon: AiOutlineUnorderedList },
  { to: '/', title: 'Main App', icon: AiOutlineHome },
  { to: '/admin/profile', title: 'Profile', icon: AiOutlineUser },
  { to: '/admin/calender', title: 'Reports', icon: AiTwotoneCalendar },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF5162] rounded-lg flex items-center justify-center shadow-lg shadow-red-100">
              <BsFillGridFill className="text-white" size={16} />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">Fortune Admin</span>
          </div>

          <div className="flex items-center gap-1">
            {adminLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  title={link.title}
                  className={`p-3 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-[#FF5162]/5 text-[#FF5162]' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <link.icon size={22} className={isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF5162] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
