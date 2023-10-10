import React from 'react'
import Navbar from '../../components/Navbar'
import Input from '../../components/Input'
function AdminNotes() {
  return (
    <>
    <Navbar/>
    <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
      <h1 className='text-center my-6 font-bold  text-3xl  capitalize'>Save Notes </h1>
      <form className='flex flex-col space-y-4 justify-center w-full mx-auto'>
        
        <Input label={"Write your note here"}  type={"text"}/>
        <Input label={"Add the Date"}  type={"date"}/>
        <button className='bg-red-500 p-2  text-white  text-sm'>
          Send Note
        </button>
      </form>
    </div>
    </>
  )
}

export default AdminNotes