import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { retryAsyncSmartly } from "./retryHelper";

const db = getFirestore();

export const registrarLog = async (accion, resultado, ip = "127.0.0.1") => {
  try {
    const user = getAuth().currentUser;
    const usuario = user ? user.email : "Anónimo";

    // Usar reintentos automáticos para guardar el log
    await retryAsyncSmartly(
      async () => {
        await addDoc(collection(db, "auditoria"), {
          fecha: serverTimestamp(),
          usuario,
          accion,
          resultado,
          ip
        });
      },
      3,
      1000
    );

    console.log("✅ Log registrado:", accion);
  } catch (error) {
    console.error("❌ Error registrando log (después de reintentos):", error);
  }
};