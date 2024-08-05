// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbKdTowPhrdCMxuVIcZ9nqWN7eogUHFhI",
  authDomain: "pantry-app-57ea1.firebaseapp.com",
  projectId: "pantry-app-57ea1",
  storageBucket: "pantry-app-57ea1.appspot.com",
  messagingSenderId: "1076792081601",
  appId: "1:1076792081601:web:09c4644fcc8a5aa9fca840"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export { app, firestore, firebaseConfig }