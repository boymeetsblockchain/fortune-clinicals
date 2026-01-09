import React, { useState } from "react";
import AdminNav from "../../components/AdminNav";
import Input from "../../components/Input";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase.config";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import Select from "../../components/Select";



const AdminAddStaff = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: "",
    salary: 0,
    note: "",
    bonus: 0,
    month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()),
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "date") {
      const selectedDate = new Date(value);
      if (!isNaN(selectedDate.getTime())) {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        setFormData({
          ...formData,
          date: value,
          month: monthNames[selectedDate.getMonth()],
          year: selectedDate.getFullYear().toString(),
        });
      }
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const registerStaff = async (e) => {
    e.preventDefault();

    try {
      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
        userId: auth?.currentUser?.uid,
      };

      const data = await addDoc(collection(db, "newstaffs"), formDataCopy);
      console.log(data);
      toast.success("Staff added successfully");
      navigate(`/admin/newstaff/${formDataCopy.year}/${formDataCopy.month}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add staff");
    }
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 md:px-8 lg:px-12">
        <h1 className="text-center my-6 font-bold text-3xl uppercase">
          Add Staff
        </h1>
        <form
          className="flex flex-col space-y-4 justify-center w-full mx-auto"
          onSubmit={registerStaff}
        >
          <Input
            type={"text"}
            label={"Name"}
            id={"name"}
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            type={"number"}
            label={"Salary"}
            id={"salary"}
            value={formData.salary}
            onChange={handleChange}
          />
          <Input
            type={"text"}
            label={"Bonus"}
            id={"bonus"}
            value={formData.bonus}
            onChange={handleChange}
          />
          <Input
            type={"text"}
            label={"Note"}
            id={"note"}
            value={formData.note}
            onChange={handleChange}
          />

          <Input
            type={"date"}
            label={"Date of Payment"}
            id={"date"}
            value={formData.date}
            onChange={handleChange}
          />
          <button className="bg-[#FF5162] py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition">
            Add <AiOutlineArrowRight />
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminAddStaff;
