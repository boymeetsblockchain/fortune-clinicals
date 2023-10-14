import React from 'react'
import Input from '../../components/Input'
import TextArea from '../../components/Textarea'
import EshNav from '../../components/EshNav'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { addDoc,collection } from 'firebase/firestore'
import { db } from '../../firebase.config'
function Message() {
   const [name,setName]= useState("")
   const [number,setNumber]= useState("")
   const[message,setMessage]=useState("")
   const[date,setDate]= useState("")
   const sendEmail = async(e) => {
    e.preventDefault();
    const formData= {
      name,
      number,
      message,
      date
    }

  try {
     if(!name || !message){
      toast.error("Please fill all Info")
     }else{
      const data = await addDoc(collection(db, 'messages'), formData);
      console.log(data)
      toast.success("Message Sent");
      setName("")
      setMessage("")
      setNumber("")
      setDate("")
     }
    
  } catch (error) {
     toast.error("something went wrong")
  }
  
  };


  return (
    <>
    <EshNav/>
    <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
      <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Send a Message </h1>
      <form className='flex flex-col space-y-4 justify-center w-full mx-auto' onSubmit={sendEmail}>
        <Input label={"name"} type={"text"} name={'name'} value={name} onChange={(e)=>setName(e.target.value)}/>
        
        <Input label={"number"}  type={"number"} name={"number"} value={number} onChange={(e)=>setNumber(e.target.value)} />
        <TextArea value={message} onChange={(e)=>setMessage(e.target.value)}>

        </TextArea>
        <Input label={"Date"} type={"date"} value={date} onChange={(e)=>setDate(e.target.value)}/>
        <button className='bg-red-500 p-2  text-white  text-sm'>
          Send Message 
        </button>
      </form>
    </div>
    </>
  )
}

export default Message  