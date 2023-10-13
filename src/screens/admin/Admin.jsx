import React from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineUser,AiOutlineMessage, AiOutlineUnorderedList,AiTwotoneCalendar } from 'react-icons/ai';
import {BiMessageSquareCheck} from 'react-icons/bi'
const menuItems = [
  { to: '/admin/patients', text: 'Click to view and edit Patient Data', icon: AiOutlineUnorderedList },
  { to: '/admin/products', text: 'Click to have access to available Products', icon: AiOutlineShoppingCart },
  { to: '/admin/profile', text: 'Click to access your details', icon: AiOutlineUser },
  { to: '/admin/calender', text: 'Click to have access to monthly report', icon: AiTwotoneCalendar },
  { to: '/admin/messages', text: 'Click to have access to message ', icon: AiOutlineMessage },
  { to: '/admin/notes', text: 'Click to have  access to note ', icon:BiMessageSquareCheck },
  
];
function Admin() {
  return (
  <div className='flex items-center flex-col  justify-center h-screen px-4 md:px-8 lg:px-12'>
  <h1 className="text-center md:text-4xl text-2xl  mb-4 font-bold">Welcome, Admin</h1>
  <div className="grid  grid-cols-1 md:grid-cols-2  md:gap-6 gap-2">
  {
    menuItems.map((item,index)=>(
      <Link key={index} to={item.to} className='bg-red-500 h-32 w-64 px-2 py-3 text-white text-center flex flex-row-reverse items-center justify-center rounded-md'>
              {item.text} <item.icon size={64} />
            </Link>
    ))
  }
  </div>
  </div>
  )
}

export default Admin