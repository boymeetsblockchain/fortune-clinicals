import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../../firebase.config';
import { getDocs, collection } from 'firebase/firestore';
import Loader from '../../../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillCartPlusFill } from 'react-icons/bs';
import Input from '../../../components/Input';
import {CiMoneyCheck1} from 'react-icons/ci'

function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

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

  // Filter products based on the search query
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-xl my-5 h-full md:overflow-y-hidden relative w-full px-1 md:px-4 md:px-8 lg:px-12">
      <div className="fixed top-24 right-4 left-1 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
          <Link to={'/add-new-product-esh-money'}>
            <CiMoneyCheck1 size={64} color="red" />
          </Link>
          
        </div>
        <div className="flex justify-end mb-4">
          <Input
            label="Search Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr>
                <th className="px-1 md:px-4 py-2 text-sm md:text-lg">No.</th>
                <th className="px-1 md:px-4 py-2 text-sm md:text-lg">Name</th>
                <th className="px-1 md:px-4 py-2 text-sm md:text-lg">Quantity Left</th>
                <th className="px-1 md:px-4 py-2 text-sm md:text-lg">Price</th>
                <th className="px-1 md:px-4 py-2 text-sm md:text-lg">Sold</th>
                <th className="px-1 md:px-4 py-2 text-sm md:text-lg">Used</th>
                <th className="px-1 md:px-4 py-2 text-sm md:text-lg">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 cursor-pointer"
                  onClick={() => onView(product.id)}
                >
                  <td className="px-1 md:px-4 text-center py-2 text-sm md:text-lg">{index + 1}</td>
                  <td className="px-1 md:px-4 text-center py-2 text-sm md:text-lg">{product.name}</td>
                  <td className="px-1 md:px-4 text-center py-2 text-sm md:text-lg">{product.quantity}</td>
                  <td className="px-1 md:px-4 text-center py-2 text-sm md:text-lg">&#8358; {product.price}</td>
                  <td className="px-1 md:px-4 text-center py-2 text-sm md:text-lg">{product.sold}</td>
                  <td className="px-1 md:px-4 text-center py-2 text-sm md:text-lg">{product.used}</td>
                  <td className="px-1 md:px-4 text-center py-2 text-sm md:text-lg">{product.added}</td>
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
