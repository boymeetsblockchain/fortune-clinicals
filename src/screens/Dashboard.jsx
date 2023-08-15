import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineSetting, AiOutlineUnorderedList } from 'react-icons/ai';

const menuItems = [
  { to: '/dashboard/patients', text: 'Click to view and edit Patient Data', icon: AiOutlineUnorderedList },
  { to: '/dashboard/products', text: 'Click to have access to available Products', icon: AiOutlineShoppingCart },
  { to: '/dashboard/profile', text: 'Click to access your details', icon: AiOutlineUser },
  { to: '/dashboard/about', text: 'Click to know how to use', icon: AiOutlineSetting },
];

function Dashboard() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="grid grid-cols-2 gap-6">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.to} className='bg-red-500 h-32 w-64 px-2 py-3 text-white text-center flex flex-row-reverse items-center justify-center rounded-md'>
            {item.text} <item.icon size={64} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
