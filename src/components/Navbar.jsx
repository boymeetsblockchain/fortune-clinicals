import React from 'react';
import { Link } from 'react-router-dom';
import { useUser,useUserRole } from '../hooks/useUser';
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineUnorderedList,
} from 'react-icons/ai';

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
function Navbar() {
  const user = useUser();
  const userRole = useUserRole(user);


  return (
    <div className="mx-auto hidden md:block px-4 md:px-8 lg:px-12 sticky z-10 top-0 left-0 h-auto shadow-md bg-[#FF5162]">
      <div className="flex items-center justify-center">
        <div className="flex justify-between items-center gap-x-8">
          {
            userRole ==="isESH" ? eshLinks.map((link, index) => (
              <Link key={index} to={link.to} title={link.title}>
                {React.createElement(link.icon, { size: link.size, color: 'white', className: 'hover:scale-75' })}
              </Link>
            )) :navLinks.map((link, index) => (
              <Link key={index} to={link.to} title={link.title}>
                {React.createElement(link.icon, { size: link.size, color: 'white', className: 'hover:scale-75' })}
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Navbar;
