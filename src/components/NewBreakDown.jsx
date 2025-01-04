import React, { useMemo } from "react";
import useNewMonthData from "../hooks/useNewMonthData";
import { useParams, useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import Loader from "./Loader";

function BreakDown() {
  const { yearsData } = useNewMonthData();
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

  const handlePatientClick = (patientId) => {
    // Use the patientId to navigate to the appropriate patient dashboard
    navigate(`/admin/patient/${patientId}`);
  };

  // Mapping through the `dailyPayments` array
  const mappedPayments = selectedMonth.dailyPayments.map(
    (paymentsForDay, index) => {
      return {
        day: index + 1, // Day number
        payments: paymentsForDay.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          comment: payment.comment,
          patientId: payment.patientId,
          patientType: payment.patientType,
          datePayed: payment.datePayed,
        })),
      };
    }
  );

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {selectedMonth?.name} Daily Transactions
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-center">
          Total Payment for {selectedMonth?.name}: &#8358;
          {selectedMonth.totalPaymentsForMonth}
        </h1>

        {/* Loop through the mappedPayments array */}
        {mappedPayments.map((dayData) => (
          <div key={dayData.day} className="mb-4 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-2">{`Day ${dayData.day}`}</h2>
              <h2 className="text-xl font-semibold mb-2">{`Total Payment for today: ${dayData.payments.length}`}</h2>
            </div>
            <p className="text-lg mb-2 font-bold">
              Total Payment: &#8358;
              {dayData.payments.reduce(
                (total, payment) => total + parseFloat(payment.amount),
                0
              )}
            </p>
            <ul className="flex flex-col space-y-4">
              {dayData.payments.map((payment, index) => (
                <li
                  key={index}
                  className={`flex items-center py-3 justify-between mb-2 cursor-pointer ${
                    payment.patientType === "Home-Patient"
                      ? "bg-green-500"
                      : payment.patientType === "Hospital-Calls"
                      ? "bg-purple-500"
                      : payment.patientType === "Home-Patient-Admin"
                      ? "bg-yellow-500"
                      : payment.patientType === "Vip"
                      ? "bg-blue-500"
                      : "bg-[#ff5162]"
                  } text-white`}
                  onClick={() => handlePatientClick(payment.patientId)}
                >
                  <div className="flex justify-between">
                    <h1 className="ml-4 text-2xl">₦ {payment.amount}</h1>
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
