// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 🔥 para subir imágenes o archivos

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDEuFnJASm2whg6CIxvrOgCtLkEQuqC4Eo",
  authDomain: "fuegos-pirotecnicos.firebaseapp.com",
  projectId: "fuegos-pirotecnicos",
  storageBucket: "fuegos-pirotecnicos.appspot.com", // 🔧 corregido: debe terminar en .appspot.com
  messagingSenderId: "1084392002469",
  appId: "1:1084392002469:web:9581d2b105feefd91a4e4c",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase inicializado correctamente");

// Servicios de Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app); // para imágenes o archivos

// Exportar para usar en otros componentes
export { app, auth, googleProvider, db, storage, signOut };
export default app;