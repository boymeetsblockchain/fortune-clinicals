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
  const params = useParams();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const staffCollectionRef = collection(db, "newstaffs");
        const q = query(staffCollectionRef, where("month", "==", params.month));
        const staffQuerySnapshot = await getDocs(q);

        const staffDetails = [];
        if (!staffQuerySnapshot.empty) {
          staffQuerySnapshot.forEach((doc) => {
            staffDetails.push({ id: doc.id, ...doc.data() });
          });
          setStaffData(staffDetails);
        } else {
          setStaffData([]);
        }
      } catch (error) {
        console.error("Error fetching staff details:", error);
        setStaffData([]);
      }
    };

    fetchStaffDetails();
  }, [params.month]);

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

  if (staffData.length === 0) {
    return (
      <div>
        <AdminNav />
        <div className="mx-auto max-w-screen-xl my-5 h-screen flex justify-center items-center">
          <Loader />
        </div>
        <div className="fixed bottom-4 right-4 h-16 w-16 cursor-pointer bg-red-500 flex justify-center items-center rounded-full shadow-lg hover:bg-red-600 transition">
          <Link to={"/admin/add-staff"}>
            <AiOutlineUserAdd size={36} color="white" />
          </Link>
        </div>
      </div>
    );
  }

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
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{staff.name}</td>
                <td className="border px-4 py-2">${staff.salary}</td>
                <td className="border px-4 py-2">${staff.bonus}</td>
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
