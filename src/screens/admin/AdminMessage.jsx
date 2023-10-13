import React from 'react';
import AdminNav from '../../components/AdminNav'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';

function AdminMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <AdminNav/>
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
        {/* Mapping out the messages */}
        {messages.map((data) => (
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
