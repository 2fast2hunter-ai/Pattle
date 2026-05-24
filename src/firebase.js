import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCeNoVdDehuvg8GiH8I5VEHkmFROPTH2G8",
  authDomain: "pattle-6edea.firebaseapp.com",
  projectId: "pattle-6edea",
  storageBucket: "pattle-6edea.firebasestorage.app",
  messagingSenderId: "762883566096",
  appId: "1:762883566096:web:c5a791d725c1dca47bf895",
  measurementId: "G-B9L3RX1PJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Datenbank exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);

getAnalytics(app);