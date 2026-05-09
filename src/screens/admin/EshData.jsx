import useEshData from "../../hooks/useEshData";
import AdminNav from "../../components/AdminNav";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { AiOutlineCalendar, AiOutlineArrowRight } from "react-icons/ai";
import { BsLayers } from "react-icons/bs";

const EshData = () => {
  const navigate = useNavigate();
  const { yearsData } = useEshData();

  if (!yearsData) {
    return <Loader />;
  }

  // Sort yearsData to show the current year first
  const currentYear = new Date().getFullYear();
  const sortedYearsData = [...yearsData].sort((a, b) => {
    const yA = parseInt(a.year);
    const yB = parseInt(b.year);
    if (yA === currentYear) return -1;
    if (yB === currentYear) return 1;
    return yB - yA;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
            <BsLayers size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            ESH Clinical Data Archive
          </h1>
          <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
            Access historical session records and daily breakdowns organized by year and month. 
            Select a period below to view detailed clinical metrics.
          </p>
        </div>

        <div className="space-y-20">
          {sortedYearsData.map((yearData) => (
            <div key={yearData.year} className="relative">
              {/* Year Divider */}
              <div className="flex items-center gap-6 mb-10">
                <div className={`px-8 py-3 rounded-2xl text-2xl font-black shadow-xl relative z-10 border-4 border-white ${
                  parseInt(yearData.year) === currentYear 
                    ? "bg-slate-900 text-white" 
                    : "bg-white text-slate-400"
                }`}>
                  {yearData.year}
                </div>
                <div className="h-[2px] flex-1 bg-slate-200 rounded-full opacity-50"></div>
                {parseInt(yearData.year) === currentYear && (
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                    Active Period
                  </span>
                )}
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {yearData.monthsData.map((month, index) => (
                  <div
                    key={index}
                    className="group relative cursor-pointer"
                    onClick={() => navigate(`/esh/${yearData.year}/${month.name}`)}
                  >
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-200/40 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center justify-center text-center overflow-hidden">
                      {/* Decorative Background Blur */}
                      <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
                      
                      <div className="relative z-10 w-full">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                          <AiOutlineCalendar size={24} />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                          {month.name}
                        </h3>
                        
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions</span>
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-100">
                            {month?.ses}
                          </span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 group-hover:text-emerald-500 transition-all uppercase tracking-[0.2em]">
                          View Report <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {sortedYearsData.length === 0 && (
          <div className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
              <BsLayers size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">No Data Found</h3>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
              We couldn't find any ESH clinical data in the archive yet. 
              New data will appear here automatically as sessions are recorded.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EshData;
