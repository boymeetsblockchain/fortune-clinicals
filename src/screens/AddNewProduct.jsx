import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Input from '../components/Input'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { toast } from 'react-hot-toast'
import {getAuth} from 'firebase/auth'
import { addDoc,serverTimestamp,collection } from 'firebase/firestore'
import { db } from '../firebase.config'
import {  useNavigate } from 'react-router-dom'
function AddNewProduct() {

  const navigate =useNavigate()
    const [name,setName]= useState("")
    const [price,setPrice]= useState("")
    const [quantity,setQuantity]= useState("")
    const [sold,setSold]= useState("")
    const [used,setUsed]= useState("")
    const [added,setAdded]= useState("")
    const [comment,setComment]= useState("")
  

    const auth = getAuth()

    const addProduct = async (e) => {
      e.preventDefault();
      try {
        const formDataCopy = {
          name,
          price,
          quantity,
          sold,
          added,
          used,
          comment, // Initialize with an array containing the current comment
          timestamp: serverTimestamp(),
          userId: auth?.currentUser?.uid,

        };
      
        const data = await addDoc(collection(db, 'products'), formDataCopy);
        console.log(data);
        toast.success("Product saved");
        navigate('/dashboard/products');
      } catch (error) {
        console.log(error);
      }
    };
    // Add a new comment to the existing array of comments


      
  return (
    <>
    <Navbar/>
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
      <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Add new Product</h1>
         <form className='flex flex-col space-y-4 justify-center w-full mx-auto' onSubmit={addProduct}>
            <Input label="Product Name" type={"text"} value={name} onChange={(e)=>setName(e.target.value)}/>
            <Input label="Price" type={"number"} value={price} onChange={(e)=>setPrice(e.target.value)}/>
            <Input label="Quantity" type={"number"} value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
            <Input label="Used" type={"number"} value={used} onChange={(e)=>setUsed(e.target.value)}/>
            <Input label="Added" type={"number"} value={added} onChange={(e)=>setAdded(e.target.value)}/>
            <Input label="Sold" type={"number"} value={sold} onChange={(e)=>setSold(e.target.value)}/>
            <Input label="Comment" type={"text"} value={comment} onChange={(e)=>setComment(e.target.value)}/>
              
            <div className="flex justify-end">
                <button className="bg-[#FF5162] py-3 flex  items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition">
                 Add new Product <AiOutlineArrowRight/>
                </button>
              </div>
         </form>
       
      </div>
    </>
  )
}

export default AddNewProduct