// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtdj2X1Ie9TaSyBgGe_i84I2cL5_dz1C4",
  authDomain: "realestateacres-4cfaa.firebaseapp.com",
  projectId: "realestateacres-4cfaa",
  storageBucket: "realestateacres-4cfaa.appspot.com",
  messagingSenderId: "652982227526",
  appId: "1:652982227526:web:7603e823be73e2bf1af047"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const  db = getFirestore();