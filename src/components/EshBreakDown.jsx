import React, { useMemo } from "react";
import useEshData from "../hooks/useEshData";
import { useParams, useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import Loader from "./Loader";

function EshBreakDown() {
  const { yearsData } = useEshData();
  const params = useParams();
  const { year, monthName } = params;
  const navigate = useNavigate();

  // Find the year data
  const selectedYear = useMemo(
    () => yearsData.find((yearData) => yearData.year === year),
    [yearsData, year]
  );

  // Find the month data within the selected year
  const selectedMonth = useMemo(
    () =>
      selectedYear
        ? selectedYear.monthsData.find((month) => month.name === monthName)
        : null,
    [selectedYear, monthName]
  );

  if (!selectedMonth) {
    return <Loader />;
  }

  const dailySessionsWithFilteredPatients = selectedMonth.dailySessions.map(
    (dayData) => {
      const inPatients = dayData.sessions.filter(
        (patient) => patient.patientType === "In-patient"
      );
      const outPatients = dayData.sessions.filter(
        (patient) => patient.patientType === "Out-patient"
      );
      return { ...dayData, inPatients, outPatients };
    }
  );

  const totalInPatients = dailySessionsWithFilteredPatients.reduce(
    (total, dayData) => total + dayData.inPatients.length,
    0
  );

  const totalOutPatients = dailySessionsWithFilteredPatients.reduce(
    (total, dayData) => total + dayData.outPatients.length,
    0
  );

  const handlePatientClick = (patientId) => {
    navigate(`/admin/patient/esh/${patientId}`);
  };

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {selectedMonth?.name} Daily Sessions ({year})
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-center">
          Total Sessions for {selectedMonth?.name}: {selectedMonth.ses}
        </h1>
        <h2 className="text-xl font-bold mb-4 text-center">
          Total In-patients: {totalInPatients}
        </h2>
        <h2 className="text-xl font-bold mb-4 text-center">
          Total Out-patients: {totalOutPatients}
        </h2>

        {dailySessionsWithFilteredPatients.map((dayData) => (
          <div key={dayData.day} className="mb-4 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{`Day ${dayData.day}`}</h2>

            <div>
              <h3 className="text-lg font-semibold">
                In-patients ({dayData.inPatients.length})
              </h3>
              {dayData.inPatients.length > 0 ? (
                <ul className="flex flex-col space-y-4 mb-4">
                  {dayData.inPatients.map((patient, index) => (
                    <li
                      key={index}
                      className="flex items-center py-3 justify-between mb-2 cursor-pointer bg-[#ff5162] text-white"
                      onClick={() => handlePatientClick(patient.patientId)}
                    >
                      <div className="flex justify-between">
                        <h1 className="ml-4 text-2xl">
                          &#8358; {patient?.comment}
                        </h1>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No in-patients for this day.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Out-patients ({dayData.outPatients.length})
              </h3>
              {dayData.outPatients.length > 0 ? (
                <ul className="flex flex-col space-y-4">
                  {dayData.outPatients.map((patient, index) => (
                    <li
                      key={index}
                      className="flex items-center py-3 justify-between mb-2 cursor-pointer bg-green-500 text-white"
                      onClick={() => handlePatientClick(patient.patientId)}
                    >
                      <div className="flex justify-between">
                        <h1 className="ml-4 text-2xl">
                          &#8358; {patient?.comment}
                        </h1>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No out-patients for this day.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default EshBreakDown;
