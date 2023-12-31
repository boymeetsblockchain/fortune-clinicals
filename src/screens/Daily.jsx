import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { addDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

function Daily() {
  const [daily, setDaily] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [expensesData, setExpensesData] = useState([]); // State to store fetched data
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const navigate = useNavigate();
  const auth = getAuth();

  const saveDaily = async (e) => {
    e.preventDefault();
    const dailyCopy = {
      daily,
      date,
      price, // You were missing this in your code
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
    };

    try {
        if(!daily || !price || !date){
            toast.error("Please fill in all Fields")
        }else{
            const data = await addDoc(collection(db, 'dailys'), dailyCopy);
            console.log(data);
            toast.success('Expenses saved');
            setDaily('');
            setDate('');
            setPrice('');
            navigate(0); // Use the correct navigation path
        }

    } catch (error) {
      console.log(error);
    }
  };

  const getDaily = async () => {
    try {
      const data = await getDocs(collection(db, 'dailys'));
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
  };

  useEffect(() => {
    getDaily();
  }, []);

  const filteredNotes = expensesData.filter((noteItem) => {
    // Convert both the note and the search query to lowercase for a case-insensitive search
    const noteText = noteItem.daily.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    // Check if the note contains the search query
    return noteText.includes(query);
  });
  if (loading) return <Loader />;

  return (
    <>
      {/* <Navbar /> */}
      <div className="h-auto w-full flex flex-col max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12">
      <div className="flex justify-end mt-4">
      <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none mb"
        />
      </div>
         <div className='flex items-start my-3'>
         <button className='bg-[#ff5162]  text-white py-3 inline-block px-6 rounded-lg' onClick={()=>navigate(-1)}>
          back
        </button>
         </div>
        <form onSubmit={saveDaily} className="my-3 flex flex-col gap-y-3">
            <h1 className='text-center font-bold text-3xl'>Add Daily Expenses</h1>
          <Input label="Add  Daily Expense" type="text" value={daily} onChange={(e) => setDaily(e.target.value)} />
          <Input label="Add the price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input label="Pick a date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <div className="flex justify-end">
            <button className="bg-[#FF5162] py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition">
              Add new Expense <AiOutlineArrowRight />
            </button>
          </div>
        </form>

        {/* Display the fetched expenses data */}
        <div>
          <h2 className='text-center font-bold text-3xl mb-2'>Expenses List</h2>
          <div>
  {filteredNotes.map((expense) => (
    <div key={expense.id} className='bg-red-500 text-white p-4 rounded-lg mb-4'>
      <p className='text-lg capitalize'>{expense.daily}</p>
      <p className='text-xl'>amount : &#8358;{expense.price}</p>
      <p className='text-sm'>date: {expense.date}</p>
    </div>
  ))}
</div>

        </div>
      </div>
    </>
  );
}

export default Daily;
