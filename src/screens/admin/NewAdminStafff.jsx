import React, { useState } from "react";
import AdminNav from "../../components/AdminNav";
import { useNavigate } from "react-router-dom";

const months = [
  { name: "January", id: "January" },
  { name: "February", id: "February" },
  { name: "March", id: "March" },
  { name: "April", id: "April" },
  { name: "May", id: "May" },
  { name: "June", id: "June" },
  { name: "July", id: "July" },
  { name: "August", id: "August" },
  { name: "September", id: "September" },
  { name: "October", id: "October" },
  { name: "November", id: "November" },
  { name: "December", id: "December" },
];

const NewAdminStaff = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // const years = ["2024", "2025", "2026", "2027", "2028"];
  const years = Array.from({ length: 2100 - 2024 + 1 }, (_, i) => String(2024 + i));


  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl my-5 h-screen md:overflow-y-hidden w-full px-4 md:px-8 relative lg:px-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Staff Records</h1>
          <select
            className="p-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="grid  grid-cols-2  md:grid-cols-4  gap-4">
          {months.map((data) => (
            <div
              key={data.id}
              className="cursor-pointer bg-blue-500  hover:bg-blue-600 transition duration-300 rounded-lg shadow-md"
              onClick={() => navigate(`/admin/newstaff/${selectedYear}/${data.id}`)}
            >
              <div className="p-6">
                <h1 className="text-white text-2xl text-center  font-semibold">
                  {data.name}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewAdminStaff;
