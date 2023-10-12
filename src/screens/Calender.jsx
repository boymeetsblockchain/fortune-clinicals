import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import useMonthsData from "../hooks/useMonthData";

function Calendar() {
  const navigate = useNavigate();
  const { filteredMonthsData } = useMonthsData(); 

  return (
    <>
      <Navbar />
      <div className="px-4 md:px-8 lg:px-12 h-full mx-auto my-5">

        <div className="flex items-center justify-center h-full">
      
          <div className="grid grid-cols-4 gap-4">
            {filteredMonthsData.map((month, index) => (
              <div key={index} className='cursor-pointer'  onClick={() => navigate(`/payments/${month.name}`)} >
                <div className="bg-gray-200 h-32 w-64 flex items-center justify-center text-center p-4 rounded  flex-col shadow">
                  <h1 className="text-3xl font-bold">{month.name}</h1>
                  <div className="flex gap-2">
                    <span className="text-green-800 font-semibold">Sessions: {month.ses}</span>
                    <span className="text-red-800 font-semibold">Payments: {month.pay}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
      {/* <BreakDown monthsData={monthsData} /> */}
    </>
  );
}

export default Calendar;
