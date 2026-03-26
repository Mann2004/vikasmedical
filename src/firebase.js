// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgv8bi49cWUgUxjF4opaTSjlGtHuVBXJw",
  authDomain: "vikas-medical-60df8.firebaseapp.com",
  projectId: "vikas-medical-60df8",
  storageBucket: "vikas-medical-60df8.firebasestorage.app",
  messagingSenderId: "837848550062",
  appId: "1:837848550062:web:7f0a32678320362c58bb3f",
  measurementId: "G-99G98BNMK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
const analytics = getAnalytics(app);