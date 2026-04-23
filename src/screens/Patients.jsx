import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link } from "react-router-dom";
import { db } from "../firebase.config";
import Loader from "../components/Loader";
import {
  BsFillCalendarDateFill,
  BsSortAlphaDown,
  BsArrowDownUp,
  BsGenderAmbiguous,
} from "react-icons/bs";
import { getDocs, collection } from "firebase/firestore";

function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder] = useState("ascending");
  const [sortBy, setSortBy] = useState("name");
  const [genderFilter, setGenderFilter] = useState("All");

  const sortPatientsByDate = (data, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const dateA = new Date(a.dateRegistered);
      const dateB = new Date(b.dateRegistered);
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return order === "descending" ? dateA - dateB : dateB - dateA;
    });
    return sortedData;
  };

  const sortPatientsByName = (data, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const fullNameA = `${a.surname} ${a.othername}`.toLowerCase();
      const fullNameB = `${b.surname} ${b.othername}`.toLowerCase();
      return order === "ascending"
        ? fullNameA.localeCompare(fullNameB)
        : fullNameB.localeCompare(fullNameA);
    });
    return sortedData;
  };

  const sortPatientsByUpdatedDate = (data, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const dateA = a.updatedDate ? new Date(a.updatedDate) : null;
      const dateB = b.updatedDate ? new Date(b.updatedDate) : null;
      if (!dateA && !dateB) return 0;
      if (!dateA) return order === "ascending" ? 1 : -1;
      if (!dateB) return order === "ascending" ? -1 : 1;
      return order === "descending" ? dateA - dateB : dateB - dateA;
    });
    return sortedData;
  };

  const sortPatientsByGender = (data, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const genderA = (a.gender || "").toLowerCase();
      const genderB = (b.gender || "").toLowerCase();
      return order === "ascending"
        ? genderA.localeCompare(genderB)
        : genderB.localeCompare(genderA);
    });
    return sortedData;
  };

  const getPatients = useCallback(async () => {
    try {
      const data = await getDocs(collection(db, "patients"));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let sortedData;
      if (sortBy === "name") {
        sortedData = sortPatientsByName(filteredData, sortOrder);
      } else if (sortBy === "date") {
        sortedData = sortPatientsByDate(filteredData, sortOrder);
      } else if (sortBy === "update") {
        sortedData = sortPatientsByUpdatedDate(filteredData, sortOrder);
      } else if (sortBy === "gender") {
        sortedData = sortPatientsByGender(filteredData, sortOrder);
      }

      setPatients(sortedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    getPatients();
  }, [getPatients]);

  const onView = useCallback(
    (id) => {
      navigate(`/dashboard/patient/${id}`);
    },
    [navigate]
  );

  const toggleSortBy = (selectedSortBy) => {
    setSortBy(selectedSortBy);
  };

  const filteredPatients = patients
    ? patients.filter((patient) => {
        const fullName = `${patient.surname} ${patient.othername}`.toLowerCase();
        const condition = (patient.condition || "").toLowerCase();
        const gender = (patient.gender || "").toLowerCase();
        const clinician = (patient.clinician || "").toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesQuery =
          fullName.includes(query) ||
          condition.includes(query) ||
          gender.includes(query) ||
          clinician.includes(query);

        const matchesGender =
          genderFilter === "All" || gender === genderFilter.toLowerCase();

        return matchesQuery && matchesGender;
      })
    : [];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">Patients Directory</h1>
            <p className="text-slate-500 font-medium">
              Total Patients: <span className="text-[#FF5162]">{patients.length}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#FF5162]/10 focus:border-[#FF5162] transition-all shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {[
              { id: "name", label: "A-Z", icon: BsSortAlphaDown, color: "text-blue-500" },
              { id: "date", label: "Date", icon: BsFillCalendarDateFill, color: "text-emerald-500" },
              { id: "update", label: "Updated", icon: BsArrowDownUp, color: "text-purple-500" },
              { id: "gender", label: "Gender", icon: BsGenderAmbiguous, color: "text-pink-500" }
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() => toggleSortBy(sort.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  sortBy === sort.id
                    ? "bg-slate-50 text-slate-900 shadow-inner"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <sort.icon className={sort.color} size={18} />
                <span className="hidden sm:inline">{sort.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {["All", "Male", "Female"].map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  genderFilter === gender
                    ? gender === "Male" ? "bg-blue-500 text-white shadow-lg shadow-blue-100" :
                      gender === "Female" ? "bg-pink-500 text-white shadow-lg shadow-pink-100" :
                      "bg-[#FF5162] text-white shadow-lg shadow-red-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients
            .filter((data) => data.selectedValue === "Basic")
            .map((data) => (
              <div
                key={data?.id}
                className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner ${
                    data.selectedValue === "Home-Patient" ? "bg-emerald-50 text-emerald-600" :
                    data.selectedValue === "Hospital-Calls" ? "bg-purple-50 text-purple-600" :
                    data.selectedValue === "Vip" ? "bg-blue-50 text-blue-600" :
                    "bg-[#FF5162]/5 text-[#FF5162]"
                  }`}>
                    {data?.surname?.[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-[#FF5162] transition-colors">
                      {data?.surname} {data?.othername}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium truncate">
                      {data?.condition || "No condition specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium uppercase tracking-wider">Clinician</span>
                    <span className="text-slate-700 font-semibold">{data?.clinician}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium uppercase tracking-wider">Registered</span>
                    <span className="text-slate-700 font-semibold">{data?.dateRegistered}</span>
                  </div>
                </div>

                <button
                  onClick={() => onView(data?.id)}
                  className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all shadow-md active:scale-95 ${
                    data.selectedValue === "Home-Patient" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" :
                    data.selectedValue === "Hospital-Calls" ? "bg-purple-500 hover:bg-purple-600 shadow-purple-100" :
                    data.selectedValue === "Vip" ? "bg-blue-500 hover:bg-blue-600 shadow-blue-100" :
                    "bg-[#FF5162] hover:bg-[#E64858] shadow-red-100"
                  }`}
                >
                  View Details
                </button>
              </div>
            ))}
        </div>

        <Link
          to="/add-new"
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#FF5162] text-white rounded-2xl shadow-2xl shadow-red-200 flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 z-50 group"
        >
          <AiOutlineUserAdd size={32} />
          <span className="absolute right-20 bg-slate-800 text-white text-xs py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Add New Patient
          </span>
        </Link>
      </main>
    </div>
  );
}

export default Patients;
