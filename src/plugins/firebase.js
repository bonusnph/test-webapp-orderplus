import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyB6OLgHswpM_u_U73xOH_76BEw-vDJTYlg",
  authDomain: "orderplus-785ac.firebaseapp.com",
  databaseURL:
    "https://orderplus-785ac-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "orderplus-785ac",
  storageBucket: "orderplus-785ac.appspot.com",
  messagingSenderId: "697033608289",
  appId: "1:697033608289:web:63e518e14ab8f7a5b82e20",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
