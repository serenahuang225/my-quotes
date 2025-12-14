import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSMC1ebro40UqKB4P7-UaPmZhHpYR53Io",
  authDomain: "serena-quotes.firebaseapp.com",
  projectId: "serena-quotes",
  storageBucket: "serena-quotes.firebasestorage.app",
  messagingSenderId: "72175210666",
  appId: "1:72175210666:web:1426fd2011c2a5bb40c0d3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// sign in once on app load
export const initAuth = async () => {
  try {
    await signInAnonymously(auth);
  } catch (err) {
    console.error("Anonymous auth failed", err);
  }
};
