import React, { useState, useEffect } from 'react';
import Input from './Input';
import { collection, where, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import ComponentLoader from './ComponentLoader';

function Session({ patientId }) {
  const [comment, setComment] = useState('');
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');

  // Function to fetch session details based on patientId
  const fetchPaymentDetails = async () => {
    try {
      const paymentsQuery = query(collection(db, 'patientssessions'), where('patientId', '==', patientId));
      const querySnapshot = await getDocs(paymentsQuery);

      // Use map to directly transform querySnapshot to an array of paymentDetails
      const paymentDetails = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Sort the paymentDetails array by date in ascending order
      // paymentDetails.sort((a, b) => b.date.localeCompare(a.date));

      // Update the payments state with fetched session details
      setSessions(paymentDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  useEffect(() => {
    // Call the fetchPaymentDetails function when the component mounts or when patientId changes
    fetchPaymentDetails();
  }, [patientId]);

  const addNewPayment = async (e) => {
    e.preventDefault();

    const paymentData = {
      comment,
      patientId,
      date
    };

    try {
      const data = await addDoc(collection(db, 'patientssessions'), paymentData);
      console.log('Session added with ID:', data.id);

      // After adding a new session, refetch the session details to include the new one
      fetchPaymentDetails();

      // Clear the input fields
      setComment('');
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex item-center justify-center'>
        <ComponentLoader />
      </div>
    );
  }

  return (
    <div className='flex justify-center my-2 gap-y-3 flex-col px-3'>
      <h1 className='text-center font-bold'>Sessions Info</h1>
      <form className='space-y-2 flex flex-col' onSubmit={addNewPayment}>
        <Input type={"text"} label={"Comment"} value={comment} onChange={(e) => setComment(e.target.value)} />
        <Input label={"Date Registered"} type={"date"} value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" className='bg-[#FF5162] text-white py-1.5'>Submit</button>
      </form>
      <div className="session-details-container">
        <h1 className="text-xl font-semibold flex flex-col gap-3 mb-4">Completed Sessions :{sessions.length ===0 ?("") :sessions.length}</h1>
        <div className="session-details">
          {sessions.map((session) => (
            <div key={session.id} className="flex space-y-2 bg-white rounded-lg p-3 shadow-md mb-3">
              <div className="flex flex-col">
                <p className="text-gray-700 text-lg">Comment: {session?.comment}</p>
                <p className="text-green-600 text-sm font-semibold"> Date: {session?.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Session;