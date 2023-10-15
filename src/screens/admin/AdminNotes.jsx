import React from 'react';
import AdminNav from '../../components/AdminNav';
import Input from '../../components/Input';
import { useState, useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import Loader from '../../components/Loader';

function AdminNotes() {
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const navigate = useNavigate();

  const saveNote = async (e) => {
    e.preventDefault();

    try {
      if (!note || !date) {
        toast.error('Please fill in all fields');
      } else {
        const noteCopy = {
          note,
          date,
        };
        const data = await addDoc(collection(db, 'notesas'), noteCopy);
        console.log(data);
        toast.success('Note saved');
        setNote('');
        setDate('');
        navigate(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNotes = async () => {
    try {
      const data = await getDocs(collection(db, 'notesas'));
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
  };

  useEffect(() => {
    getNotes();
  }, [notes]);

  if (loading) {
    return <Loader />;
  }
  const filteredNotes = notes.filter((noteItem) => {
    // Convert both the note and the search query to lowercase for a case-insensitive search
    const noteText = noteItem.note.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    // Check if the note contains the search query
    return noteText.includes(query);
  });
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
      <div className="flex justify-end">
      <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none mb"
        />
      </div>
        <h1 className="text-center my-6 font-bold text-3xl capitalize">Save Notes</h1>
        <form className="flex flex-col space-y-4 justify-center w-full mx-auto" onSubmit={saveNote}>
          <Input label="Write your note here" type="text" value={note} onChange={(e) => setNote(e.target.value)} />
          <Input label="Add the Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="bg-[#FF5162] p-2 text-white text-sm" type="submit">
            Save Note
          </button>
        </form>
        <div className="notes-display mt-4">
          {filteredNotes.map((data) => (
            <div key={data.id} className="bg-[#FF5162] text-white p-4 mb-2 flex justify-between items-center rounded-lg">
              <p className="text-sm">{data.note}</p>
              <p className="text-sm">{data.date}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminNotes;
 