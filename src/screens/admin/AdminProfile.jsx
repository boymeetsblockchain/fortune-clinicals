import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import {FaTrash} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import {
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import AdminNav from '../../components/AdminNav';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Loader from '../../components/Loader';
import Input from '../../components/Input';

function Profile() {
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const onLogOut = async () => {
    await auth.signOut();
    toast.success('Successfully logged out');
    navigate('/');
  }

  const saveNote = async (e) => {
    e.preventDefault();
    const noteCopy = {
      note,
      date,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
    };

    try {
      if (!note || !date) {
        toast.error('Please fill in both fields');
      } else {
        const data = await addDoc(collection(db, 'notes'), noteCopy);
        console.log(data);
        toast.success('Note saved');
        setNote('');
        setDate('');
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getNotes = async () => {
    try {
      const data = await getDocs(collection(db, 'notes'));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      setNotes(filteredData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getNotes();
  }, [])

  const filteredNotes = notes.filter((noteItem) => {
    const noteText = noteItem.note.toLowerCase();
    const query = searchQuery.toLowerCase();
    return noteText.includes(query);
  })

  const deleteNote = async (noteId) => {
    try {
      // Delete the note with the specified ID
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success('Note deleted');
      // Update the list of notes to reflect the deletion
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };
  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="header hidden md:flex items-center my-4 justify-between">
          <p className='text-2xl capitalize'>
            Signed in as <span className='ml-4 bg-[#ff5162] text-white p-2 rounded-md'> {auth?.currentUser?.displayName}</span>
          </p>
          <button className='text-xl capitalize bg-[#FF5162] p-2 text-white rounded-md'
            onClick={onLogOut}>
            Sign Out
          </button>
          <button onClick={() => navigate('/daily')} className='text-xl capitalize bg-[#FF5162] p-2 text-white rounded-md'>
            Daily Expenditures
          </button>
        </div>
        <div className="note my-8">
          <form onSubmit={saveNote}>
            <Input label="Add a note" type="text" value={note} onChange={e => setNote(e.target.value)} />
            <Input label="Pick a date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <div className="flex justify-end">
              <button className="bg-[#FF5162] py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/2 md:w-1/4 mt-4 hover:bg-red-700 transition">
                Add New Note <AiOutlineArrowRight />
              </button>
            </div>
          </form>
        </div>
        <div className="notes-display mt-4">
          <div className="flex justify-end">
            <Input
              type="text"
             label="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredNotes.map((data) => (
            <div key={data.id} className="bg-[#FF5162] text-white p-4 mb-2 flex justify-between  flex-wrap items-center rounded-lg">
              <p className="text-xs text-justify">{data.note}</p>
              <p className='text-xs text-justify'>{data.date}</p>
              <button
          className=" text-white py-1 px-3 rounded-md text-sm"
          onClick={() => deleteNote(data.id)}
        >
        <FaTrash/>
        </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Profile;
