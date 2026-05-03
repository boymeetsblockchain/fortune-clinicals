import React, { useCallback, useEffect, useState } from "react";
import EshNav from "../../components/EshNav";
import { useNavigate } from "react-router-dom";
import { AiOutlineUserAdd, AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import { db } from "../../firebase.config";
import Loader from "../../components/Loader";
import { getDocs, collection } from "firebase/firestore";
import {
  BsFillCalendarDateFill,
  BsSortAlphaDown,
  BsArrowDownUp,
  BsGenderAmbiguous,
} from "react-icons/bs";

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
      const data = await getDocs(collection(db, "eshpatients"));
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

  const toggleSortBy = (selectedSortBy) => {
    setSortBy(selectedSortBy);
  };

  const onView = useCallback(
    (id) => {
      navigate(`/esh-patient/${id}`);
    },
    [navigate]
  );

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
      <EshNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ESH Patient Directory</h1>
            <p className="text-slate-500 font-medium">
              Managing <span className="text-emerald-600 font-bold">{patients.length}</span> active records
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <AiOutlineSearch size={22} />
            </div>
            <input
              type="text"
              placeholder="Search by name, condition or clinician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm group-hover:shadow-md"
            />
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
            {[
              { id: "name", label: "A-Z", icon: BsSortAlphaDown, color: "text-blue-500" },
              { id: "date", label: "Date", icon: BsFillCalendarDateFill, color: "text-emerald-500" },
              { id: "update", label: "Updated", icon: BsArrowDownUp, color: "text-purple-500" },
              { id: "gender", label: "Gender", icon: BsGenderAmbiguous, color: "text-pink-500" }
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() => toggleSortBy(sort.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  sortBy === sort.id
                    ? "bg-slate-50 text-slate-900 shadow-inner"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                }`}
              >
                <sort.icon className={sortBy === sort.id ? sort.color : "text-slate-300"} size={16} />
                {sort.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            {["All", "Male", "Female"].map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  genderFilter === gender
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((data) => (
              <div
                key={data?.id}
                className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-emerald-200/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-2xl font-black shadow-inner border border-white ${
                    data.selectedValue === "Out-patient" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    {data?.surname?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                      {data?.surname} {data?.othername}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${data.selectedValue === "Out-patient" ? "bg-emerald-400" : "bg-blue-400"}`}></span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                        {data?.selectedValue}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="p-4 bg-slate-50/50 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</span>
                      <span className="text-xs text-slate-700 font-bold truncate max-w-[120px] text-right">
                        {data?.condition || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinician</span>
                      <span className="text-xs text-slate-700 font-bold truncate max-w-[120px] text-right">
                        {data?.clinician || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onView(data?.id)}
                  className="w-full py-4 bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-100 transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  Manage Record
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                <AiOutlineSearch size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No patients found</h3>
              <p className="text-slate-400 max-w-xs font-medium">Try adjusting your search filters to find the clinical records you're looking for.</p>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <Link
          to="/add-esh-patients"
          className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] shadow-2xl shadow-emerald-200 flex items-center justify-center hover:scale-110 hover:-rotate-6 active:scale-90 transition-all duration-300 z-50 group border-4 border-white"
        >
          <AiOutlineUserAdd size={28} />
          <div className="absolute right-20 bg-slate-900 text-white text-[10px] font-bold py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap shadow-xl">
            Add ESH Patient
          </div>
        </Link>
      </main>
    </div>
  );
}

export default Patients;
