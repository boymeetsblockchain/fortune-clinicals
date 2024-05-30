import React from 'react';
import useEshData from "../hooks/useEshData";
import { useParams } from 'react-router-dom';
import AdminNav from './AdminNav';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

function EshBreakDown() {
  const { filteredMonthsData } = useEshData();
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

  // Calculate total in-patients and out-patients for the month
  const totalInPatients = selectedMonth.dailySessions.reduce((total, day) => total + day.inPatients.length, 0);
  const totalOutPatients = selectedMonth.dailySessions.reduce((total, day) => total + day.outPatients.length, 0);

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5">
        <h1 className="text-2xl font-semibold mb-4 text-center">{selectedMonth?.name} Daily Sessions</h1>
        <h1 className='text-2xl font-bold mb-4 text-center'>Total Sessions for {selectedMonth?.name}: {selectedMonth.ses}</h1>
        <h2 className='text-xl font-bold mb-4 text-center'>Total In-patients: {totalInPatients}</h2>
        <h2 className='text-xl font-bold mb-4 text-center'>Total Out-patients: {totalOutPatients}</h2>
        
        {selectedMonth.dailySessions.map((dayData) => (
          <div key={dayData.day} className="mb-4 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{`Day ${dayData.day}`}</h2>
            
            <div>
              <h3 className="text-lg font-semibold">In-patients ({dayData.inPatients.length})</h3>
              <ul className='flex flex-col space-y-4 mb-4'>
                {dayData.inPatients.map((patient, index) => (
                  <li
                    key={index}
                    className="flex items-center py-3 justify-between mb-2 cursor-pointer bg-[#ff5162] text-white"
                    onClick={() => handlePatientClick(patient.patientId)}
                  >
                    <div className='flex justify-between'>
                      <h1 className="ml-4 text-2xl">&#8358; {patient?.comment}</h1>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Out-patients ({dayData.outPatients.length})</h3>
              <ul className='flex flex-col space-y-4'>
                {dayData.outPatients.map((patient, index) => (
                  <li
                    key={index}
                    className="flex items-center py-3 justify-between mb-2 cursor-pointer bg-green-500 text-white"
                    onClick={() => handlePatientClick(patient.patientId)}
                  >
                    <div className='flex justify-between'>
                      <h1 className="ml-4 text-2xl">&#8358; {patient?.comment}</h1>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default EshBreakDown;
