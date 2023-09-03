import React, { useState, useEffect } from 'react';
import Input from './Input';
import { collection, where, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import ComponentLoader from './ComponentLoader';

function Payment({ patientId }) {
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datePayed, setDatePayed] = useState('');

  // Function to fetch payment details based on patientId
  const fetchPaymentDetails = async () => {
    try {
      const paymentsQuery = query(collection(db, 'patientspayments'), where('patientId', '==', patientId));
      const querySnapshot = await getDocs(paymentsQuery);

      // Use map to directly transform querySnapshot to an array of paymentDetails
      const paymentDetails = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Update the payments state with fetched payment details
      setPayments(paymentDetails);
      setLoading(false);
      console.log(paymentDetails);
    } catch (error) {
      console.error('Error fetching payment details:', error);
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
      amount,
      patientId,
      datePayed,
    };

    try {
      const data = await addDoc(collection(db, 'patientspayments'), paymentData);
      console.log('Payment added with ID:', data.id);

      // After adding a new payment, refetch the payment details to include the new one
      fetchPaymentDetails();

      // Clear the input fields
      setComment('');
      setAmount('');
    } catch (error) {
      console.error('Error adding payment:', error);
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
        <h1 className='text-center font-bold'>Payments Info </h1>
      <form className='space-y-2 flex flex-col' onSubmit={addNewPayment}>
        <Input type={"text"} label={"Comment"} value={comment} onChange={(e) => setComment(e.target.value)} />
        <Input type={"number"} label={"Amount Paid"} value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input label={"Date Registered"} type={"date"} value={datePayed} onChange={(e) => setDatePayed(e.target.value)} />
        <button type="submit " className='bg-[#FF5162] text-white py-1.5'>Submit</button>
      </form>
      <div className="payment-details-container">
        <h1 className="text-xl font-semibold flex flex-col gap-3 mb-4 ">Completed Payments :{payments.length === 0 ? ("") :payments.length}</h1>
        <div className="payment-details">
          {payments.map((payment) => (
            <div key={payment.id} className="flex space-y-2 bg-white rounded-lg p-3 shadow-md mb-3">
              <div className="flex flex-col">
                <p className="text-gray-700 text-lg">Comment: {payment?.comment}</p>
                <p className="text-green-600 text-sm font-semibold">Amount: ${payment?.amount}</p>
                <p className="text-green-600 text-sm font-semibold">Date: ${payment?.datePayed}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Payment;
