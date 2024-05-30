import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import Loader from './Loader';
import useInitialReview from '../hooks/useEshInitial';

function InitialBreakDown() {
  const { filteredMonthsData } = useInitialReview();
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
    navigate(`/admin/patient/esh/${patientId}`);
  };

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5">
        <h1 className="text-2xl font-semibold mb-4 text-center">{selectedMonth?.name} Initial Reviews</h1>
        <h1 className='text-2xl font-bold mb-4 text-center'>Total Initial Reviews for {selectedMonth?.name}: {selectedMonth.rev}</h1>
        {selectedMonth.dailyReviews.map((dayData) => (
          <div key={dayData.day} className="mb-4 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{`Day ${dayData.day}`}</h2>
            <ul className='flex flex-col space-y-4'>
              {dayData.Reviews.map((patient, index) => (
                <li
                  key={index}
                  className="flex items-center py-3 justify-between mb-2 cursor-pointer bg-red-500 text-white"
                  onClick={() => handlePatientClick(patient.patientId)}
                >
                  <div className='flex justify-between'>
                    <h1 className="ml-4 text-2xl">&#8358; {patient?.comment}</h1>
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

export default InitialBreakDown;
