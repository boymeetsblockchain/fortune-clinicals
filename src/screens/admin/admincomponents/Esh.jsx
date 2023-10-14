import React, { useCallback, useEffect, useState } from 'react';
import { db } from '../../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Loader from '../../../components/Loader';
import {BsFillCalendarDateFill,BsSortAlphaDown,BsArrowDownUp} from 'react-icons/bs'
import { getDocs, collection } from 'firebase/firestore';


function Esh() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const [sortOrder, setSortOrder] = useState('ascending'); // State for sorting order
    const [sortBy, setSortBy] = useState('name'); 
  
    const sortPatientsByDate = (data, order) => {
      const sortedData = [...data];
    
      sortedData.sort((a, b) => {
        const dateA = new Date(a.dateRegistered);
        const dateB = new Date(b.dateRegistered);
    
        // Check for undefined or invalid dates
        if (isNaN(dateA) && isNaN(dateB)) {
          // Both dates are invalid or undefined, no specific order
          return 0;
        } else if (isNaN(dateA)) {
          // Handle cases where dateA is invalid or undefined
          return 1; // Move dateA to the end
        } else if (isNaN(dateB)) {
          // Handle cases where dateB is invalid or undefined
          return -1; // Move dateB to the end
        }
    
        return order === 'descending' ? dateA - dateB : dateB - dateA;
      });
    
      return sortedData;
    };
    
  
    const sortPatientsByName = (data, order) => {
      const sortedData = [...data];
  
      sortedData.sort((a, b) => {
        const fullNameA = `${a.surname} ${a.othername}`.toLowerCase();
        const fullNameB = `${b.surname} ${b.othername}`.toLowerCase();
  
        return order === 'ascending' ? fullNameA.localeCompare(fullNameB) : fullNameB.localeCompare(fullNameA);
      });
  
      return sortedData;
    };
  
    const sortPatientsByUpdatedDate = (data, order) => {
      const sortedData = [...data];
    
      sortedData.sort((a, b) => {
        const dateA = a.updatedDate ? new Date(a.updatedDate) : null;
        const dateB = b.updatedDate ? new Date(b.updatedDate) : null;
    
        // Handle cases where updatedDate is undefined or missing
        if (!dateA && !dateB) return 0;
        if (!dateA) return order === 'ascending' ? 1 : -1;
        if (!dateB) return order === 'ascending' ? -1 : 1;
    
        // Sort in descending order to show the most recently updated patients first
        return order === 'descending' ? dateA - dateB : dateB - dateA;
      });
    
      return sortedData;
    };
    const getPatients = async () => {
        try {
          const data = await getDocs(collection(db, 'eshpatients'));
          const filteredData = data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          // Sort the filtered data based on the selected sorting option
          let sortedData;
          if (sortBy === 'name') {
            sortedData = sortPatientsByName(filteredData, sortOrder);
          } else if (sortBy === 'date') {
            sortedData = sortPatientsByDate(filteredData, sortOrder);
          } else if (sortBy === 'update') { // Corrected sortBy value to 'update'
            sortedData = sortPatientsByUpdatedDate(filteredData, sortOrder);
          }
      
          setPatients(sortedData);
          // console.log(sortedData)
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      
      useEffect(() => {
        getPatients();
      }, [sortOrder, sortBy]); 
    
      const onView = useCallback((id) => {
        navigate(`/admin/esh/${id}`);
      }, [navigate]);
    
      const toggleSortBy = (selectedSortBy) => {
        setSortBy(selectedSortBy);
      };
      
     // Filter patients based on search query
    const filteredPatients = patients ? patients.filter((patient) => {
      const fullName = `${patient.surname} ${patient.othername}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    }) : [];
    
      if (loading) {
        return <Loader />;
      }
  return (
    <>
     <div className="px-4 md:px-8 lg:px-8 h-full mx-auto my-5 relative">
        {/* Add the search input field */}
     <div className="flex justify-between items-center">
     <div >
         <p className='text-lg font-bold'>List of Patients: <span className='text-green-500'>{patients.length}</span></p>
        </div>
        <div className="sort flex gap-6 justify-between items-center">
      <button  className='flex text-xs gap-x-3 items-center' onClick={() => toggleSortBy('name')}><BsSortAlphaDown size={24} color='blue'/>Alphabetical Order</button>
      <button className='flex text-xs gap-x-3 items-center'   onClick={() => toggleSortBy('date')}><BsFillCalendarDateFill size={24} color={'green'}/>Date Added</button>
      <button className='flex text-xs gap-x-3 items-center'   onClick={() => toggleSortBy('update')}><BsArrowDownUp size={24} color={'purple'}/>Updated patient</button>
    </div>

      <div className="flex justify-end">
      <input
          type="text"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none mb"
        />
      </div>
     </div>
        <div className="data-box grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {filteredPatients.map((data) => (
             <div
             className="h-30 py-4 w-auto shadow-md rounded-lg flex flex-col items-start"
             key={data?.id}
           >
             <div className="flex flex-row  justify-evenly px-4">
             <div className={`text-center text-5xl h-20 w-20 px-2 py-1 items-center flex font-bold ${
  data.selectedValue === "Home-Patient" ? 'text-green-500' : 'text-[#ff5162]'
}`}>
  {data?.surname[0].toUpperCase()}
</div>
               <div className="flex ml-4 space-y-2 flex-col">
                 <p className="text-sm">
                   Name:{' '}
                   <span className="text-gray-800">{data?.surname} &nbsp; {data?.othername}</span>
                 </p>
                 <p className="text-sm">
                   Clinicians:{' '}
                   <span className="text-gray-800">{data?.clinician}</span>
                 </p>
                 <p className="text-sm">
                   Date:{' '}
                   <span className="text-gray-800 text-xs gap-x-3 items-center">
                     {data?.dateRegistered}
                   </span>
                 </p>
                 <button className="px-2 py-0.5 text-sm bg-[#FF5162] text-white" onClick={()=>onView(data?.id)}>
                   View
                 </button>
               </div>
               {/* <div className="deletebutton ml-5" onClick={onDelete}>
                 <ImBin size={20} className="text-[#ff5162] cursor-pointer" />
               </div> */}
             </div>
           </div>
          ))}
        </div>
        <div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
          <Link to={'/add-new'}>
            <AiOutlineUserAdd size={64} color="red" />
          </Link>
        </div>
      </div>
    </>
  )
}

export default Esh