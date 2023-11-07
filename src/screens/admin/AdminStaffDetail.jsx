import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNav from '../../components/AdminNav'
const AdminStaffDetail = () => {
  const [staffData, setStaffData] = useState([
    {
      id: 1,
      name: 'John Doe',
      salary: 5000,
      bonus: 200,
      note: 'Excellent performance',
    },
    {
      id: 2,
      name: 'Jane Smith',
      salary: 5500,
      bonus: 250,
      note: 'Hardworking employee',
    },
    // Add more staff data here
  ]);

  const params = useParams()
  console.log(params.id)
  const handleEdit = (id, field, value) => {
    const updatedStaffData = staffData.map((staff) => {
      if (staff.id === id) {
        return { ...staff, [field]: value };
      }
      return staff;
    });
    setStaffData(updatedStaffData);
  };

  return (
    <>
    <AdminNav />
    <div className="mx-auto max-w-screen-xl my-5 h-screen md:overflow-y-hidden w-full px-4 md:px-8 lg:px-12">
      <h1>Staff Details</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Salary</th>
            <th>Bonus</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {staffData.map((staff) => (
            <tr key={staff.id}>
              <td>
                <input
                  type="text"
                  value={staff.name}
                  onChange={(e) => handleEdit(staff.id, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={staff.salary}
                  onChange={(e) => handleEdit(staff.id, 'salary', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={staff.bonus}
                  onChange={(e) => handleEdit(staff.id, 'bonus', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={staff.note}
                  onChange={(e) => handleEdit(staff.id, 'note', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AdminStaffDetail;
