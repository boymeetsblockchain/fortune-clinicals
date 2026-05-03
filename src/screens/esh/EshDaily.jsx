import React, { useState, useEffect, useCallback } from 'react';
import EshNav from '../../components/EshNav';
import Input from '../../components/Input';
import { db } from '../../firebase.config';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { AiOutlineArrowRight, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { HiOutlineArrowLeft, HiOutlineCash } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

function EshDaily() {
  const [daily, setDaily] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [expensesData, setExpensesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const getDaily = useCallback(async () => {
    try {
      const data = await getDocs(collection(db, 'eshdailys'));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      setExpensesData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getDaily();
  }, [getDaily]);

  const saveDaily = async (e) => {
    e.preventDefault();
    if (!daily || !price || !date) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const dailyCopy = {
      daily,
      date,
      price,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
    };

    try {
      await addDoc(collection(db, 'eshdailys'), dailyCopy);
      toast.success('ESH Expense recorded');
      setDaily('');
      setDate('');
      setPrice('');
      getDaily();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save expense");
    }
  };

  const filteredExpenses = expensesData.filter((item) => {
    const text = item.daily.toLowerCase();
    const query = searchQuery.toLowerCase();
    return text.includes(query);
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50">
      <EshNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex items-center gap-6 mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-white text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm border border-slate-100 group"
          >
            <HiOutlineArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ESH Expenditures</h1>
            <p className="text-slate-500 font-medium text-sm">Track and manage ESH-specific clinical expenses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Record ESH Expense</h2>
              <form onSubmit={saveDaily} className="space-y-6">
                <Input label="Description" placeholder="e.g., ESH medical supplies" value={daily} onChange={(e) => setDaily(e.target.value)} />
                <Input label="Amount (₦)" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 py-4 flex items-center justify-center gap-2 text-white font-bold rounded-2xl shadow-xl shadow-emerald-50 hover:bg-emerald-600 transition-all active:scale-[0.98]"
                >
                  <AiOutlinePlus /> Save Expense
                </button>
              </form>
            </div>
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Expense History</h2>
              </div>
              <div className="relative w-full md:w-72">
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <AiOutlineSearch size={18} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <div 
                    key={expense.id} 
                    className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-200/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <HiOutlineCash size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {expense.date}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-6">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors capitalize">
                        {expense.daily}
                      </h3>
                      <p className="text-2xl font-black text-slate-800 tracking-tight">
                        ₦{parseFloat(expense.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[9px] text-slate-300 font-medium uppercase tracking-tighter">Verified ESH Expenditure</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium">No ESH expenses found matching your search.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default EshDaily;
