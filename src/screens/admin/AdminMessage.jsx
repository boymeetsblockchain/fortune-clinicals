import React from 'react';
import AdminNav from '../../components/AdminNav'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';

function AdminMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const getMessages = async () => {
    try {
      const data = await getDocs(collection(db, 'messages'));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      setMessages(filteredData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMessages();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const filteredNotes = messages.filter((noteItem) => {
    // Convert both the note and the search query to lowercase for a case-insensitive search
    const noteText = noteItem.message.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    // Check if the note contains the search query
    return noteText.includes(query);
  });
  return (
    <>
      <AdminNav/>
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
        {/* Mapping out the messages */}
        {filteredNotes.map((data) => (
    <div key={data.id} className="bg-[#FF5162] text-white p-4 mb-2 flex justify-between items-center rounded-lg">
      <p className="text-sm">{data.name}   {""}{data.number}</p>
      <p className='text-sm'>{data.message}</p>
      <p className="text-sm">{data.date}</p>
    </div>
  ))}
      </div>
    </>
  );
}

export default AdminMessage;
