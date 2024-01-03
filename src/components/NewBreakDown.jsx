import React from 'react';
import useNewMonthData from '../hooks/useNewMonthData';
import { useParams } from 'react-router-dom';
import AdminNav from './AdminNav';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

function BreakDown({ match }) {
  const { filteredMonthsData } = useNewMonthData();
  const params = useParams();
  const { monthName } = params;
  const navigate = useNavigate();

  // Find the month data that matches the route parameter (month name)
  const selectedMonth = filteredMonthsData.find((month) => month.name === monthName);

  if (!selectedMonth) {
    return <Loader />;
  }

  const handlePatientClick = (patientId) => {
    // Use the patientId to navigate to the appropriate patient dashboard
    navigate(`/admin/patient/${patientId}`);
  };

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5">
        <h1 className="text-2xl font-semibold mb-4 text-center">{selectedMonth?.name} Daily Transactions</h1>
        <h1 className='text-2xl font-bold mb-4 text-center'> Total Payment for {selectedMonth?.name}: {""} &#8358;{selectedMonth.totalPaymentsForMonth}</h1>
        {selectedMonth.dailyPayments.map((dayData) => (
            
          <div key={dayData.day} className="mb-4 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{`Day ${dayData.day}`}</h2>
            <p className="text-lg mb-2 font-bold ">Total Payment: &#8358;{dayData.payments.reduce((total, payment) => total + parseFloat(payment.amount), 0)}</p>
            <ul className='flex flex-col space-y-4 '>
              {dayData.payments.map((payment, index) => (
               <li
               key={index}
               className={`flex items-center py-3 justify-between mb-2 cursor-pointer ${
                 payment.patientType === "Home-Patient"
                 ? 'bg-green-500' : payment.patientType ==="Hospital-Calls" ? "bg-purple-500" :payment.patientType==="Home-Patient-Admin"? "bg-blue-500" : "bg-[#ff5162]"
               } text-white`}
               onClick={() => handlePatientClick(payment.patientId)}
             >
               <div className='flex justify-between'>
                 <h1 className="ml-4 text-2xl">&#8358; {payment.amount}</h1>
               </div>
             </li>
             
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default BreakDown;
