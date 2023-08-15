import React from 'react'
import { Link } from 'react-router-dom'
import {AiOutlineHome,AiOutlineShoppingCart,AiOutlineUser,AiOutlineMail,AiOutlineUnorderedList} from 'react-icons/ai'
function Navbar() {
  return (
     <>
     <div className="mx-auto hidden md:block px-4 md:px-8 lg:px-12 sticky top-0 left-0 h-auto bg-[#FF5162]  ">
      <div className="flex items-center justify-center ">
        <div className="flex jusitfy-between items-center gap-x-8">
          <AiOutlineMail size={32} color='white' className='hover:scale-75'/>
          <AiOutlineUnorderedList size={32} color='white'/>
          <Link to={'/'}>
          <AiOutlineHome size={60} color='white'/></Link>
          <AiOutlineUser size={32} color='white'/>
          <AiOutlineShoppingCart size={32} color='white'/>
        </div>
      </div>
     </div>
     </>
  )
}

export default Navbar