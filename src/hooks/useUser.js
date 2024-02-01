import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';

function useUser() {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      // User role is already in local storage, use it directly
      setUser({ role: storedUserRole });
    } else {
      // User role is not in local storage, fetch it from Firebase
      const getUser = async () => {
        if (auth.currentUser) {
          const docRef = doc(db, 'users', auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userRole = docSnap.data().isESH ? 'isESH' : 'user';
            localStorage.setItem('userRole', userRole); // Store user role in local storage
            setUser({ role: userRole });
          }
        }
      };
      getUser();
    }
  }, []);

  return user;
}

function useUserRole(user) {
  if (!user) {
    return 'loading';
  }

  return user.role; 
}

export { useUser, useUserRole };
