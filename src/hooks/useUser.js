import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';

function useUser() {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      }
    };
    getUser();
  }, [auth.currentUser]);

  return user;
}

function useUserRole(user) {
  if (!user) {
    return 'loading';
  }

  if (user.isEsh) {
    return 'isEsh';
  }

  if(user.admin){
    return "admin"
  }

  return 'user';
}

export { useUser, useUserRole };
