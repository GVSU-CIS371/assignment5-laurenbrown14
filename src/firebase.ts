import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDS3zQN8V5Rp-WBKEnIjpgjUA4xfTZjLd0",
  authDomain: "customdrinkmaker-eb560.firebaseapp.com",
  projectId: "customdrinkmaker-eb560",
  storageBucket: "customdrinkmaker-eb560.firebasestorage.app",
  messagingSenderId: "978785492504",
  appId: "1:978785492504:web:35384929c9d53d0d01ed6d",
  measurementId: "G-3E0JR8YSZN",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default db;
