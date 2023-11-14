import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import { collection, doc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AdminUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const userList = [];

        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          const userWithId = {
            id: doc.id,
            ...userData,
          };
          userList.push(userWithId);
        });

        setUsers(userList);
        console.log(userList)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
  
    if (confirmDelete) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
        toast.success(`User has been deleted.`);
        navigate(0);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  const updateIsESH = async (userId) => {
    const confirmUpdate = window.confirm('Are you sure you want to set this user to ESH?');
  
    if (confirmUpdate) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          isESH: true,
        });
        toast.success(`User set to ESH`);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };
  

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-screen-xl py-4 h-full w-full px-4 relative md:px-8 lg:px-12">
        <h1 className="text-3xl font-bold mb-4">User List</h1>
        <ul className='grid grid-cols-3 gap-4 '>
        {users
  .filter(user => !user.isAdmin) 
  .map((user, index) => (
    <li
      key={index}
      className={`${user.isESH ? "bg-green-400" : "bg-[#FF5162]"} h-20 w-auto flex items-center gap-3 justify-center text-white`}
    >
      <p>{user.displayName}</p>
      <p>{user.email}</p>
      {!user.isESH ? (
        <button  className='bg-blue-400 cursor-pointer p-2 text-xs  rounded-md'
        onClick={() => updateIsESH(user.id)} >
          ESH
        </button>
      ) : null}
      
      <FaTrash onClick={() => deleteUser(user.id)} className='cursor-pointer' />
    </li>
  ))}

        </ul>
      </div>
    </>
  );
}

export default AdminUser;
