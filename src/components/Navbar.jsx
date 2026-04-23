import React from 'react';
import { Link } from 'react-router-dom';
import { useUser,useUserRole } from '../hooks/useUser';
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineUnorderedList,
  AiTwotoneCalendar
} from 'react-icons/ai';
import {BsFillGridFill} from 'react-icons/bs'

const navLinks = [
  { to: '/message', title: 'Messages', icon: AiOutlineMail, size: 32 },
  { to: '/dashboard/patients', title: 'Patient Dashboard', icon: AiOutlineUnorderedList, size: 32 },
  { to: '/', title: 'Home', icon: AiOutlineHome, size: 60 },
  { to: '/dashboard/profile', title: 'User Profile', icon: AiOutlineUser, size: 32 },
  { to: '/dashboard/products', title: 'Products', icon: AiOutlineShoppingCart, size: 32 },
];

const eshLinks = [
  { to: '/message', title: 'Messages', icon: AiOutlineMail, size: 32 },
  { to: '/esh/patients', title: 'Patient Dashboard', icon: AiOutlineUnorderedList, size: 32 },
  { to: '/', title: 'Home', icon: AiOutlineHome, size: 60 },
  { to: '/esh/profile', title: 'User Profile', icon: AiOutlineUser, size: 32 },
  { to: '/esh/products', title: 'Products', icon: AiOutlineShoppingCart, size: 32 },
];

const adminLinks = [
  { to: '/admin/message', title: 'Messages', icon: BsFillGridFill, size: 32 },
  { to: '/admin/patients', title: 'Patient Dashboard', icon: AiOutlineUnorderedList, size: 32 },
  { to: '/', title: 'Home', icon: AiOutlineHome, size: 60 },
  { to: '/admin/profile', title: 'User Profile', icon: AiOutlineUser, size: 32 },
  { to: '/admin/calender', title: 'Products', icon: AiTwotoneCalendar, size: 32 },
];
function Navbar() {
  const user = useUser();
  const userRole = useUserRole(user);

  return (
    <div className="mx-auto hidden md:block px-4 md:px-8 lg:px-12 sticky z-30 top-0 left-0 h-auto shadow-sm backdrop-blur-md bg-[#FF5162]/95 border-b border-white/10">
      <div className="flex items-center justify-center py-2">
        <div className="flex justify-between items-center gap-x-12">
          {(userRole === "isESH" ? eshLinks : userRole === "isAdmin" ? adminLinks : navLinks).map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              title={link.title}
              className="relative group py-2"
            >
              {React.createElement(link.icon, {
                size: link.size,
                color: 'white',
                className: 'transition-all duration-300 group-hover:scale-110 group-active:scale-90',
              })}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full opacity-50"></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


export default Navbar;

;
