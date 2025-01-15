import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import Loader from "./Loader";
import useInitialReview from "../hooks/useEshInitial";

function InitialBreakDown() {
  const { yearsData } = useInitialReview(); // Use the hook to fetch data
  const { year, monthName } = useParams(); // Get year and month from URL params
  const navigate = useNavigate();

  // Ensure yearsData exists before trying to access it
  if (!yearsData || yearsData.length === 0) {
    return <Loader />;
  }

  // Safely find the year and month data
  const selectedYear = yearsData.find((yearData) => yearData.year === year);
  const selectedMonth = selectedYear?.monthsData.find(
    (month) => month.name === monthName
  );

  if (!selectedMonth) {
    return (
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5">
        <h1 className="text-center text-xl text-red-500 font-bold">
          No data available for {monthName} {year}.
        </h1>
      </div>
    );
  }

  const handlePatientClick = (patientId) => {
    // Use the patientId to navigate to the appropriate patient dashboard
    navigate(`/admin/patient/esh/${patientId}`);
  };

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {selectedMonth?.name} {year} Initial Reviews
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-center">
          Total Initial Reviews for {selectedMonth?.name}: {selectedMonth.rev}
        </h1>
        {selectedMonth.dailyReviews.map((dayData) => (
          <div
            key={dayData.day}
            className="mb-4 p-4 rounded-lg bg-gray-100 shadow"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-2">{`Day ${dayData.day}`}</h2>
              <h2 className="text-xl font-semibold mb-2">{`Total Initial Review for the day: ${dayData.reviews.length} `}</h2>
            </div>
            {dayData.reviews.length > 0 ? (
              <ul className="flex flex-col space-y-4">
                {dayData.reviews.map((patient, index) => (
                  <li
                    key={index}
                    className="flex items-center py-3 justify-between mb-2 cursor-pointer bg-red-500 text-white rounded-lg shadow-md"
                    onClick={() => handlePatientClick(patient.patientId)}
                  >
                    <div className="flex justify-between items-center">
                      <h1 className="ml-4 text-lg">
                        &#8358; {patient?.comment}
                      </h1>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">
                No initial reviews for the day.
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default InitialBreakDown;
