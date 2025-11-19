// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEuFnJASm2whg6CIxvrOgCtLkEQuqC4Eo",
  authDomain: "fuegos-pirotecnicos.firebaseapp.com",
  databaseURL: "https://fuegos-pirotecnicos-default-rtdb.firebaseio.com",
  projectId: "fuegos-pirotecnicos",
  storageBucket: "fuegos-pirotecnicos.firebasestorage.app",
  messagingSenderId: "1084392002469",
  appId: "1:1084392002469:web:9581d2b105feefd91a4e4c",
  measurementId: "G-GTRD7SLPES",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase inicializado correctamente");

// Servicios de Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app); // Servicio de Storage para archivos

// Exportar para usar en toda la app
export { app, auth, googleProvider, db, storage, signOut };
export default app;
