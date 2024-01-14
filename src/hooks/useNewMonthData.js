import { useState, useEffect } from 'react';
import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';



const useNewMonthData =() => {
    const [payments, setPayments] = useState([]);
    const [sessions, setSessions] = useState([]);
  
    const getPayment = async () => {
      const paymentsQuery = query(collection(db, 'newpayments'));
      const querySnapshot = await getDocs(paymentsQuery);
      const paymentDetails = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentDetails);
    };
  
    const getSession = async () => {
      const sessionsQuery = query(collection(db, 'newsessions'));
      const querySnapshot = await getDocs(sessionsQuery);
      const sessionDetails = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionDetails);
    };
  
    useEffect(() => {
      getPayment();
      getSession();
    }, []);

    const calculateTotalPayment = () => {
        if (!payments) return 0;
        return payments.reduce((total, payment) => {
          const amount = parseFloat(payment.amount);
          return isNaN(amount) ? total : total + amount;
        }, 0);
      };
    
      const calculateTotalSessions = () => {
        return sessions.length;
      };

      const months = [
        {
          name: 'January',
        },
        {
          name: 'February',
        },
        {
          name: 'March',
        },
        {
          name: 'April',
        },
        {
          name: 'May',
        },
        {
          name: 'June',
        },
        {
          name: 'July',
        },
        {
          name: 'August',
        },
        {
          name: 'September',
        },
        {
          name: 'October',
        },
        {
          name: 'November',
        },
        {
          name: 'December',
        },
      ];

      const monthsData = months.map((month, index) => {
        const filteredPayments = payments.filter((payment) => {
          const paymentDate = new Date(payment.datePayed);
          return paymentDate.getMonth() === index;
        });
    
        const filteredSessions = sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return sessionDate.getMonth() === index;
        });
    
        const calculateTotalPaymentsForMonth = (monthIndex) => {
          if (!payments) return 0;
      
          const filteredPayments = payments.filter((payment) => {
            const paymentDate = new Date(payment.datePayed);
            return paymentDate.getMonth() === monthIndex;
          });
      
          return filteredPayments.reduce((total, payment) => {
            const amount = parseFloat(payment.amount);
            return isNaN(amount) ? total : total + amount;
          }, 0);
        };
    
        // Calculate daily payments for this month
        const dailyPayments = [];
        for (let day = 1; day <= 31; day++) {
          const paymentsForDay = filteredPayments.filter((payment) => {
            const paymentDate = new Date(payment.datePayed);
            return paymentDate.getDate() === day;
          });
          dailyPayments.push({
            day,
            payments: paymentsForDay,
          });
        }
    
        const totalPayment = calculateTotalPayment();
        const totalSessions = calculateTotalSessions();
        const totalPaymentsForMonth = calculateTotalPaymentsForMonth(index);
    
        return {
          ...month,
          pay: filteredPayments.length,
          ses: filteredSessions.length,
          totalPayment,
          totalSessions,
          dailyPayments,
          totalPaymentsForMonth
        };
      });
    
      // Filter months with non-zero total payment
      const filteredMonthsData = monthsData.filter((month) => month.totalPayment > 0);
    
      return {
        filteredMonthsData,
      };

}

export default useNewMonthData