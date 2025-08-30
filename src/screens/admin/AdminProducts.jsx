import React, { useState } from "react";
import EshProducts from "./admincomponents/EshProducts";
import Products from "./admincomponents/Products";
import { useNavigate } from "react-router-dom";

const Navbar = ({ activePatient, setActivePatient }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-[#FF5162]  w-screen text-white  px-4 md:px-12 py-4">
      <button onClick={() => navigate("/admin")} className="ml-10">
        Back to DashBoard
      </button>
      <div className="max-w-screen-xl mx-auto">
        <ul className="flex  justify-between ">
          <li
            className={`cursor-pointer mb-2 ${
              activePatient === "patient1" ? "font-bold" : ""
            }`}
            onClick={() => setActivePatient("patient1")}
          >
            Fortune Products
          </li>
          <li
            className={`cursor-pointer mb-2 ${
              activePatient === "patient2" ? "font-bold" : ""
            }`}
            onClick={() => setActivePatient("patient2")}
          >
            ESH Products
          </li>
        </ul>
      </div>
    </nav>
  );
};

const ProductDetail = ({ activePatient }) => {
  return (
    <div className="flex-grow p-4">
      {activePatient === "patient1" && (
        <div>
          <Products />
        </div>
      )}
      {activePatient === "patient2" && (
        <div>
          <EshProducts />
        </div>
      )}
    </div>
  );
};

const AdminPatients = () => {
  const [activePatient, setActivePatient] = useState("patient1");

  return (
    <div>
      <Navbar
        activePatient={activePatient}
        setActivePatient={setActivePatient}
      />
      <div className="flex">
        <ProductDetail activePatient={activePatient} />
      </div>
    </div>
  );
};

export default AdminPatients;
