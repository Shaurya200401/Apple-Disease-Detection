// firebaseConfig.tsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfJ6ST6vEN5L-usaNCQSx27TQeBvUYSHg",
  authDomain: "appledisease-97040.firebaseapp.com",
  projectId: "appledisease-97040",
  storageBucket: "appledisease-97040.firebasestorage.app",
  messagingSenderId: "841738948423",
  appId: "1:841738948423:web:0160dcaff3b603147f4662",
  measurementId: "G-PSWDJJ60D5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication instance
const auth = getAuth(app);

// Export auth for use in other parts of your application
export { auth };
