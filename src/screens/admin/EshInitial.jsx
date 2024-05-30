import useInitialReview from "../../hooks/useEshInitial"
import AdminNav from '../../components/AdminNav'
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
const EshInitial= () => {
  const navigate = useNavigate();
  const { filteredMonthsData } = useInitialReview(); 


  if(!filteredMonthsData){
    return <Loader/>
  }
  return (
    <>
    <AdminNav/>
    <div className="px-4 md:px-8 lg:px-12 h-full mx-auto my-5">

        <div className="flex items-center justify-center h-full">
      
          <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4">
            {filteredMonthsData.map((month, index) => (
              <div key={index} className='cursor-pointer'  onClick={() => navigate(`/esh/initial/${month.name}`)} >
                <div className="bg-gray-200 h-32 w-64 flex items-center justify-center text-center p-4 rounded  flex-col shadow">
                  <h1 className="text-3xl font-bold">{month.name}</h1>
                  <div className="flex gap-2">
                    <span className="text-green-800 font-semibold"> Review {month?.rev}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </>
  )
}
export default EshInitial