import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { getDoc, doc, updateDoc, addDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import EshNav from '../../components/EshNav';
import Input from '../../components/Input';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Loader from '../../components/Loader';
import { useNavigate, } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function ProductDetail() {
  // Default values or handle undefined values
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sold, setSold] = useState('');
  const [used, setUsed] = useState('');
  const [added, setAdded] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newCommentDate, setNewCommentDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const params = useParams();
  useEffect(() => {
    const getProduct = async () => {
      const docRef = doc(db, 'eshproducts', params.id);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data)
        setProduct(data);
        setLoading(false);
        setName(data.name || '');
        setPrice(data.price || 0);
        setQuantity(data.quantity || 0);
        setAdded(data.added || 0);
        setUsed(data.used || 0);
        setSold(data.sold ||0 );
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
         console.log(commentsData)
        setComments(commentsData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    
    
    getComments()
    getProduct();
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
  
      const updatedFields = {};
  
      if (parseInt(sold) !== existingData.sold) {
        updatedFields.sold = parseInt(sold);
      }
  
      if (parseInt(used) !== existingData.used) {
        updatedFields.used = parseInt(used);
      }
  
      if (parseInt(added) !== existingData.added) {
        updatedFields.added = parseInt(added);
      }
  
      // Calculate the new quantity
      const newQuantity = (existingData.quantity || 0) + 
                         (updatedFields.added || 0) - 
                         (updatedFields.sold || 0) - 
                         (updatedFields.used || 0);
  
      if (newQuantity >= 0) {
        updatedFields.quantity = newQuantity;
      } else {
        toast.error('Quantity cannot be negative.');
        return;
      }
  
      if (Object.keys(updatedFields).length > 0) {
        await updateDoc(docRef, updatedFields);
        toast.success('Product Updated');
        navigate(-1);
      } else {
        toast.error('No changes to update.');
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
          productID:params.id
        };

        // Add the comment to the Firestore collection
        const docRef = await addDoc(collection(db, 'comments'), commentData);
        console.log('Payment added with ID:', docRef.id);
        toast.success("Added successfully")
        navigate(0)
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
      {/* <EshNav /> */}
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
        <h1 className="text-center my-6 font-bold text-3xl capitalize">Edit {product?.name}</h1>
        <form className="flex flex-col space-y-4 justify-center w-full mx-auto">
          <Input label="Product Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Price"
            type="number"
            value={price}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                setPrice(e.target.value);
              } else {
                console.error('Invalid input for Price');
              }
            }}
          />
          <p className='text-base text-gray-700 mt-2 ml-4 '> previous price :&#8358; <span className="text-green-500">{product.price}</span></p>
          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        
          <Input label="Added" type="number" value={added} onChange={(e) => setAdded(e.target.value)} />
          <p className="text-grat-700 ml-4 mt-2"> added: <span className="text-green-500">{product.added}</span></p>
          <Input label="Used" type="number" value={used} onChange={(e) => setUsed(e.target.value)} />
          <p className="text-base text-gray-700 mt-2 ml-4">used: <span className="text-green-500">{product.used}</span></p>
          <Input label="Sold" type="number" value={sold} onChange={(e) => setSold(e.target.value)} />
          <p className="text-base text-gray-700 mt-2 ml-4">sold: <span className='text-green-500'>{product.sold}</span></p>
          <div className="flex justify-end">
            <button
              onClick={updateProduct}
              className="bg-green-500 py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-green-700 transition"
              type="submit"
            >
              Update Product <AiOutlineArrowRight />
            </button>
          </div>
         
        </form>
        <div className="comment-section">
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
              className="bg-blue-500 py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-green-700 transition"
              type="submit"
            >
              Add a comment <AiOutlineArrowRight />
            </button>
            </div>

            <div className="comment-show my-5">
            {
  comments.map((comment) => (
    <div key={comment.id} className="border rounded flex  justify-between items-center p-2 mb-2">
      <p className="text-gray-700">{comment.comment}</p>
      <p className="text-red-600 text-sm">{comment.date}</p>
    </div>
  ))
}

            </div>

      </div>
    </>
  );
}

export default ProductDetail;