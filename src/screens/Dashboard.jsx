import React from 'react';
import GetUser from '../hooks/useGetUser';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineSetting, AiOutlineUnorderedList } from 'react-icons/ai';
import {BiMessageDetail}  from 'react-icons/bi'
import  {useUserRole,useUser} from '../hooks/useUser'
const menuItems = [
  { to: '/dashboard/patients', text: 'Click to view and edit Patient Data', icon: AiOutlineUnorderedList },
  { to: '/dashboard/products', text: 'Click to have access to available Products', icon: AiOutlineShoppingCart },
  { to: '/dashboard/profile', text: 'Click to access your details', icon: AiOutlineUser },
  { to: '/message', text: 'Click to send a Message', icon: BiMessageDetail },
 
];

const eshMenuItems= [
  { to: '/esh/patients', text: 'Click to view and edit Patient Data', icon: AiOutlineUnorderedList },
  { to: '/esh/products', text: 'Click to have access to available Products', icon: AiOutlineShoppingCart },
  { to: '/esh/profile', text: 'Click to access your details', icon: AiOutlineUser },
  { to: '/esh/about', text: 'Click to have access to monthly report', icon: AiOutlineSetting },
]

function Dashboard() {

  const currentUser=GetUser()
  const user = useUser();
  const userRole = useUserRole(user);
  return (
    <div className='flex items-center flex-col  justify-center h-screen px-4 md:px-8 lg:px-12'>
      <h1 className="text-center md:text-4xl text-2xl  mb-4 font-bold">Welcome, {currentUser? currentUser.displayName :""}</h1>
      <div className="grid  grid-cols-1 md:grid-cols-2  md:gap-6 gap-2">
        {
          userRole === "isESH" ? eshMenuItems.map((item, index) => (
            <Link key={index} to={item.to} className='bg-red-500 h-32 w-64 px-2 py-3 text-white text-center flex flex-row-reverse items-center justify-center rounded-md'>
              {item.text} <item.icon size={64} />
            </Link>
          )) :menuItems.map((item, index) => (
            <Link key={index} to={item.to} className='bg-red-500 h-32 w-64 px-2 py-3 text-white text-center flex flex-row-reverse items-center justify-center rounded-md'>
              {item.text} <item.icon size={64} />
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default Dashboard;
