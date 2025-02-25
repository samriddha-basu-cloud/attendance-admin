import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBQqI5rDTzBeooAF7y8wGeXeMHxVXL1ebA",
  authDomain: "gymi-gymi.firebaseapp.com",
  projectId: "gymi-gymi",
  storageBucket: "gymi-gymi.firebasestorage.app",
  messagingSenderId: "335109539027",
  appId: "1:335109539027:web:80ddcc0899ca6d7d28c026",
  measurementId: "G-RNXMEXGZ0N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login failed", error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export { auth, signInWithGoogle, logout, db }; // Export Firestore