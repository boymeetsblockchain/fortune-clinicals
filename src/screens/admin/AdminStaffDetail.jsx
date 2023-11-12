import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import AdminNav from '../../components/AdminNav';
import { AiOutlineUserAdd } from 'react-icons/ai';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

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

  const deleteStaff = async (staffId) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this staff member?');
  
    if (confirmDelete) {
      try {
        // Delete the staff member with the specified ID
        await deleteDoc(doc(db, 'staffs', staffId));
        setStaffData((prevStaffData) => prevStaffData.filter((staff) => staff.id !== staffId));
        toast.success('Staff has been deleted');
        
      } catch (error) {
        console.error('Error deleting staff member:', error);
      }
    }
  };
  

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
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff, index) => (
              <tr key={staff.id}>
                <td className="px-4 text-center py-2">{index + 1}</td>
                <td className="px-4 text-center py-2">{staff.name}</td>
                <td className="px-4 text-center py-2">{staff.salary}</td>
                <td className="px-4 text-center py-2">{staff.bonus}</td>
                <td className="px-4 text-center py-2">{staff.note}</td>
                <td className="px-4 text-center py-2">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md text-sm"
                    onClick={() => deleteStaff(staff.id)}
                  >
                    Delete
                  </button>
                </td>
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
