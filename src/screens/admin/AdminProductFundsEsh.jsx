import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import AdminNav from '../../components/AdminNav'
import Loader from '../../components/Loader';
import Input from '../../components/Input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';

function AdminProductFundEsh() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = {
      product,
      price,
      quantity,
      date,
    };
    if(!product || !price || !quantity ||!date){
      toast.error("Please fill all Fields")
    }else{
      try {
        await addDoc(collection(db, 'eshproductfunds'), formData);
        toast.success('Product saved');
        navigate(0);
      } catch (error) {
        console.error(error);
      }
    }
   
  };

  const getProductFunds = async () => {
    try {
      const data = await getDocs(collection(db, 'eshproductfunds'));
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProductFunds();
  }, []);
  const filteredProducts = data?.filter((product) =>
  product.product.toLowerCase().includes(searchQuery.toLowerCase())
);
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-screen-xl my-5 h-full md:overflow-y-hidden relative w-full px-4 text-center md:px-8 lg:px-12">
        <form className="flex justify-center max-w-xl flex-col mx-auto gap-4" onSubmit={addProduct}>
          <Input type={'text'} value={product} label={'Product Name'} onChange={(e) => setProduct(e.target.value)} />
          <Input type={'number'} value={price} label={'Price'} onChange={(e) => setPrice(e.target.value)} />
          <Input type={'number'} value={quantity} label={'Quantity'} onChange={(e) => setQuantity(e.target.value)} />
          <Input type={'date'} value={date} label={'Date'} onChange={(e) => setDate(e.target.value)} />

          <div className="flex justify-end">
            <button className="bg-[#FF5162] py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4  mt-4 hover:bg-red-700 transition">
              Add <AiOutlineArrowRight />
            </button>
          </div>
        </form>
        <div className="flex mb-4 justify-end">
      <Input
            label="Search Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>
        <div className="mt-4 ">
          <table className="min-w-full border border-collapse border-gray-200">
            <thead>
              <tr className="bg-[#FF5162] text-white">
                <th className="py-2 px-4 text-center">Product</th>
                <th className="py-2 px-4 text-center">Quantity</th>
                <th className="py-2 px-4 text-center">Price</th>
                <th className="py-2 px-4 text-center">Amount</th>
                <th className="py-2 px-4 text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="py-2 px-4 text-center">{item.product}</td>
                  <td className="py-2 px-4 text-center">{item.quantity}</td>
                  <td className="py-2 px-4 text-center">&#8358; {item.price}</td> 
                  <td className="py-2 px-4 text-center">&#8358;{item.quantity * item.price}</td>

                  <td className="py-2 px-4 text-center">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminProductFundEsh;
