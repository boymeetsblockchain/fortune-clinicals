import { db } from "../firebase.config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export const fetchFeeTable = async (tableName) => {
  const data = await getDocs(collection(db, tableName));
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateFee = async (tableName, id, newFee) => {
  await updateDoc(doc(db, tableName, id), { fee: newFee });
};
