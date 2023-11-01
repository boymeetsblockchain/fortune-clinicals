import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import { collection, doc,getDocs,deleteDoc } from 'firebase/firestore'; // Import Firestore components from Firebase
import { db } from '../../firebase.config'; // Import your Firebase configuration
import {FaTrash} from 'react-icons/fa'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function AdminUser() {
  const [users, setUsers] = useState([]);
  const navigate= useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users'); // Replace 'users' with your Firestore collection name
        const usersSnapshot = await getDocs(usersCollection);
        const userList = [];
  
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          // Include the document ID in the user data
          const userWithId = {
            id: doc.id,
            ...userData,
          };
          userList.push(userWithId);
        });
  
        setUsers(userList);
        console.log(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);
  

  const deleteUser = async (userId) => {
    console.log(userId)
    try {
      const userDocRef = doc(db, 'users', userId); // Replace 'users' with your Firestore collection name
      await deleteDoc(userDocRef);
      toast.success(`User  has been deleted.`);
      navigate(0)
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
        <h1 className="text-3xl font-bold mb-4">User List</h1>
        <ul className='grid grid-cols-3 gap-4 '>
          {users.map((user, index) => (
            <li key={index} className='bg-[#FF5162] h-20 w-auto flex items-center justify-center text-white' >
              <p>{user.displayName}</p>
              <p>{user.email}</p>
               <FaTrash onClick={()=>deleteUser(user.id)} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AdminUser;
