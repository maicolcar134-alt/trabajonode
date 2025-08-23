import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCSoB5RsBrzriSfeRFqaVUfhKumJHLIMBA",
    authDomain: "brillatlm.firebaseapp.com",
    projectId: "brillatlm",
    storageBucket: "brillatlm.firebasestorage.app",
    messagingSenderId: "970081452395",
    appId: "1:970081452395:web:5b44b77ca66fe4bf7f0c2e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth y provider de Google
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

export { auth, googleProvider, db, signOut };
