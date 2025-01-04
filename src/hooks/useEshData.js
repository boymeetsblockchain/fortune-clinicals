import { useState, useEffect } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

const useEshData = () => {
  const [sessions, setSessions] = useState([]);

  const getSession = async () => {
    const sessionsQuery = query(collection(db, "eshsessions"));
    const querySnapshot = await getDocs(sessionsQuery);
    const sessionDetails = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSessions(sessionDetails);
  };

  useEffect(() => {
    getSession();
  }, []);

  const calculateTotalSessions = () => sessions.length;

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

  // Group sessions by year and month
  const yearsData = sessions.reduce((acc, session) => {
    const sessionDate = new Date(session.date);
    const year = sessionDate.getFullYear();
    const monthIndex = sessionDate.getMonth();
    const day = sessionDate.getDate();

    if (!acc[year]) {
      acc[year] = months.map((month, index) => ({
        name: month.name,
        ses: 0,
        dailySessions: Array.from({ length: 31 }, () => ({
          day: null,
          sessions: [],
          inPatients: [],
          outPatients: [],
        })),
      }));
    }

    const monthData = acc[year][monthIndex];
    monthData.ses += 1;

    const daySessions = monthData.dailySessions[day - 1];
    daySessions.day = day;
    daySessions.sessions.push(session);

    if (session.patientType === "In-patient") {
      daySessions.inPatients.push(session);
    } else if (session.patientType === "Out-patient") {
      daySessions.outPatients.push(session);
    }

    return acc;
  }, {});

  // Convert yearsData object into an array
  const structuredYearsData = Object.entries(yearsData).map(
    ([year, monthsData]) => ({
      year,
      monthsData: monthsData.filter((month) => month.ses > 0),
    })
  );

  return {
    yearsData: structuredYearsData,
  };
};

export default useEshData;
