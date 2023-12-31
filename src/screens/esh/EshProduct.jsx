import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../firebase.config';
import { getDocs, collection } from 'firebase/firestore';
import EshNav from '../../components/EshNav';
import Loader from '../../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillCartPlusFill } from 'react-icons/bs';
import Input from '../../components/Input';
import { CiMoneyCheck1 } from 'react-icons/ci';
function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getDocs(collection(db, 'eshproducts'));
        const filteredData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(filteredData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
  }, []);

  const onView = useCallback((id) => {
    navigate(`/esh/product/${id}`);
  }, [navigate]);
  const filteredProducts = products?.filter((product) =>
  product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <EshNav />
      <div className="mx-auto max-w-screen-xl my-5 h-full md:overflow-y-hidden relative w-full px-4 md:px-8 lg:px-12">
      <div className="fixed top-24 right-4 left-1 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
      <Link to={'/add-new-product-esh-money'}>
        <CiMoneyCheck1 size={64} color="red" />
      </Link>
      
    </div>
        <div className="flex justify-end mb-3">
          <Input value={searchQuery} label={"Search Products"} onChange={(e)=>setSearchQuery(e.target.value)}/>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr>
              <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Quantity Left</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Sold</th>
                <th className="px-4 py-2">Used</th>
                <th className="px-4 py-2">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product,index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 cursor-pointer"
                  onClick={() => onView(product?.id)}
                >
                  <td className="px-4 text-center py-2">{index + 1}</td>
                  <td className="px-4 text-center py-2">{product.name}</td>
                  <td className="px-4 text-center py-2">{product.quantity}</td>
                  <td className="px-4 text-center py-2">&#8358; {product.price}</td>
                  <td className="px-4 text-center py-2">{product.sold}</td>
                  <td className="px-4 text-center py-2">{product.used}</td>
                  <td className="px-4 text-center py-2">{product.added}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
          <Link to={'/esh/add-new-product'}>
            <BsFillCartPlusFill size={64} color="red" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Products;
