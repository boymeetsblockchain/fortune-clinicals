import AdminNav from '../../components/AdminNav';
import { useNavigate } from 'react-router-dom';

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

const AdminStaff = () => {
  const navigate = useNavigate();

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl my-5 h-screen md:overflow-y-hidden w-full px-4 md:px-8 relative lg:px-12">
        <div className="grid grid-cols-3 gap-4">
          {months.map((data) => (
            <div
              key={data.id}
              className="cursor-pointer bg-[#FF5162]  hover:bg-red -900 transition duration-300 rounded-lg"
              onClick={() => navigate(`/admin/staff/${data.id}`)}
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

export default AdminStaff;
