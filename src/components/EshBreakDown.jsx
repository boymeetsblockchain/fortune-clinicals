import React, { useMemo, useState, useEffect } from "react";
import useEshData from "../hooks/useEshData";
import { useParams, useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import Loader from "./Loader";
import { fetchFeeTable } from "../hooks/feeTables";

function EshBreakDown() {
  const { yearsData } = useEshData();
  const params = useParams();
  const navigate = useNavigate();

  const [inpatientFee, setInpatientFee] = useState(null);
  const [outpatientFee, setOutpatientFee] = useState(null);
  const [loading, setLoading] = useState(true);

  const { year, monthName } = params;

  useEffect(() => {
    async function loadFees() {
      try {
        const [inpatient, outpatient] = await Promise.all([
          fetchFeeTable("inpatientfee"),
          fetchFeeTable("outpatientfee"),
        ]);
        setInpatientFee(inpatient);
        setOutpatientFee(outpatient);
      } finally {
        setLoading(false);
      }
    }
    loadFees();
  }, []);

  const inpatientMultiplier = inpatientFee?.[0]?.fee || 2000;
  const outpatientMultiplier = outpatientFee?.[0]?.fee || 2000;

  // ✅ Hooks always run, even if data is missing
  const selectedYear = useMemo(
    () => yearsData.find((yearData) => yearData.year === year),
    [yearsData, year]
  );

  const selectedMonth = useMemo(
    () =>
      selectedYear?.monthsData?.find((month) => month.name === monthName) ||
      null,
    [selectedYear, monthName]
  );

  // ❌ Conditional return happens AFTER hooks
  if (loading || !inpatientFee || !outpatientFee || !selectedMonth) {
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
        <div className="flex justify-center gap-x-4 mb-2">
          <h2 className="text-xl font-bold text-center">
            Total In-patients: {totalInPatients}
          </h2>
          <h2 className="text-xl font-bold text-center">
            Total Out-patients: {totalOutPatients}
          </h2>
        </div>

        <div className="flex flex-col justify-center mb-2">
          <h2 className="text-xl font-bold text-center">
            Total In-patients Revenue Generated:
            {(totalInPatients * inpatientMultiplier).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </h2>
          <h2 className="text-xl font-bold text-center">
            Total Out-patients Revenue Generated:
            {(totalOutPatients * outpatientMultiplier).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </h2>
          <h2 className="text-2xl font-bold mt-4 text-center">
            General Total Revenue:
            <span className="ml-2">
              {(
                totalInPatients * inpatientMultiplier +
                totalOutPatients * outpatientMultiplier
              ).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </span>
          </h2>
        </div>

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
