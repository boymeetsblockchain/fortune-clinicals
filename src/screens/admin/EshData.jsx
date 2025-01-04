import useEshData from "../../hooks/useEshData";
import AdminNav from "../../components/AdminNav";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const EshData = () => {
  const navigate = useNavigate();
  const { yearsData } = useEshData();

  if (!yearsData) {
    return <Loader />;
  }

  // Sort yearsData to show the current year first
  const currentYear = new Date().getFullYear();
  const sortedYearsData = [...yearsData].sort((a, b) => {
    if (a.year === currentYear) return -1; // Move current year to the beginning
    if (b.year === currentYear) return 1;
    return b.year - a.year; // Descending order for the rest
  });

  return (
    <>
      <AdminNav />
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center space-y-8">
          {sortedYearsData.map((yearData) => (
            <div key={yearData.year} className="w-full">
              {/* Year Header */}
              <div className="text-center">
                <h2
                  className={`text-4xl font-bold ${
                    yearData.year === currentYear
                      ? "text-red-600"
                      : "text-indigo-600"
                  } mb-6`}
                >
                  {yearData.year}
                </h2>
              </div>
              {/* Months Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {yearData.monthsData.map((month, index) => (
                  <div
                    key={index}
                    className="cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() =>
                      navigate(`/esh/${yearData.year}/${month.name}`)
                    }
                  >
                    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 flex flex-col items-center justify-center space-y-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {month.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">
                          Sessions:
                        </span>
                        <span className="text-lg font-semibold text-green-700">
                          {month?.ses}
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
};

export default EshData;
