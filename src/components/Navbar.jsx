import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineUnorderedList,
} from 'react-icons/ai';

function Navbar() {
  return (
    <>
      <div className="mx-auto hidden md:block  px-4 md:px-8 lg:px-12 sticky z-10 top-0 left-0 h-auto shadow-md  bg-[#FF5162]  ">
        <div className="flex items-center justify-center">
          <div className="flex jusitfy-between items-center gap-x-8">
            <Link to={'/message'} title="Messages">
              <AiOutlineMail size={32} color="white" className="hover:scale-75" />
            </Link>
            <Link to={'/dashboard/patients'} title="Patient Dashboard">
              <AiOutlineUnorderedList size={32} color="white" className="hover:scale-75" />
            </Link>
            <Link to={'/'} title="Home">
              <AiOutlineHome size={60} color="white" className="hover:scale-75" />
            </Link>
            <Link to={'/dashboard/profile'} title="User Profile">
              <AiOutlineUser size={32} color="white" className="hover:scale-75" />
            </Link>
            <Link to={'/dashboard/products'} title="Products">
              <AiOutlineShoppingCart size={32} color="white" className="hover:scale-75" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
