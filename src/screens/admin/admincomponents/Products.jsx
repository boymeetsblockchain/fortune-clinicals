import React, { useEffect, useState} from 'react';
import { db } from '../../../firebase.config';
import { getDocs, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Loader from '../../../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillCartPlusFill } from 'react-icons/bs';
import Input from '../../../components/Input';



function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedComments, setEditedComments] = useState({});
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getDocs(collection(db, 'goods'));
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


  const handleEdit = (id, field, value) => {
    setEditingId(id);
    setEditedData(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [field]: value,
        editedDate: new Date().toISOString() // Add editedDate property with current date and time
      }
    }));
  };

  const handleEditComment = (id, value) => {
    setEditedComments(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSave = async (id) => {
    try {
      const oldProduct = products.find((product) => product.id === id);
      
      // Ensure that the comment field is never undefined
      const updatedData = {
        ...editedData[id],
        comment: editedComments[id] !== undefined ? editedComments[id] : oldProduct.comment,
        editedDate: new Date().toISOString(),
      };
  
      const oldQuantity = parseFloat(oldProduct.quantity);
      const added = parseFloat(updatedData.added);
      const sold = parseFloat(updatedData.sold);
  
      if (!isNaN(added)) {
        updatedData.quantity = oldQuantity + added;
      } else if (!isNaN(sold)) {
        updatedData.quantity = oldQuantity - sold;
      } else {
        updatedData.quantity = oldQuantity;
      }
  
      // Remove fields that are undefined from updatedData
      Object.keys(updatedData).forEach(key => {
        if (updatedData[key] === undefined) {
          delete updatedData[key];
        }
      });
  
      await updateDoc(doc(db, 'goods', id), updatedData);
  
      setEditingId(null);
      setEditedData({});
      setEditedComments({});
      navigate(0);
    } catch (error) {
      console.error(error);
    }
  }
  

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'goods', id));
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-xl my-5 h-full md:overflow-y-hidden relative w-full  px-4 md:px-8 lg:px-12">
        <div className='flex justify-end mb-4'>
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
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">No.</th>
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">Name</th>
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">Quantity Left</th>
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">Price</th>
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">Sold</th>
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">Used</th>
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">Added</th>
                <th className=" px-1 md:px-4 py-2 text-sm md:text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-200 cursor-pointer">
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">{index + 1}</td>
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">
                    {editingId === product.id ? (
                      <Input
                        value={editedData[product.id]?.name || product.name}
                        onChange={(e) => handleEdit(product.id, 'name', e.target.value)}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">
                    {editingId === product.id ? (
                      <Input value={editedData[product.id]?.quantity || product.quantity} onChange={(e) => handleEdit(product.id, 'quantity', e.target.value)} />
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">
                    {editingId === product.id ? (
                      <Input value={editedData[product.id]?.price || product.price} onChange={(e) => handleEdit(product.id, 'price', e.target.value)} />
                    ) : (
                      product.price
                    )}
                  </td>
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">
                    {editingId === product.id ? (
                      <Input value={editedData[product.id]?.sold || product.sold} onChange={(e) => handleEdit(product.id, 'sold', e.target.value)} />
                    ) : (
                      product.sold
                    )}
                  </td>
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">
                    {editingId === product.id ? (
                      <Input value={editedData[product.id]?.used || product.used} onChange={(e) => handleEdit(product.id, 'used', e.target.value)} />
                    ) : (
                      product.used
                    )}
                  </td>
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">
                    {editingId === product.id ? (
                      <Input value={editedData[product.id]?.added || product.added} onChange={(e) => handleEdit(product.id, 'added', e.target.value)} />
                    ) : (
                      product.added
                    )}
                  </td>
                  <td className=" px-1 md:px-4 text-center py-2 text-sm md:text-lg">
                    {editingId === product.id ? (
                      <button className='bg-green-500 px-3 py-2 rounded-md text-white' onClick={() => handleSave(product.id)}>Save</button>
                    ) : (
                      <button className='bg-blue-500 px-3 py-2 rounded-md text-white' onClick={() => setEditingId(product.id)}>Edit</button>
                    )}
                  </td>
                  <td className=" px-1 md:px-4 text-center text-sm py-2">
                    {editingId === product.id ? (
                      <button className='bg-red-500 px-3 py-2 rounded-md text-white' onClick={() => handleDelete(product.id)}>Delete</button>
                    ) : null}
                  </td>
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
