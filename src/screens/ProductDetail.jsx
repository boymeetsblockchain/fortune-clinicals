import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function ProductDetail() {
  // Default values or handle undefined values
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [comment, setComment] = useState('');
  const [sold, setSold] = useState('');
  const [used, setUsed] = useState('');
  const [added, setAdded] = useState('');

  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  useEffect(() => {
    const getProduct = async () => {
      const docRef = doc(db, 'products', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct(data);
        setLoading(false);
        setName(data.name || '');
        setPrice(data.price || 0);
        setQuantity(data.quantity || 0);
        setComment(data.comment || '');
        setAdded(data.added || 0);
        setUsed(data.used || 0);
        setSold(data.sold ||0 );
      }
    };

    getProduct();
  }, [params.id]);

  const navigate = useNavigate();

  const updateProduct = async (e) => {
    e.preventDefault();
  
    try {
      const docRef = doc(db, 'products', params.id);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        toast.error('Product does not exist.');
        return;
      }
  
      const existingData = docSnap.data();
  
      // Create an object to hold the updated fields
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
      const newQuantity =
        existingData.quantity + (updatedFields.added || 0) -((updatedFields.sold || 0) + (updatedFields.used || 0)) ;
  
      if (newQuantity !== existingData.quantity) {
        updatedFields.quantity = newQuantity;
      }
  
      if (comment !== existingData.comment) {
        updatedFields.comment = comment;
      }
  
      // Update Firestore document with the updated fields
      if (Object.keys(updatedFields).length > 0) {
        await updateDoc(docRef, updatedFields);
        toast.success('Product Updated');
        navigate('/dashboard/products');
      } else {
        toast.info('No changes to update.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
        <h1 className="text-center my-6 font-bold text-3xl capitalize">Edit {product?.name}</h1>
        <form className="flex flex-col space-y-4 justify-center w-full mx-auto">
          <p className="text-base text-gray-700 mt-2">{product.comment}</p>
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
          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        
          <Input label="Added" type="number" value={added} onChange={(e) => setAdded(e.target.value)} />
          <p className="text-grat-700 ml-4 mt-2"> added: <span className="text-green-500">{product.added}</span></p>
          <Input label="Used" type="number" value={used} onChange={(e) => setUsed(e.target.value)} />
          <p className="text-base text-gray-700 mt-2 ml-4">used: <span className="text-green-500">{product.used}</span></p>
          <Input label="Sold" type="number" value={sold} onChange={(e) => setSold(e.target.value)} />
          <p className="text-base text-gray-700 mt-2 ml-4">sold: <span className='text-green-500'>{product.sold}</span></p>
          <Input label="Comment" type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
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
      </div>
    </>
  );
}

export default ProductDetail;
