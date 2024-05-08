// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMucr-8fnQEg3sv9kCp6ns49_k6_yK0oU",
  authDomain: "app-crm-9265d.firebaseapp.com",
  projectId: "app-crm-9265d",
  storageBucket: "app-crm-9265d.appspot.com",
  messagingSenderId: "176473561347",
  appId: "1:176473561347:web:e8369c00c3de665d2b3136",
  measurementId: "G-051XB7ZM0J",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth();

export { app, auth };
