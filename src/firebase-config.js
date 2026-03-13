import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcIzGaIAc_gOmR81AuIkeRdEW1tGXTV6k",
  authDomain: "arikana-1e213.firebaseapp.com",
  projectId: "arikana-1e213",
  storageBucket: "arikana-1e213.firebasestorage.app",
  messagingSenderId: "312663898307",
  appId: "1:312663898307:web:dbfc24e1761204e3734a76",
  measurementId: "G-3FN4SH1C07"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);