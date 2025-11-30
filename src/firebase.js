// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);