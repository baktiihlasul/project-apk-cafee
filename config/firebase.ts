// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI-nQ8ng03KgoK2olscthdplcIxHU68NE",
  authDomain: "cafe-app-12fbb.firebaseapp.com",
  projectId: "cafe-app-12fbb",
  storageBucket: "cafe-app-12fbb.firebasestorage.app",
  messagingSenderId: "727106895542",
  appId: "1:727106895542:web:4c74e0b496ccba9d8e3017"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);