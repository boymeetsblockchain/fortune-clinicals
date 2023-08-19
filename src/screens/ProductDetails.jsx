import React from 'react'
import { products } from '../data'
import {MdAdd} from 'react-icons/md'

import {AiOutlineMinus} from 'react-icons/ai'
import Navbar from '../components/Navbar'
function ProductDetails() {
    console.log(products)
  return (
   <>
   <Navbar/>
   <div className="mx-auto max-w-screen-xl my-5 h-full md:overflow-y-hidden  w-full px-4 md:px-8 lg:px-12">
     {
        products.map((product)=>(
          <div className="flex justify-between px-4  items-center  shadow-md space-y-2 py-6">
            <h1 className="name text-2xl leading-6 text-center ">
                {product.name}
            </h1>
            
            <div className="icons flex gap-2 items-center p-2">
             <span><MdAdd size={20} color='green' className='cursor-pointer'/></span>
                <h2 className='text-xl'>{product.quantity}</h2>
               <span> <AiOutlineMinus size={20} color='red' className='cursor-pointer'/></span>
            </div>
          </div>
        ))
     }
   </div>
   </>
  )
}

export default ProductDetails