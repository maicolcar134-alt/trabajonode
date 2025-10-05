import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDEuFnJASm2whg6CIxvrOgCtLkEQuqC4Eo",
  authDomain: "fuegos-pirotecnicos.firebaseapp.com",
  projectId: "fuegos-pirotecnicos",
  storageBucket: "fuegos-pirotecnicos.firebasestorage.app",
  messagingSenderId: "1084392002469",
  appId: "1:1084392002469:web:9581d2b105feefd91a4e4c"
};



// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth y provider de Google
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

export { auth, googleProvider, db, signOut };
