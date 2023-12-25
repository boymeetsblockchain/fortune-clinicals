import React from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineUnorderedList, } from 'react-icons/ai';
import {BiMessageDetail } from 'react-icons/bi'
const eshMenuItems= [
    { to: '/esh/patients', text: 'Click to view and edit Patient Data', icon: AiOutlineUnorderedList },
    { to: '/esh/products', text: 'Click to have access to available Products', icon: AiOutlineShoppingCart },
    { to: '/esh/profile', text: 'Click to access your details', icon: AiOutlineUser },
    { to: '/esh/message', text: 'Click to send a Message', icon:BiMessageDetail  },
  ]
function ESH() {
  return (
  <div className='flex items-center flex-col  justify-center h-screen px-4 md:px-8 lg:px-12'>
  <h1 className="text-center md:text-4xl text-2xl  mb-4 font-bold">Welcome, ESH</h1>
  <div className="grid  grid-cols-1 md:grid-cols-2  md:gap-6 gap-2">
  {
    eshMenuItems.map((item,index)=>(
      <Link key={index} to={item.to} className='bg-red-500 h-32 w-64 px-2 py-3 text-white text-center flex flex-row-reverse items-center justify-center rounded-md'>
              {item.text} <item.icon size={64} />
            </Link>
    ))
  }
  </div>
  </div>
  )
}

export default ESH