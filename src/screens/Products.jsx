import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase.config';
import { getDocs, collection } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillCartPlusFill } from 'react-icons/bs';

function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getDocs(collection(db, 'products'));
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
    navigate(`/dashboard/product/${id}`);
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-xl my-5 h-full md:overflow-y-hidden relative w-full px-4 md:px-8 lg:px-12">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Quantity Left</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Sold</th>
                <th className="px-4 py-2">Used</th>
                <th className="px-4 py-2">Added</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 cursor-pointer"
                  onClick={() => onView(product?.id)}
                >
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2">&#8358; {product.price}</td>
                  <td className="px-4 py-2">{product.sold}</td>
                  <td className="px-4 py-2">{product.used}</td>
                  <td className="px-4 py-2">{product.added}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center rounded-full shadow-lg">
          <Link to={'/add-new-product'}>
            <BsFillCartPlusFill size={64} color="red" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Products;
