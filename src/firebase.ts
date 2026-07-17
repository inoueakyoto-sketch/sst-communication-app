import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQbtY9voG0CGIF1F5Vu87PDDWE45qiXLo",
  authDomain: "sst-communication-app.firebaseapp.com",
  projectId: "sst-communication-app",
  storageBucket: "sst-communication-app.firebasestorage.app",
  messagingSenderId: "243377112314",
  appId: "1:243377112314:web:1c581945e040d1efb2f543",
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const db = getFirestore(firebaseApp);
