import React, { useEffect, useState } from 'react'
import {getAuth} from 'firebase/auth'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { addDoc,serverTimestamp,collection,getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'
import Navbar from '../components/Navbar'
import { AiOutlineArrowRight } from 'react-icons/ai'
import Loader from '../components/Loader'
import Input from '../components/Input'
function Profile() {
  const[note,setNote]= useState("")
  const[date,setDate]= useState("")
  const[notes,setNotes]= useState([])
  const [loading, setLoading] = useState(true);
  const navigate =useNavigate()
  const auth= getAuth()
  

  const onLogOut = async()=>{
      await auth.signOut()
      toast.success("successfully loggedout")
      navigate('/auth')
  }

  const saveNote = async(e)=>{
    e.preventDefault();
    const noteCopy= {note,
      date,
    timestamp:serverTimestamp(),
  userId:auth.currentUser.uid}
    
  try {
    const data = await addDoc(collection(db, 'notes'), noteCopy);

    console.log(data);
    toast.success("Note saved");
    setNote("")
    navigate(0)
  } catch (error) {
    console.log(error)
  }

  }

  const getNotes = async(e)=>{
    try {
      const data = await getDocs(collection(db, 'notes'));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      filteredData.sort((a, b) => b.date.localeCompare(a.date));

      setNotes(filteredData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
   getNotes()
   console.log(notes)
  },[])


  if(loading){
    return(
      <Loader/>
    )
  }
  return (
   <>
    <Navbar/>
  <div className='h-full w-full flex md:flex-col max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12'>
    <div className="header flex items-center my-4 justify-between">
      <p className='text-2xl capitalize'>Signed in  as <span className='ml-4 bg-[#ff5162] text-white p-2 rounded-md'> {auth?.currentUser?.displayName}</span></p>
       <button className='text-xl capitalize bg-[#FF5162] p-2 text-white rounded-md' 
       onClick={onLogOut}>signOut</button>
    </div>
     <div className="note my-8">
      <form  onSubmit={saveNote}> 
        <Input label={"Add a note "} type={"text"} value={note} onChange={e=>setNote(e.target.value)}/>
        <Input label={"pick a date"} type={"date"} value={date} onChange={e=>setDate(e.target.value)}/>
       <div className="flex justify-end">
       <button className="bg-[#FF5162] py-3 flex  items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition">
                 Add new Note <AiOutlineArrowRight/>
                </button>
       </div>
      </form>
     </div>
     <div className="notes-display mt-4">
  {notes.map((data) => (
    <div key={data.id} className="bg-[#FF5162] text-white p-4 mb-2 flex justify-between items-center rounded-lg">
      <p className="text-sm">{data.note}</p>
      <p className='text-sm'>{data.date}</p>
    </div>
  ))}
</div>

    </div>
   </>
  )
}

export default Profile