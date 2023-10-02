import React from 'react';
import Navbar from '../components/Navbar';
import {query,collection,getDocs} from 'firebase/firestore'
import { db } from '../firebase.config';
import { useState,useEffect } from 'react';

function Calendar() {
  // Array of month names
  const [payments,setPayments]= useState("")
  const [session,setSession]= useState("")
 
 
  const getPayment = async()=>{
    const paymentsQuery = query(collection(db, 'patientspayments'));
    const querySnapshot = await getDocs(paymentsQuery);

    // Use map to directly transform querySnapshot to an array of paymentDetails
    const paymentDetails =  querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPayments(paymentDetails)
    console.log(paymentDetails)
  }
  const getSession = async()=>{
    const paymentsQuery = query(collection(db, 'patientssessions'),);
    const querySnapshot = await getDocs(paymentsQuery);

    // Use map to directly transform querySnapshot to an array of paymentDetails
    const sessionDetails =  querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSession(sessionDetails)
    console.log(sessionDetails)
  }
  

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
  
  useEffect(()=>{
     getPayment()
     getSession()
  },[])
  const months = [
    {
      name: 'January',
      pay: ' ',
      ses: '',
    },
    {
      name: 'February',
      pay: ' ',
      ses: '' ,
    },
    {
      name: 'March',
      pay: ' ',
      ses: '',
    },
    {
      name: 'April',
      pay: ' ',
      ses: '' ,
    },
    {
      name: 'May',
      pay: ' ',
      ses: '' ,
    },
    {
      name: 'June',
      pay: ' ',
      ses: '',
    },
    {
      name: 'July',
      pay: ' ',
      ses: '',
    },
    {
      name: 'August',
      pay: ' ',
      ses: '',
    },
    {
      name: 'September',
      pay: payments.length,
      ses: session.length,
      total:calculateTotalPayment()
    },
    {
      name: 'October',
      pay: payments.length - 173,
      ses: session.length-279,
      total:calculateTotalPayment()-2671499
    },
    {
      name: 'November',
      pay: ' ',
      ses: ' ',
    },
    {
      name: 'December',
      pay: ' ',
      ses: ' ',
    },
  ];
  return (
    <>
      <Navbar />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5 ">
        <div className="flex items-center justify-center h-full">
          <div className="grid grid-cols-4 gap-4">
            {months.map((month, index) => (
              <div key={index}>
                <div className="bg-gray-200 h-32 w-64 flex items-center justify-center text-center p-4 rounded  flex-col shadow"> 
                  <h1 className='text-3xl font-bold'>{month.name}</h1>
                   <div className='flex gap-2'>
                   <span className='text-green-800 font-semibold'> session :{month.ses}</span>
                     <span className="text-red-800 font-semibold"> payments : {month.pay}</span>
                     <span className="text-red-800 font-semibold"> payments  {month.total}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
