import React, { useState } from 'react'
import Input from '../components/Input'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { toast } from 'react-hot-toast'
import { getAuth } from 'firebase/auth'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'

function AddNewProduct() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    quantity: 0,
    sold: 0,
    used: 0,
    added: 0,
  });

  const auth = getAuth()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();

    // Validate input fields as numbers
    const isNumeric = (value) => {
      return !isNaN(parseFloat(value)) && isFinite(value);
    };

    const { name, price, quantity, used, added, sold } = formData;

    if (
      !isNumeric(price) ||
      !isNumeric(quantity) ||
      !isNumeric(used) ||
      !isNumeric(added) ||
      !isNumeric(sold)
    ) {
      toast.error("Please enter valid numbers for Price, Quantity, Used, Added, and Sold.");
      return;
    }

    try {
      const formDataCopy = {
        name,
        price: parseFloat(price), // Convert to a number
        quantity: parseInt(quantity),  
        sold: parseInt(sold),  
        added: parseInt(added),  
        used: parseInt(used),  
        timestamp: serverTimestamp(),
        userId: auth?.currentUser?.uid,
      };

      console.log("Form Data: ", formDataCopy);

      const data = await addDoc(collection(db, 'products'), formDataCopy);

      toast.success("Product saved");
      navigate(-1);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding product");
    }
  };

  return (
    <>
      {/* <AdminNav/> */}
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
        <h1 className='text-center my-6 font-bold text-3xl capitalize'>Add new Product</h1>
        <form className='flex flex-col space-y-4 justify-center w-full mx-auto' onSubmit={addProduct}>
          <Input label="Product Name" type={"text"} name="name" value={formData.name} onChange={handleChange} />
          <Input label="Price" type={"number"} name="price" value={formData.price} onChange={handleChange} />
          <Input label="Quantity" type={"number"} name="quantity" value={formData.quantity} onChange={handleChange} />
          <Input label="Used" type={"number"} name="used" value={formData.used} onChange={handleChange} />
          <Input label="Added" type={"number"} name="added" value={formData.added} onChange={handleChange} />
          <Input label="Sold" type={"number"} name="sold" value={formData.sold} onChange={handleChange} />

          <div className="flex justify-end">
            <button className="bg-[#FF5162] py-3 flex items-center justify-center gap-x-2 text-white text-sm rounded-md w-1/4 mt-4 hover:bg-red-700 transition">
              Add new Product <AiOutlineArrowRight />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddNewProduct
