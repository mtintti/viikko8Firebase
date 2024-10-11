// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "ApiKey",
  authDomain: "shoppinglist-49b99.firebaseapp.com",
  projectId: "shoppinglist-49b99",
  storageBucket: "shoppinglist-49b99.appspot.com",
  messagingSenderId: "812602864156",
  appId: "1:812602864156:web:4bd90bf8761d9c98d365d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };