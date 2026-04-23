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
    <div className='min-h-screen bg-slate-50 flex items-center flex-col justify-center px-4 md:px-8 lg:px-12 py-12'>
      <div className="max-w-4xl w-full">
        <h1 className="text-center text-3xl md:text-5xl mb-12 font-extrabold text-slate-900 tracking-tight">
          Welcome, <span className="text-[#FF5162]">{currentUser ? currentUser.displayName : "User"}</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {(userRole === "isESH" ? eshMenuItems : menuItems).map((item, index) => (
            <Link 
              key={index} 
              to={item.to} 
              className='group bg-white h-40 p-6 flex items-center justify-between rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-red-100 transition-all duration-300 hover:-translate-y-1'
            >
              <div className="flex-1 pr-4">
                <p className="text-slate-800 font-semibold text-lg leading-tight group-hover:text-[#FF5162] transition-colors duration-300">
                  {item.text}
                </p>
              </div>
              <div className="bg-[#FF5162]/5 p-4 rounded-2xl group-hover:bg-[#FF5162] transition-all duration-300">
                <item.icon size={48} className="text-[#FF5162] group-hover:text-white transition-colors duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


export default Dashboard;
