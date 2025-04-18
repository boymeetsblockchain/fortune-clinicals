import React, { useEffect, useState } from 'react';
import { db } from '../firebase.config';
import { getDocs, collection, updateDoc, doc, addDoc, query, where } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillCartPlusFill } from 'react-icons/bs';
import Input from '../components/Input';
import { ViewCommentModal } from '../components/products/viewCommentModal';
import CommentModal from '../components/products/commentModal';

function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCommentViewModalOpen, setIsViewCommentModalOpen] = useState(false);
  const [commentProductId, setCommentProductId] = useState(null);
  const [comments, setComments] = useState([]);
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
    setEditedData((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [field]: value,
        editedDate: new Date().toISOString(),
      },
    }));
  };

  const handleSave = async (id) => {
    try {
      const oldProduct = products.find((product) => product.id === id);
      const updatedData = {
        ...editedData[id],
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

      await updateDoc(doc(db, 'goods', id), updatedData);

      setEditingId(null);
      setEditedData({});
      navigate(0);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewComment = async (id) => {
    try {
      const q = query(collection(db, 'productcomments'), where('productId', '==', id));
      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
      setIsViewCommentModalOpen(true);
    } catch (error) {
      console.error('Error fetching comments: ', error);
    }
  };

  const openCommentModal = (id) => {
    setCommentProductId(id);
    setIsCommentModalOpen(true);
  };

  const openViewCommentModal = (id) => {
    setCommentProductId(id);
    viewComment(id);
  };

  const saveComment = async (productId, commentData) => {
    try {
      await addDoc(collection(db, 'productcomments'), {
        productId: productId,
        comment: commentData.comment,
        date: commentData.date,
      });
  
      console.log('Comment saved successfully!');
    } catch (error) {
      console.error('Error saving comment: ', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-xl my-5 h-full relative w-full px-4 md:px-8 lg:px-12">
        <div className="flex justify-end mb-3">
          <Input
            value={searchQuery}
            label={'Search Products'}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Added</th>
                <th className="px-4 py-2">Used/Sold</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts?.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-200 cursor-pointer">
                  <td className="px-4 text-center py-2">{index + 1}</td>
                  <td className="px-4 text-center py-2">
                    {editingId === product.id ? (
                      <Input
                        value={editedData[product.id]?.name || product.name}
                        onChange={(e) => handleEdit(product.id, 'name', e.target.value)}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="px-4 text-center text-sm py-2">
                    {editingId === product.id ? (
                      <Input
                        value={editedData[product.id]?.quantity || product.quantity}
                        onChange={(e) => handleEdit(product.id, 'quantity', e.target.value)}
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td className="px-4 text-center text-sm py-2">
                    {editingId === product.id ? (
                      <Input
                        value={editedData[product.id]?.price || product.price}
                        onChange={(e) => handleEdit(product.id, 'price', e.target.value)}
                      />
                    ) : (
                      product.price
                    )}
                  </td>
                  <td className="px-4 text-center text-sm py-2">
                    {editingId === product.id ? (
                      <Input
                        value={editedData[product.id]?.added || product.added}
                        onChange={(e) => handleEdit(product.id, 'added', e.target.value)}
                      />
                    ) : (
                      product.added
                    )}
                  </td>
                  <td className="px-4 text-center text-sm py-2">
                    {editingId === product.id ? (
                      <Input
                        value={editedData[product.id]?.sold || product.sold}
                        onChange={(e) => handleEdit(product.id, 'sold', e.target.value)}
                      />
                    ) : (
                      product.sold
                    )}
                  </td>
                  <td className="px-4 text-center text-xs py-2">
                    {editingId === product.id ? (
                      <Input
                        value={editedData[product.id]?.date || product.date}
                        onChange={(e) => handleEdit(product.id, 'date', e.target.value)}
                      />
                    ) : (
                      product.date
                    )}
                  </td>
                  <td className="px-4 text-center text-sm py-2">
                    {editingId === product.id ? (
                      <button
                        className="bg-green-500 px-3 py-2 rounded-md text-white"
                        onClick={() => handleSave(product.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <div className='flex flex-row gap-x-4'>
                              <button
                        className="bg-blue-500 px-3 py-2 rounded-md text-white text-xs"
                        onClick={() => setEditingId(product.id)}
                      >
                        Edit
                      </button>
                              <button
                        className="bg-pink-500 px-3 py-2 rounded-md text-white text-xs"
                        onClick={() => openCommentModal(product.id)}
                      >
                        Comment
                      </button>
                              <button
                        className="bg-purple-500 px-3 py-2 rounded-md text-white text-xs"
                        onClick={() => openViewCommentModal(product.id)}
                      >
                        View Comment
                      </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isCommentModalOpen && (
          <CommentModal
            productId={commentProductId}
            onSave={saveComment}
            onClose={() => setIsCommentModalOpen(false)}
          />
        )}
        
        {isCommentViewModalOpen && (
          <ViewCommentModal
            productId={commentProductId}
            comments={comments}
            onClose={() => setIsViewCommentModalOpen(false)}
          />
        )}

        <div className="fixed bottom-4 right-4 h-40 w-40 cursor-pointer bg-white flex justify-center items-center text-sm rounded-full shadow-lg">
          <Link to={'/add-new-product'}>
            <BsFillCartPlusFill size={64} color="red" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Products;
