import { useState, useEffect } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

const useNewMonthData = () => {
  const [payments, setPayments] = useState([]);
  const [sessions, setSessions] = useState([]);

  const getPayment = async () => {
    const paymentsQuery = query(collection(db, "newpayments"));
    const querySnapshot = await getDocs(paymentsQuery);
    const paymentDetails = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPayments(paymentDetails);
  };

  const getSession = async () => {
    const sessionsQuery = query(collection(db, "newsessions"));
    const querySnapshot = await getDocs(sessionsQuery);
    const sessionDetails = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSessions(sessionDetails);
  };

  useEffect(() => {
    getPayment();
    getSession();
  }, []);

  const calculateTotalPayment = (data) => {
    return data.reduce((total, payment) => {
      const amount = parseFloat(payment.amount);
      return isNaN(amount) ? total : total + amount;
    }, 0);
  };

  const months = [
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ];

  const yearsData = {};

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  // Process payments
  payments.forEach((payment) => {
    const paymentDate = new Date(payment.datePayed);

    if (!isValidDate(paymentDate)) return; // Skip invalid dates

    const year = paymentDate.getFullYear();

    // Filter years outside the range 2024-2027
    if (year < 2024 || year > 2080) return;

    const monthIndex = paymentDate.getMonth();

    if (!yearsData[year]) {
      yearsData[year] = months.map(() => ({
        pay: 0,
        ses: 0,
        dailyPayments: Array.from({ length: 31 }, () => []),
        totalPaymentsForMonth: 0,
      }));
    }

    const monthData = yearsData[year][monthIndex];
    if (monthData) {
      monthData.pay += 1;
      const day = paymentDate.getDate();
      monthData.dailyPayments[day - 1].push(payment);
    }
  });

  // Process sessions
  sessions.forEach((session) => {
    const sessionDate = new Date(session.date);

    if (!isValidDate(sessionDate)) return; // Skip invalid dates

    const year = sessionDate.getFullYear();

    const monthIndex = sessionDate.getMonth();

    if (!yearsData[year]) {
      yearsData[year] = months.map(() => ({
        pay: 0,
        ses: 0,
        dailyPayments: Array.from({ length: 31 }, () => []),
        totalPaymentsForMonth: 0,
      }));
    }

    const monthData = yearsData[year][monthIndex];
    if (monthData) {
      monthData.ses += 1;
    }
  });

  // Convert yearsData into an array
  const structuredYearsData = Object.entries(yearsData).map(
    ([year, monthsData]) => ({
      year,
      monthsData: monthsData.map((month, index) => {
        if (!months[index]) {
          console.error(`Month data missing for index ${index}`);
          return { name: "Unknown", ...month };
        }
        return {
          ...month,
          name: months[index].name,
          totalPaymentsForMonth: calculateTotalPayment(
            month.dailyPayments.flat()
          ),
        };
      }),
    })
  );

  return {
    yearsData: structuredYearsData,
  };
};

export default useNewMonthData;
