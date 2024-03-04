// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4EILAIfjYir-JRkEYgK_lG7VTusSAM2Y",
  authDomain: "rljonesins-qms.firebaseapp.com",
  projectId: "rljonesins-qms",
  storageBucket: "rljonesins-qms.appspot.com",
  messagingSenderId: "803025626055",
  appId: "1:803025626055:web:417d763d76fe6170896fe2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
