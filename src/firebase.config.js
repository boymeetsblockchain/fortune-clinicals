// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9x3nroQN8jXEpBjA3eySdnJNscdgqcCI",
  authDomain: "fortune-app-48297.firebaseapp.com",
  projectId: "fortune-app-48297",
  storageBucket: "fortune-app-48297.appspot.com",
  messagingSenderId: "77823359549",
  appId: "1:77823359549:web:daaccb72b41dc7be294854",
  measurementId: "G-R4T6RK6J9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  const db = getFirestore(app)