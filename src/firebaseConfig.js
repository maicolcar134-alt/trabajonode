// src/firebaseConfig.js

// --------------------------------------
// 🔥 IMPORTS FIREBASE
// --------------------------------------
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// --------------------------------------
// 🔥 CONFIGURACIÓN DE FIREBASE
// --------------------------------------
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

// Servicios Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDB = getDatabase(app);

// --------------------------------------
// ☁️ CONFIGURACIÓN CLOUDINARY
// --------------------------------------

// Cloud name real (NO USAR MAYÚSCULAS)
export const CLOUDINARY_CLOUD_NAME = "Raíz";

// Upload preset UNSIGNED configurado en Cloudinary
export const CLOUDINARY_UPLOAD_PRESET = "react-test";

// Endpoint oficial (no requiere api_key)
export const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// --------------------------------------
// 📤 FUNCIÓN PARA SUBIR IMÁGENES A CLOUDINARY
// --------------------------------------
export async function uploadImageCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await fetch(CLOUDINARY_API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.error) {
      console.error("❌ Error Cloudinary:", data.error.message);
      throw new Error(data.error.message);
    }

    console.log("✔ Imagen subida a Cloudinary:", data.secure_url);
    return data; // secure_url, public_id...
  } catch (err) {
    console.error("❌ Error al subir imagen:", err);
    throw err;
  }
}

// --------------------------------------
// 🔥 EXPORTACIONES
// --------------------------------------
export { app, auth, googleProvider, db, storage, realtimeDB, signOut };

export default app;
