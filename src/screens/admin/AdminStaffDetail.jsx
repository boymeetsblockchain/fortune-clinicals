import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import AdminNav from '../../components/AdminNav';
import { AiOutlineUserAdd } from 'react-icons/ai';
import Loader from '../../components/Loader';

const AdminStaffDetail = () => {
  const [staffData, setStaffData] = useState([]);
  const params = useParams();
  console.log(params.month);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const staffCollectionRef = collection(db, 'staffs');
        const q = query(staffCollectionRef, where('month', '==', params.month));
        const staffQuerySnapshot = await getDocs(q);

        const staffDetails = [];

        if (!staffQuerySnapshot.empty) {
          staffQuerySnapshot.forEach((doc) => {
            staffDetails.push({ id: doc.id, ...doc.data() });
          });
          setStaffData(staffDetails);
        } else {
          setStaffData([]); // Handle no staff found
        }
      } catch (error) {
        console.error('Error fetching staff details:', error);
        setStaffData([]); // Handle errors
      }
    };

    fetchStaffDetails();
  }, [params.month]);

  if (staffData.length === 0) {
    return (
      <div>
        <AdminNav />
        <div className="mx-auto max-w-screen-xl my-5 h-screen md:overflow-y-hidden relative w-full px-4 md:px-8 lg:px-12">
          <Loader />
        </div>
        <div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
          <Link to={'/admin/add-staff'}>
            <AiOutlineUserAdd size={64} color="red" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-screen-xl my-5 h-screen md:overflow-y-hidden w-full px-4 md:px-8 lg:px-12 relative">
        <table className="min-w-full table-fixed">
          <thead>
            <tr>
            <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Bonus</th>
              <th className="px-4 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff,index) => (
              <tr key={staff.id}>
                 <td className="px-4 text-center py-2">{index + 1}</td>
                <td className="px-4 text-center py-2">{staff.name}</td>
                <td className="px-4 text-center py-2">{staff.salary}</td>
                <td className="px-4 text-center py-2">{staff.bonus}</td>
                <td className="px-4 text-center py-2">{staff.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
          <Link to={'/admin/add-staff'}>
            <AiOutlineUserAdd size={64} color="red" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffDetail;
