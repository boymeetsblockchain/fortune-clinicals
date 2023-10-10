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
  { to: '/admins/patients', title: 'Patient Dashboard', icon: AiOutlineUnorderedList, size: 32 },
  { to: '/', title: 'Home', icon: AiOutlineHome, size: 60 },
  { to: '/admins/profile', title: 'User Profile', icon: AiOutlineUser, size: 32 },
  { to: '/admins/products', title: 'Products', icon: AiOutlineShoppingCart, size: 32 },
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
    <div className="mx-auto hidden md:block px-4 md:px-8 lg:px-12 sticky z-10 top-0 left-0 h-auto shadow-md bg-[#FF5162]">
      <div className="flex items-center justify-center">
      <div className="flex justify-between items-center gap-x-8">
  {userRole === "isESH"
    ? eshLinks.map((link) => (
        <Link key={link.to} to={link.to} title={link.title}>
          {React.createElement(link.icon, {
            size: link.size,
            color: 'white',
            className: 'hover:scale-75',
          })}
        </Link>
      ))
    : userRole === "isAdmin" // Check if userRole is "isAdmin"
    ? adminLinks.map((link) => ( // Replace adminLinks with your actual admin links
        <Link key={link.to} to={link.to} title={link.title}>
          {React.createElement(link.icon, {
            size: link.size,
            color: 'white',
            className: 'hover:scale-75',
          })}
        </Link>
      ))
    : navLinks.map((link) => (
        <Link key={link.to} to={link.to} title={link.title}>
          {React.createElement(link.icon, {
            size: link.size,
            color: 'white',
            className: 'hover:scale-75',
          })}
        </Link>
      ))}
</div>

      </div>
    </div>
  );
}

export default Navbar;

;
