import AdminNav from "../../components/AdminNav";
import Loader from "../../components/Loader";
import useInitialReview from "../../hooks/useEshInitial";
import { useNavigate } from "react-router-dom";

const EshInitial = () => {
  const navigate = useNavigate();
  const { yearsData } = useInitialReview();

  if (!yearsData || yearsData.length === 0) {
    return <Loader />;
  }

  // Sort yearsData to have the current year on top
  const sortedYearsData = [...yearsData].sort((a, b) => {
    const currentYear = new Date().getFullYear();
    if (a.year === currentYear) return -1;
    if (b.year === currentYear) return 1;
    return b.year - a.year;
  });

  return (
    <>
      <AdminNav />
      <div className="px-4 md:px-8 lg:px-12 h-full mx-auto my-5">
        <div className="flex flex-col items-center h-full">
          {sortedYearsData.map((yearData, yearIndex) => (
            <div key={yearIndex} className="w-full mb-12">
              {/* Year Header */}
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                {yearData.year}
              </h2>

              {/* Months Grid */}
              <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-6">
                {yearData.monthsData.map((month, monthIndex) => (
                  <div
                    key={monthIndex}
                    className="cursor-pointer transform transition hover:scale-105"
                    onClick={() =>
                      navigate(`/esh/initial/${yearData.year}/${month.name}`)
                    }
                  >
                    <div className=" h-36 w-72 flex items-center justify-center text-center p-6 rounded-xl flex-col shadow-lg">
                      <h1 className="text-2xl font-bold text-blue-900">
                        {month.name}
                      </h1>
                      <div className="mt-2">
                        <span className="text-green-700 font-medium">
                          Reviews: {month.rev}
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

export default EshInitial;
