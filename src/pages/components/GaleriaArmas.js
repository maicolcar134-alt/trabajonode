import React, { useEffect } from "react";
import {
  collection,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

// IMPORTAR TODAS LAS IMÁGENES
const assets = {
  amapache: "/imagenes/amapache.png",
  barrilCracker: "/imagenes/Barril-Cracker.png",
  bazuca888: "/imagenes/bazuca888-tiro.png",
  cazadorNoche: "/imagenes/Cazador-de-la-noche.png",
  ciclon: "/imagenes/Ciclon.png",
  cinturonFuego: "/imagenes/Cinturon-de-fuego.png",
  cispitas: "/imagenes/cispitas.png",
  combateAereo: "/imagenes/Combate-aereo.png",
  coyote: "/imagenes/Coyote.png",
  cuarentena: "/imagenes/Cuarentena.png",
  diosEgipcio: "/imagenes/Dios-egipcio.png",
  explosionLuna200: "/imagenes/explosion-luna-200.png",

  finDelMundo: "/imagenes/Fin-del-mundo.png",
  gladiador: "/imagenes/Gladiador.png",
  huevitos: "/imagenes/Huevitos.png",
  humos20cm: "/imagenes/Humos-20cm.png",
  islaMisteriosa: "/imagenes/Isla-Misteriosa.png",
  laPurga: "/imagenes/La-purga.png",
  laTravesia1: "/imagenes/La-travesia-1.png",
  laTremenda: "/imagenes/La-Tremenda.png",
  matchCracker: "/imagenes/Match-cracker.png",
  metralleta: "/imagenes/Metralleta.png",
  minicochete: "/imagenes/Minicochete.png",
  misil25t: "/imagenes/Misil-25t.png",

  misil100Tiros: "/imagenes/Misil-100-tiros.png",
  pajaroloco: "/imagenes/Pajaroloco.png",
  paraisoFantastico: "/imagenes/Paraiso-Fantastico.png",
  poderosoRa: "/imagenes/Poderoso-Ra.png",
  reinaEgipcia: "/imagenes/Reina-Egipcia.png",
  rositaChina: "/imagenes/rosita-china.png",
  sonajero: "/imagenes/sonajero.png",
  spartacus: "/imagenes/Spartacus.png",
  tanqueGuerra: "/imagenes/Tanque-de-guerra.png",
  terremoto1: "/imagenes/Terremoto-1.png",
  tornado: "/imagenes/Tornado.png",
  tortaCometa200: "/imagenes/torta-cometa-200tiro.png",

  torta133Tiros: "/imagenes/Torta-133-tiros.png",
  torta600Tiros: "/imagenes/Torta-600-tiros.png",
  tsunami: "/imagenes/Tsunami.png",

  vela10: "/imagenes/Vela-Pirocracker-10T.png",
  vela15: "/imagenes/Vela-Pirocracker-15T.png",
  vela30: "/imagenes/Vela-Pirocracker-30T.png",

  voladores5: "/imagenes/voladores-5tiro.png",
  volcon7: "/imagenes/Volcan-7.png",
  volcanito: "/imagenes/Volcanito.png",
  volcanesMedianos: "/imagenes/volcanes-medianos.png",

  warzone: "/imagenes/Warzone.png",
};

export default function GaleriaArmas() {
  // 📌 GUARDAR AUTOMÁTICAMENTE EN FIREBASE
  useEffect(() => {
    const guardarEnFirebase = async () => {
      for (const [key, url] of Object.entries(assets)) {
        const ref = doc(db, "productosGaleria", key);
        const existe = await getDoc(ref);

        // Si ya existe, no lo vuelve a guardar
        if (existe.exists()) continue;

        // Guardar en Firestore
        await setDoc(ref, {
          nombre: key,
          imagenURL: url,
          timestamp: serverTimestamp(),
        });
      }
      console.log("✔ Todos los productos fueron guardados o ya existían.");
    };

    guardarEnFirebase();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Galería Pirotécnica</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {Object.entries(assets).map(([key, src]) => (
          <div
            key={key}
            style={{
              background: "#111",
              padding: 15,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <img
              src={src}
              alt={key}
              style={{
                width: "100%",
                height: 180,
                borderRadius: 10,
                objectFit: "contain",
              }}
            />
            <h3 style={{ color: "white", marginTop: 10 }}>
              {key.replace(/([A-Z])/g, " $1")}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
