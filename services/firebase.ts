import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDD1ZbaF-yECjINVeTRvYvGx1MBgWDLVoc",
  authDomain: "sietdindo.firebaseapp.com",
  projectId: "sietdindo",
  storageBucket: "sietdindo.firebasestorage.app",
  messagingSenderId: "812370145647",
  appId: "1:812370145647:web:d0b3ea0684a87b4d31789a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);