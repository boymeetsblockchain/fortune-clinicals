import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { getDoc, doc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ImBin } from 'react-icons/im';
function ProductDetail() {
    // Default values or handle undefined values
const [name, setName] = useState( '');
const [price, setPrice] = useState('');
const [quantity, setQuantity] = useState('');
const [comment, setComment] = useState('');
const [sold,setSold]= useState("")
const [used,setUsed]= useState("")
const [added,setAdded]= useState("")
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
        setPrice(data.price || '');
        setQuantity(data.quantity || '');
        setComment(data.comment || '');
        setAdded(data.added || "")
        setUsed(data.used || "")
        setSold(data.sold || "")
        console.log(data);
      }
    };
    getProduct();
  }, [params.id]);
  
  

  const navigate= useNavigate()
 

  const updateProduct = async (e) => {
    e.preventDefault();
  
    try {
      // Calculate the new quantity based on sold, added, and used values
      const newQuantity = parseInt(quantity) + parseInt(added) - (parseInt(sold) + parseInt(used));
  
      // Update the product data in Firestore, including the new quantity
      const docRef = doc(db, 'products', params.id);
      await updateDoc(docRef, {
        name: name,
        price: price,
        quantity: newQuantity, // Update the quantity with the calculated value
        comment: comment,
        sold: sold, // You can include other fields here as well
        used: used,
        added: added,
      });
  
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  
  
  
  const deleteProduct = async () => {
    try {
      // Display a confirmation dialog to the user
      const confirmed = window.confirm('Are you sure you want to delete this product?');
      
      if (confirmed) {
        const productRef = doc(db, 'products', params.id); // Replace 'products' with your Firestore collection name
        await deleteDoc(productRef);
        toast.success('Product deleted successfully');
        // Redirect to the product list page or any other desired action
        navigate('/dashboard/products');
      } else {
        toast.success('Product deletion canceled by the user');
      }
    } catch (error) {
      toast.error('Error deleting product:', error);
    }
  };
  
  const addComment = async (newComment) => {
    try {
      const productRef = doc(db, 'products', params.id); // Replace 'productId' with the ID of the product you're updating
      await updateDoc(productRef, {
        comments: arrayUnion(newComment), // Add the new comment to the 'comments' array
      });
      console.log("Comment added");
    } catch (error) {
      console.error("Error adding comment: ", error);
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
        <div className="flex justify-center">
        <button className="bg-[#FF5162] mb-4  py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition"
        onClick={deleteProduct}>
                delete Product <ImBin/>
            </button>
        </div>
        <form className="flex flex-col space-y-4 justify-center w-full mx-auto">
          <Input label="Product Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input label="Used" type={"number"} value={used} onChange={(e)=>setUsed(e.target.value)}/>
            <Input label="Added" type={"number"} value={added} onChange={(e)=>setAdded(e.target.value)}/>
            <Input label="Sold" type={"number"} value={sold} onChange={(e)=>setSold(e.target.value)}/>
          
         <h2 className='capitalize'>{product.comment}</h2>
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
