import { useState, useEffect } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

const useEshData = () => {
  const [sessions, setSessions] = useState([]);
  const [patientMap, setPatientMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch both sessions and patients to resolve "esh" type sessions
      const sessionsQuery = query(collection(db, "eshsessions"));
      const patientsQuery = query(collection(db, "eshpatients"));
      
      const [sessionsSnap, patientsSnap] = await Promise.all([
        getDocs(sessionsQuery),
        getDocs(patientsQuery)
      ]);

      // Create a map of patientId -> patientType
      const pMap = {};
      patientsSnap.docs.forEach(doc => {
        const data = doc.data();
        pMap[doc.id] = data.selectedValue; // "In-patient" or "Out-patient"
      });
      setPatientMap(pMap);

      const sessionDetails = sessionsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(sessionDetails);
    } catch (error) {
      console.error("Error fetching ESH data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      acc[year] = months.map((month) => ({
        name: month.name,
        ses: 0,
        dailySessions: Array.from({ length: 31 }, (_, i) => ({
          day: i + 1,
          sessions: [],
          inPatients: [],
          outPatients: [],
        })),
      }));
    }

    const monthData = acc[year][monthIndex];
    if (monthData) {
      monthData.ses += 1;
      const daySessions = monthData.dailySessions[day - 1];
      if (daySessions) {
        // Resolve patient type: use session data if specific, else fallback to patient document
        const resolvedType = (session.patientType === "In-patient" || session.patientType === "Out-patient")
          ? session.patientType
          : patientMap[session.patientId];

        // Enrich session with resolved type for the view
        const enrichedSession = { ...session, patientType: resolvedType };
        
        daySessions.sessions.push(enrichedSession);
        
        if (resolvedType === "In-patient") {
          daySessions.inPatients.push(enrichedSession);
        } else if (resolvedType === "Out-patient") {
          daySessions.outPatients.push(enrichedSession);
        }
      }
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
    loading
  };
};

export default useEshData;
