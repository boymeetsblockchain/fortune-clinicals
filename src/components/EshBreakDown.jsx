import React from 'react';
import useEshData from "../hooks/useEshData";
import { useParams, useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import Loader from './Loader';

function EshBreakDown() {
  const { filteredMonthsData } = useEshData();
  const params = useParams();
  const { monthName } = params;
  const navigate = useNavigate();

  // Find the month data that matches the route parameter (month name)
  const selectedMonth = filteredMonthsData.find((month) => month.name === monthName);
  console.log(selectedMonth)
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
        <h1 className="text-2xl font-semibold mb-4 text-center">{selectedMonth?.name} Daily Sessions</h1>
        <h1 className='text-2xl font-bold mb-4 text-center'>Total Sessions for {selectedMonth?.name}: {selectedMonth.ses}</h1>
        
        {selectedMonth.dailySessions.map((dayData) => {
          // Separate in-patients and out-patients
          const inPatients = dayData.sessions.filter(patient => patient.patientType === 'In-patient');
          const outPatients = dayData.sessions.filter(patient => patient.patientType === 'Out-patient');
          
          return (
            <div key={dayData.day} className="mb-4 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{`Day ${dayData.day}`}</h2>
              
              <div>
                <h3 className="text-lg font-semibold">In-patients ({inPatients.length})</h3>
                {inPatients.length > 0 ? (
                  <ul className='flex flex-col space-y-4 mb-4'>
                    {inPatients.map((patient, index) => (
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
                ) : (
                  <p>No in-patients for this day.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold">Out-patients ({outPatients.length})</h3>
                {outPatients.length > 0 ? (
                  <ul className='flex flex-col space-y-4'>
                    {outPatients.map((patient, index) => (
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
                ) : (
                  <p>No out-patients for this day.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default EshBreakDown;
