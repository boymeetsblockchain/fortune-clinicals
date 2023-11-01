import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import AdminNav from '../../components/AdminNav'
const months = [ // Define the months array
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function AdminStaffDetail() {
  const { id } = useParams();
  const [staffData, setStaffData] = useState({
    name: '',
    salary: 0,
    monthsSalary: Array(12).fill(0),
  });
 
  const navigate = useNavigate()
  useEffect(() => {
    const fetchStaffDetails = async () => {
      const staffDocRef = doc(db, 'staffs', id);
      const staffDocSnapshot = await getDoc(staffDocRef);

      if (staffDocSnapshot.exists()) {
        const staffData = staffDocSnapshot.data();
        setStaffData({
          name: staffData.name,
          salary: staffData.salary,
          bonus:staffData.bonus,
          monthsSalary: staffData.monthsSalary || Array(12).fill(0),
        });
      }
    };

    fetchStaffDetails();
  }, [id]);

  const handleSalaryChange = (index, value) => {
    const updatedMonthsSalary = [...staffData.monthsSalary];
    updatedMonthsSalary[index] = value;

    setStaffData({
      ...staffData,
      monthsSalary: updatedMonthsSalary,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Update staff details in Firestore
    const staffDocRef = doc(db, 'staffs', id);
    await updateDoc(staffDocRef, {
      name: staffData.name,
      salary: staffData.salary,
      monthsSalary: staffData.monthsSalary,
    });

    navigate(-1)
    
  };

  return (
    <>
    <AdminNav/>
     <div className=" mx-auto max-w-screen-xl px-4 md:px-8 lg:px-12">
        <h1 className='text-center my-4 text-3xl font-bold'>Edit Staff Details</h1>
         <h2 className='text-2xl  mb-4'>Name:{staffData.name}</h2>
      <form onSubmit={handleFormSubmit} className='flex flex-col'> 
        {/* <label>
          Current Salary:
          <input
            type="number"
            value={staffData.salary}
            onChange={(e) => setStaffData({ ...staffData, salary: parseFloat(e.target.value) })}
          />
        </label> */}
        <table className='flex  justify-between'>
          <thead >
            <tr className='flex flex-col gap-3 items-start'>
              {months.map((month, index) => (
                <th key={index}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
  <tr className='flex flex-col gap-3'>
    {staffData.monthsSalary.map((salary, index) => (
      <td key={index}>
        <input
         className='focus:outline-none'
          type="number"
          value={salary}
          onChange={(e) => handleSalaryChange(index, parseFloat(e.target.value))}
        />
      </td>
    ))}
  </tr>
</tbody>
        </table>
        <button   className="bg-green-500 py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-green-700 transition"
            type="submit">Save Changes</button>
      </form>
     </div>
    </>
  );
}

export default AdminStaffDetail;
