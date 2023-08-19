import React from 'react'
import { Link } from 'react-router-dom'
import {AiOutlineHome,AiOutlineShoppingCart,AiOutlineUser,AiOutlineMail,AiOutlineUnorderedList} from 'react-icons/ai'
function Navbar() {
  return (
     <>
     <div className="mx-auto hidden md:block  px-4 md:px-8 lg:px-12 sticky z-10 top-0 left-0 h-auto shadow-md  bg-[#FF5162]  ">
      <div className="flex items-center justify-center ">
        <div className="flex jusitfy-between items-center gap-x-8">
          <AiOutlineMail size={32} color='white' className='hover:scale-75'/>
          <Link to={'/dashboard/patients'}>
          <AiOutlineUnorderedList size={32} color='white'/>
          </Link>
          <Link to={'/'}>
          <AiOutlineHome size={60} color='white'/></Link>
           <Link to={'/dashboard/profile'}>
           
           <AiOutlineUser size={32} color='white'/></Link>
          <Link to={'/dashboard/products'}>
          <AiOutlineShoppingCart size={32} color='white'/>
          </Link>
        </div>
      </div>
     </div>
     </>
  )
}

export default Navbar