import React, { useState } from 'react'
import EshNav from '../../components/EshNav'
import Input from '../../components/Input'
import { AiOutlineArrowRight, AiOutlineArrowLeft, AiOutlinePlus } from 'react-icons/ai'
import { toast } from 'react-hot-toast'
import { getAuth } from 'firebase/auth'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../../firebase.config'
import { useNavigate } from 'react-router-dom'

function AddNewProduct() {
  const navigate = useNavigate()
  const auth = getAuth()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [sold, setSold] = useState("0")
  const [used, setUsed] = useState("0")
  const [added, setAdded] = useState("0")
  const [comment, setComment] = useState("")
  const [date, setDate] = useState("")

  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      toast.error("Please fill in basic product details");
      return;
    }
    try {
      const formDataCopy = {
        name,
        price,
        quantity,
        sold,
        added,
        used,
        date,
        comment,
        timestamp: serverTimestamp(),
        userId: auth?.currentUser?.uid,
      };
    
      await addDoc(collection(db, 'eshgoods'), formDataCopy);
      toast.success("ESH Product Added");
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save product");
    }
  };
      
  return (
    <div className="min-h-screen bg-slate-50">
      <EshNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all group">
              <AiOutlineArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="text-center flex-1">
              <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>New ESH Product</h1>
              <p className="text-slate-500 font-medium text-sm">Add a new item to the ESH inventory</p>
            </div>
            <div className="w-12"></div>
          </div>

          <form className='space-y-8' onSubmit={addProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input label="Product Name" placeholder="e.g., ESH Branded Notebook" value={name} onChange={(e)=>setName(e.target.value)}/>
              </div>
              <Input label="Unit Price (₦)" type="number" placeholder="0.00" value={price} onChange={(e)=>setPrice(e.target.value)}/>
              <Input label="Initial Quantity" type="number" placeholder="0" value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
              
              <div className="md:col-span-2 pt-6 border-t border-slate-50">
                <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Initial Stock Status</h3>
                <div className="grid grid-cols-3 gap-6">
                  <Input label="Added" type="number" value={added} onChange={(e)=>setAdded(e.target.value)}/>
                  <Input label="Used" type="number" value={used} onChange={(e)=>setUsed(e.target.value)}/>
                  <Input label="Sold" type="number" value={sold} onChange={(e)=>setSold(e.target.value)}/>
                </div>
              </div>

              <div className="md:col-span-2">
                <Input label="Log Date" type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
              </div>
              <div className="md:col-span-2">
                <Input label="Internal Note" placeholder="Optional comments about this product" value={comment} onChange={(e)=>setComment(e.target.value)}/>
              </div>
            </div>
              
            <button 
              type="submit"
              className="w-full bg-emerald-500 py-5 flex items-center justify-center gap-3 text-white font-bold rounded-[1.5rem] shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-[0.98]"
            >
              <AiOutlinePlus /> Register Product <AiOutlineArrowRight />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddNewProduct