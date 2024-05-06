
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { getDoc, doc, updateDoc, addDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Input from '../../components/Input';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function ProductDetail() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newCommentDate, setNewCommentDate] = useState('');
  const params = useParams();


  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      const docRef = doc(db, 'eshproducts', params.id);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLoading(false);
        setProduct(data);
        setName(data.name || '');
        setPrice(data.price || 0);
        setQuantity(data.quantity || 0);
      }
    };
    
    const getComments = async () => {
      try {
        const commentsQuery = query(collection(db, 'comments'), where('productID', '==', params.id));
        const querySnapshot = await getDocs(commentsQuery);
        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        commentsData.sort((a, b) => {
          const dateA = new Date(a.newCommentDate);
          const dateB = new Date(b.newCommentDate);
          return dateB - dateA;
        });
        
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      }
    };
    
    getProduct();
    getComments();
  }, [params.id]);

  const navigate = useNavigate();

  const updateProduct = async (e) => {
    e.preventDefault();
  
    try {
      const docRef = doc(db, 'eshproducts', params.id);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        toast.error('Product does not exist.');
        return;
      }
  
      const existingData = docSnap.data();
  
      // Calculate the new quantity
      const newQuantity = parseInt(quantity);

      if (newQuantity >= 0) {
        await updateDoc(docRef, { quantity: newQuantity });
        toast.success('Product Updated');
        navigate(-1);
      } else {
        toast.error('Quantity cannot be negative.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const addComment = async () => {
    try {
      if (!newComment || !newCommentDate) {
        toast.error('Please fill in all fields for the comment.');
      } else {
        const commentData = {
          comment: newComment,
          date: newCommentDate,
          productID: params.id
        };

        // Add the comment to the Firestore collection
        const docRef = await addDoc(collection(db, 'comments'), commentData);
        toast.success("Comment added successfully");
        navigate(0);

        // Clear the input fields
        setNewComment('');
        setNewCommentDate('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
        <h1 className="text-center my-6 font-bold text-3xl capitalize">Edit {name}</h1>
        <form className="flex flex-col space-y-4 justify-center w-full mx-auto">
          <Input label="Product Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
             <div className='flex flex-col '>
             <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <div className="buttons flex justify-between ">
              <button type="button" 
              className="bg-green-500 py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-green-700 transition"
              onClick={handleIncrease}>Increase</button>
         <button type="button" 
         className="bg-red-500 py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition"
         onClick={handleDecrease}>Decrease</button>
              </div>
             </div>

      
          <div className="flex justify-end">
            <button
              onClick={updateProduct}
              className="bg-yellow-500 py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-yellow-700 transition"
              type="submit"
            >
              Update Product <AiOutlineArrowRight />
            </button>
          </div>
        </form>
        
        <div className="comment-section flex flex-col space-y-5  mt-8">
          <Input
            label="Add a Comment"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Input
            label="Add the Date"
            type="date"
            value={newCommentDate}
            onChange={(e) => setNewCommentDate(e.target.value)}
          />
          <button
            onClick={addComment}
            className="bg-blue-500 py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-blue-700 transition"
            type="submit"
          >
            Add Comment <AiOutlineArrowRight />
          </button>
        </div>

        <div className="comment-show my-5">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded flex justify-between items-center p-2 mb-2">
              <p className="text-gray-700">{comment.comment}</p>
              <p className="text-red-600 text-sm">{comment.date}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
