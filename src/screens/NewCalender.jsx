import AdminNav from "../components/AdminNav";
import { useNavigate } from "react-router-dom";
import useNewMonthData from "../hooks/useNewMonthData";
import Loader from "../components/Loader";

function Calendar() {
  const navigate = useNavigate();
  const { yearsData } = useNewMonthData();

  if (!yearsData) {
    return <Loader />;
  }

  // Sort yearsData to display the current year first
  const currentYear = new Date().getFullYear();
  const sortedYearsData = [...yearsData].sort((a, b) => {
    if (a.year === currentYear) return -1;
    if (b.year === currentYear) return 1;
    return b.year - a.year; // Descending order for other years
  });

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-12 h-full mx-auto my-5">
        <div className="space-y-8">
          {sortedYearsData.map((yearData) => (
            <div key={yearData.year}>
              {/* Year Header */}
              <div className="text-center mb-6">
                <h2
                  className={`text-4xl font-bold ${
                    yearData.year === currentYear
                      ? "text-red-600"
                      : "text-indigo-600"
                  }`}
                >
                  {yearData.year}
                </h2>
              </div>
              {/* Months Grid */}
              <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4">
                {yearData.monthsData.map((month, index) => (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/payments/new/${yearData.year}/${month.name}`)
                    }
                  >
                    <div className="bg-gray-200 h-32 w-64 flex items-center justify-center text-center p-4 rounded flex-col shadow transition-transform transform hover:scale-105">
                      <h1 className="text-3xl font-bold">{month.name}</h1>
                      <div className="flex gap-2">
                        <span className="text-green-800 font-semibold">
                          Sessions: {month.ses}
                        </span>
                        <span className="text-red-800 font-semibold">
                          Payments: {month?.pay || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Calendar;
