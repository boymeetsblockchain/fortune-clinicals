import React, { useState } from 'react'
import AdminNav from "../components/AdminNav"
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
    const [price,setPrice]= useState(0)
    const [quantity,setQuantity]= useState(0)
    const [sold,setSold]= useState(0)
    const [used,setUsed]= useState(0)
    const [added,setAdded]= useState(0)

  

    const auth = getAuth()

    const addProduct = async (e) => {
      e.preventDefault();
    
      // Validate input fields as numbers
      const isNumeric = (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
      };
    
      if (
        !isNumeric(price) ||
        !isNumeric(quantity) ||
        !isNumeric(used) ||
        !isNumeric(added) ||
        !isNumeric(sold)
      ) {
        toast.error("Please enter valid numbers for Price, Quantity, Used, Added, and Sold.");
        return;
      }
    
      try {
        const formDataCopy = {
          name,
          price: parseFloat(price), // Convert to a number
          quantity: parseInt(quantity), // Convert to an integer
          sold: parseInt(sold), // Convert to an integer
          added: parseInt(added), // Convert to an integer
          used: parseInt(used), // Convert to an integer
          timestamp: serverTimestamp(),
          userId: auth?.currentUser?.uid,
        };
    
        const data = await addDoc(collection(db, 'products'), formDataCopy);
        console.log(data);
        toast.success("Product saved");
        navigate(-1);
      } catch (error) {
        console.log(error);
      }
    };
    
    
    // Add a new comment to the existing array of comments


      
  return (
    <>
    {/* <AdminNav/> */}
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
      <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Add new Product</h1>
         <form className='flex flex-col space-y-4 justify-center w-full mx-auto' onSubmit={addProduct}>
            <Input label="Product Name" type={"text"} value={name} onChange={(e)=>setName(e.target.value)}/>
            <Input label="Price" type={"number"} value={price} onChange={(e)=>setPrice(e.target.value)}/>
            <Input label="Quantity" type={"number"} value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
            <Input label="Used" type={"number"} value={used} onChange={(e)=>setUsed(e.target.value)}/>
            <Input label="Added" type={"number"} value={added} onChange={(e)=>setAdded(e.target.value)}/>
            <Input label="Sold" type={"number"} value={sold} onChange={(e)=>setSold(e.target.value)}/>
  
              
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