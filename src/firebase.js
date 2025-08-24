// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyB4yToRBANxHTKf76kTUguoGtVi6hpjxdk",
  authDomain: "carrerflow-b4eb6.firebaseapp.com",
  projectId: "carrerflow-b4eb6",
  storageBucket: "carrerflow-b4eb6.firebasestorage.app",
  messagingSenderId: "175833723035",
  appId: "1:175833723035:web:a4a18d2c66e5576fba163e",
  measurementId: "G-891NKCRDK4"



};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export auth instance