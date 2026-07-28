import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCN3OtIpq_h6chQqI54YauqWYfHyIamdg0",
  authDomain: "almaya-scents.firebaseapp.com",
  projectId: "almaya-scents",
  storageBucket: "almaya-scents.firebasestorage.app",
  messagingSenderId: "736030743733",
  appId: "1:736030743733:web:8628f00420bb2f7923b2fc",
  measurementId: "G-7M52JDDF8N",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export const FIREBASE_OVERRIDES_COLLECTION = "siteContent";
export const FIREBASE_OVERRIDES_DOCUMENT = "default";
