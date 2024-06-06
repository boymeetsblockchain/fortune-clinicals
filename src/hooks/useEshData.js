import { useState, useEffect } from 'react';
import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

const useEshData = () => {
  const [sessions, setSessions] = useState([]);

  const getSession = async () => {
    const sessionsQuery = query(collection(db, 'eshsessions'));
    const querySnapshot = await getDocs(sessionsQuery);
    const sessionDetails = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSessions(sessionDetails);
  };

  useEffect(() => {
    getSession();
  }, []);

  const calculateTotalSessions = () => {
    return sessions.length;
  };

  const months = [
    { name: 'January' },
    { name: 'February' },
    { name: 'March' },
    { name: 'April' },
    { name: 'May' },
    { name: 'June' },
    { name: 'July' },
    { name: 'August' },
    { name: 'September' },
    { name: 'October' },
    { name: 'November' },
    { name: 'December' },
  ];

  const monthsData = months.map((month, index) => {
    const filteredSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.getMonth() === index;
    });

    // Calculate daily sessions for this month
    const dailySessions = [];
    for (let day = 1; day <= 31; day++) {
      const sessionsForDay = filteredSessions.filter((ses) => {
        const sessionDate = new Date(ses.date);
        return sessionDate.getDate() === day;
      });

      // Separate sessions by patient type
      const inPatients = sessionsForDay.filter(session => session.patientType === 'In-patient');
      const outPatients = sessionsForDay.filter(session => session.patientType === 'Out-patient')
      dailySessions.push({
        day,
        sessions: sessionsForDay,
        inPatients,
        outPatients,
      });
    }

    const totalSessions = calculateTotalSessions();

    return {
      ...month,
      ses: filteredSessions.length,
      dailySessions,
      totalSessions,
    };
  });

  // Filter out months with zero sessions
  const filteredMonthsData = monthsData.filter((month) => month.totalSessions > 0);

  return {
    filteredMonthsData,
  };
};

export default useEshData;
