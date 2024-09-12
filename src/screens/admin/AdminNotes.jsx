import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import Input from '../../components/Input';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import Loader from '../../components/Loader';
import { FaTrash } from 'react-icons/fa';

function AdminNotes() {
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [expandedNotes, setExpandedNotes] = useState({});
  
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

  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notesas', noteId));
      toast.success('Note deleted');
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const toggleNoteExpansion = (noteId) => {
    setExpandedNotes((prevExpandedNotes) => ({
      ...prevExpandedNotes,
      [noteId]: !prevExpandedNotes[noteId],
    }));
  };

  useEffect(() => {
    getNotes();
  }, [notes]);

  if (loading) {
    return <Loader />;
  }

  const filteredNotes = notes.filter((noteItem) => {
    const noteText = noteItem.note.toLowerCase();
    const query = searchQuery.toLowerCase();
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
          <button className="bg-[#FF5162] p-2 text-white text-sm hover:bg-[#e74b5b]" type="submit">
            Save Note
          </button>
        </form>

        <div className="notes-display mt-4 space-y-2">
          {filteredNotes.map((data) => {
            const isExpanded = expandedNotes[data.id];
            const notePreview = data.note.length > 100 && !isExpanded ? `${data.note.slice(0, 100)}...` : data.note;
            return (
              <div
                key={data.id}
                className="bg-[#FF5162] text-white p-4 flex gap-4 justify-between items-start rounded-lg"
              >
                <div className="flex-grow">
                  <p className="text-sm text-justify">{notePreview}</p>
                  {data.note.length > 100 && (
                    <button
                      className="text-xs text-blue-200 mt-2 underline"
                      onClick={() => toggleNoteExpansion(data.id)}
                    >
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                  <p className="text-xs mt-2">{data.date}</p>
                </div>
                <button
                  className="text-white  py-1 px-3 rounded-md hover:bg-red-600 text-xs"
                  onClick={() => deleteNote(data.id)}
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default AdminNotes;
