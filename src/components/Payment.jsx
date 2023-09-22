import React, { useState, useEffect } from 'react';
import Input from './Input';
import { collection, where, query, getDocs, addDoc,doc,deleteDoc} from 'firebase/firestore';
import {ImBin} from 'react-icons/im'
import { db } from '../firebase.config';
import ComponentLoader from './ComponentLoader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function Payment({ patientId }) {
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [datePayed, setDatePayed] = useState('');
  

  const navigate = useNavigate()
  // Function to fetch payment details based on patientId
  const fetchPaymentDetails = async () => {
    try {
      const paymentsQuery = query(collection(db, 'patientspayments'), where('patientId', '==', patientId));
      const querySnapshot = await getDocs(paymentsQuery);

      // Use map to directly transform querySnapshot to an array of paymentDetails
      const paymentDetails =  querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      paymentDetails.sort((a, b) => {
        const dateA = new Date(a.datePayed);
        const dateB = new Date(b.datePayed);
        return dateB - dateA;
      });


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

      if(!comment || !amount || !datePayed){
        toast.error("Please fill in all details")
      }else{
        const data = await addDoc(collection(db, 'patientspayments'), paymentData);
        console.log('Payment added with ID:', data.id);
    
        // After adding a new payment, refetch the payment details to include the new one
        fetchPaymentDetails();
  
        // Clear the input fields
        setComment('');
        setAmount('');
        setDatePayed("")
        navigate(0)
      }
    
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const calculateTotalPayment = () => {
    if (!payments) return 0; // Handle case when payments is null
  
    // Calculate the total payment by summing up the amounts
    const totalPayment = payments.reduce((total, payment) => {
      const amount = parseFloat(payment.amount);
      return isNaN(amount) ? total : total + amount;
    }, 0);
  
    // Check if the result is NaN and return 0 if it is
    return isNaN(totalPayment) ? 0 : totalPayment;
  };
  

  const deletePayment = async (paymentId) => {
    try {
      // Delete the payment document from Firebase using its ID
      await deleteDoc(doc(db, 'patientspayments',paymentId));
      toast.success('Payment deleted successfully');
       
      // After deleting the payment, refetch the payment details to update the list
      fetchPaymentDetails();
    } catch (error) {
      console.error('Error deleting payment:', error);
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
        <div className="payment-info flex justify-between">
        <h1 className='text-center font-bold'>Payments Info </h1>
        <h1 className='text-center font-bold'>Total Payment:  &nbsp; <span className='text-green-400'>{calculateTotalPayment()}</span></h1>
        </div>
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
            <div key={payment.id} className="flex space-y-2 justify-between bg-white rounded-lg p-3 shadow-md mb-3">
              <div className="flex flex-col">
                <p className="text-gray-700 text-lg">Comment: {payment?.comment}</p>
                <p className="text-green-600 text-sm font-semibold">Amount: 	&#8358;{payment?.amount}</p>
                <p className="text-green-600 text-sm font-semibold">Date: {payment?.datePayed}</p>
              </div>
              <div className="delete">
                <ImBin size={24} color='red' className='cursor-pointer' onClick={()=>deletePayment(payment.id)}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Payment;
