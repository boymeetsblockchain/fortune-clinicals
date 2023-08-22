import React, { useState } from 'react'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Navbar from '../components/Navbar'
function Message() {
  const [name,setName]= useState("")
  const [email,setEmail]= useState("")
  const [number,setNumber]= useState("")
  const [message,setMessage]= useState("")
  return (
    <>
    <Navbar/>
    <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
      <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Send a Message </h1>
      <form className='flex flex-col space-y-4 justify-center w-full mx-auto'>
        <Input label={"name"} value={name} type={"text"}/>
        <Input label={"email"} value={email} type={"email"}/>
        <Input label={"number"} value={number} type={"number"}/>
        <Textarea label={"Write your message here"} value={message}/>
      </form>
    </div>
    </>
  )
}

export default Message  