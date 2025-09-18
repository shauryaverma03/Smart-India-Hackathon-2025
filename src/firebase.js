// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiH_4zMWuMwR-SR9b36rpklpcYn23qOmI",
  authDomain: "careerflowai-aaa71.firebaseapp.com",
  projectId: "careerflowai-aaa71",
  storageBucket: "careerflowai-aaa71.appspot.com",
  messagingSenderId: "607069896142",
  appId: "1:607069896142:web:7d37c8419e63c441beff9f",
  measurementId: "G-S630ZM28HN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Only initialize analytics if running in the browser (not on server)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);