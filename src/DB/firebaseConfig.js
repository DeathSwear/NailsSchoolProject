// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and latr, measurementId is optionale
const firebaseConfig = {
  apiKey: "AIzaSyAOx6IIyjKncI1ncug-CiL5SacJc9ZGZag",
  authDomain: "nails-reactnative.firebaseapp.com",
  projectId: "nails-reactnative",
  storageBucket: "nails-reactnative.appspot.com",
  messagingSenderId: "521965448859",
  appId: "1:521965448859:web:942adbfd80d7d21c00e03e",
  measurementId: "G-RR0YCZQEC6"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
//const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORE = getFirestore(FIREBASE_APP);

