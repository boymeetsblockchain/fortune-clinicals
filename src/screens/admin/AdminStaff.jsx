import { Link } from 'react-router-dom';
import AdminNav from '../../components/AdminNav'
import {PiMoney} from 'react-icons/pi'
import { useEffect,useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const months = [
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

const AdminStaff = () => {
  const[staffs,setStaffs]= useState([])
  const [loading,setLoading]= useState(true)
  const navigate= useNavigate()
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getDocs(collection(db, 'staffs'));
        const filteredData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffs(filteredData);
        console.log("test",filteredData)
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
  }, []);

  if(loading){
    return(
      <Loader/>
    )
  }
  return (
    <>
     <AdminNav/>
     <div className="mx-auto max-w-6xl  my-5 h-screen md:overflow-y-hidden w-full px-4 md:px-8 relative lg:px-12">
     <table className="min-w-full table-fixed mh">
  <thead>
    <tr>
    <th className="px-4 py-2">No.</th>
      <th className="px-4 py-2">Name</th>
      <th className="px-4 py-2">Salary</th>
      {/* <th className="py-2 flex justify-between">
  {months.map((month, index) => (
    <span className='mx-2' key={index}>{month}</span>
  ))}
</th> */}
  <th className="px-4 py-2">Bonuses</th>
    </tr>
  </thead>
  <tbody>
  {
    staffs.map((data)=>(
     <tr key={data.number} className='border-b border-gray-200 cursor-pointer' onClick={()=>navigate(`/admin/staff/${data.id}`)}>
       <td className="px-4 py-2 text-center">{data.number}</td>
        <td className="px-4 py-2 text-center">{data.name}</td>
        <td className="px-4 py-2 text-center">{data.salary}</td>
        <td className="px-4 py-2 text-center">{data.salary}</td>
     </tr>
    ))
  }
  </tbody>
</table>
<div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
          <Link to={'/admin/add-staff'}>
            <PiMoney size={64} color="red" />
          </Link>
        </div>
     </div>
    </>
  )
}

export default AdminStaff