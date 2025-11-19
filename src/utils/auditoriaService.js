import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

export const registrarLog = async (accion, resultado, ip = "127.0.0.1") => {
  try {
    const user = getAuth().currentUser;
    const usuario = user ? user.email : "Anónimo";

    await addDoc(collection(db, "auditoria"), {
      fecha: serverTimestamp(),
      usuario,
      accion,
      resultado,
      ip
    });

    console.log(" Log registrado:", accion);
  } catch (error) {
    console.error(" Error registrando log:", error);
  }
};