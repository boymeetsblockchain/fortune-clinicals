import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { getDoc, doc, updateDoc} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
      const docRef = doc(db, 'eshproducts', params.id);
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
      }
      
    };
   
    getProduct();
  }, [params.id]);
  
  

  const navigate= useNavigate()
 

  const updateProduct = async (e) => {
    e.preventDefault();
  
    try {
      // Check if any of the input values have changed
    
      const priceChanged = price !== product.price;
      const soldChanged = sold !== product.sold;
      const usedChanged = used !== product.used;
      const addedChanged = added !== product.added;
      const quantityChanged =  priceChanged || soldChanged || usedChanged || addedChanged;
  
      // Calculate the new quantity based on sold, added, and used values
      const newQuantity = quantityChanged
        ? parseInt(quantity) + parseInt(added) - (parseInt(sold) + parseInt(used))
        : product.quantity; // Use the current quantity if it hasn't changed
  
      // Create an object to hold the updated fields
      const updatedFields = {};
  
      // Check if the values have changed and update the corresponding field
     
      if (priceChanged) {
        updatedFields.price = price;
      }
  
      if (quantityChanged) {
        updatedFields.quantity = newQuantity;
      }
  
      if (comment !== product.comment) {
        updatedFields.comment = comment;
      }
  
      if (soldChanged) {
        updatedFields.sold = sold;
      }
  
      if (usedChanged) {
        updatedFields.used = used;
      }
  
      if (addedChanged) {
        updatedFields.added = added;
      }
  
      // Update the product data in Firestore with the updated fields
      const docRef = doc(db, 'eshproducts', params.id);
      await updateDoc(docRef, updatedFields);
      toast.success("Product Updated");
      navigate('/dashboard/products');
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
      <h2 className='capitalize text-3xl text-center '>{product.comment}</h2>
        <h1 className="text-center my-6 font-bold text-3xl capitalize">Edit {product?.name}</h1>
    
        <form className="flex flex-col space-y-4 justify-center w-full mx-auto">
          <Input label="Product Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input label="Used" type={"number"} value={used} onChange={(e)=>setUsed(e.target.value)}/>
            <Input label="Added" type={"number"} value={added} onChange={(e)=>setAdded(e.target.value)}/>
            <Input label="Sold" type={"number"} value={sold} onChange={(e)=>setSold(e.target.value)}/>
            <Input label="Comment" type={"text"} value={comment} onChange={(e)=>setComment(e.target.value)}/>
         
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
