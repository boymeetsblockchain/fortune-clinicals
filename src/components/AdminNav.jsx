import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineUnorderedList,
  AiTwotoneCalendar
} from 'react-icons/ai';
import { BsFillGridFill } from 'react-icons/bs';


const adminLinks = [
  { to: '/admin/messages', title: 'Messages', icon: BsFillGridFill, size: 32 },
  { to: '/admin/patients', title: 'Patient Dashboard', icon: AiOutlineUnorderedList, size: 32 },
  { to: '/', title: 'Home', icon: AiOutlineHome, size: 60 },
  { to: '/admin/profile', title: 'User Profile', icon: AiOutlineUser, size: 32 },
  { to: '/admin/calender', title: 'Calender', icon: AiTwotoneCalendar, size: 32 },
];

function Navbar() {


  // Define the links to render based on the user's role
  
  return (
    <div className="mx-auto hidden md:block px-4 md:px-8 lg:px-12 sticky z-10 top-0 left-0 h-auto shadow-md bg-[#FF5162]">
      <div className="flex items-center justify-center">
        <div className="flex justify-between items-center gap-x-8">
          {adminLinks.map((link) => (
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
