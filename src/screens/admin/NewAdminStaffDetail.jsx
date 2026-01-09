import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import AdminNav from "../../components/AdminNav";
import { AiOutlineUserAdd } from "react-icons/ai";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const NewAdminStaffDetail = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching staff for:", params.month, params.year);
        const staffCollectionRef = collection(db, "newstaffs");

        // Query by month first to include records with and without the year field
        const q = query(
          staffCollectionRef,
          where("month", "==", params.month)
        );
        const staffQuerySnapshot = await getDocs(q);

        const staffDetails = [];
        console.log("Query snapshot size:", staffQuerySnapshot.size);

        staffQuerySnapshot.forEach((doc) => {
          const data = doc.data();

          let recordYear = data.year;
          if (!recordYear && data.date) {
            // Try to extract year from date string (YYYY-MM-DD)
            recordYear = data.date.split("-")[0];
          }
          if (!recordYear) {
            // Fallback for very old records with no year and no date string
            recordYear = "2024";
          }

          // Filter: same year
          if (recordYear == params.year) {
            console.log("Found staff doc:", doc.id, data);
            staffDetails.push({ id: doc.id, ...data });
          }
        });

        setStaffData(staffDetails);
      } catch (error) {
        console.error("Error fetching staff details:", error);
        toast.error("Error fetching staff: " + error.message);
        setStaffData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, [params.month, params.year]);

  const deleteStaff = async (staffId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "newstaffs", staffId));
        setStaffData((prevStaffData) =>
          prevStaffData.filter((staff) => staff.id !== staffId)
        );
        toast.success("Staff has been deleted");
      } catch (error) {
        console.error("Error deleting staff member:", error);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNav />
        <div className="mx-auto max-w-screen-xl my-5 h-screen flex justify-center items-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (staffData.length === 0) {
    return (
      <div>
        <AdminNav />
        <div className="mx-auto max-w-screen-xl my-5 h-screen flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">No staff records found for {params.month} {params.year}</h2>
          <div className="fixed bottom-4 right-4 h-16 w-16 cursor-pointer bg-red-500 flex justify-center items-center rounded-full shadow-lg hover:bg-red-600 transition">
            <Link to={"/admin/add-staff"}>
              <AiOutlineUserAdd size={36} color="white" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSalary = staffData.reduce((sum, staff) => sum + Number(staff.salary || 0), 0);
  const totalBonus = staffData.reduce((sum, staff) => sum + Number(staff.bonus || 0), 0);


  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-screen-xl my-5 h-screen overflow-x-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-6">Staff Details</h1>
        <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">No.</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Salary</th>
              <th className="border px-4 py-2 text-left">Bonus</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Note</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff, index) => (
              <tr
                key={staff.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{staff.name}</td>
                <td className="border px-4 py-2">₦{staff.salary}</td>
                <td className="border px-4 py-2">₦{staff.bonus}</td>
                <td className="border px-4 py-2">{staff.date}</td>
                <td className="border px-4 py-2">{staff.note}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600 transition"
                    onClick={() => deleteStaff(staff.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold">
              <td className="border px-4 py-2" colSpan={2}>Totals</td>
              <td className="border px-4 py-2">₦{totalSalary}</td>
              <td className="border px-4 py-2">₦{totalBonus}</td>
              <td className="border px-4 py-2" colSpan={3}></td>
            </tr>
          </tfoot>

        </table>
        <div className="fixed bottom-4 right-4 h-16 w-16 cursor-pointer bg-red-500 flex justify-center items-center rounded-full shadow-lg hover:bg-red-600 transition">
          <Link to={"/admin/add-staff"}>
            <AiOutlineUserAdd size={36} color="white" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewAdminStaffDetail;
