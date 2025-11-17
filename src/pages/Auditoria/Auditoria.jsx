import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import "./Auditoria.css";

export default function Auditoria() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "auditoria"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate().toLocaleString() || "-"
      }));
      setRegistros(data);
    });

    return () => unsubscribe();
  }, []);

  const handleVolver = () => {
    navigate("/Admin");
  };

  return (
    <div className="auditoria">
      <button className="btn-volver" onClick={handleVolver}>
        <i className="fa-solid fa-arrow-left"></i> Volver Admin
      </button>

      <h1>Auditoría y Logs</h1>
      <p className="subtext">Registro inalterable de operaciones del sistema</p>

      {/* Métricas */}
      <div className="cards">
        <div className="card">
          <h2>{registros.length}</h2>
          <p>Registros Totales</p>
        </div>
        <div className="card success">
          <h2>{registros.filter(r => r.resultado === "Éxito").length}</h2>
          <p>Operaciones Exitosas</p>
        </div>
        <div className="card warning">
          <h2>{registros.filter(r => r.resultado === "Pendiente").length}</h2>
          <p>Pendientes Revisión</p>
        </div>
        <div className="card danger">
          <h2>{registros.filter(r => r.resultado === "Fallido").length}</h2>
          <p>Operaciones Fallidas</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="actividad">
        <div className="header-actividad">
          <h3>Registro de Actividad</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Resultado</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td colSpan="5" className="sin-datos">No hay registros disponibles</td>
              </tr>
            ) : (
              registros.map((r) => (
                <tr key={r.id}>
                  <td>{r.fecha}</td>
                  <td><span className="tag">{r.usuario}</span></td>
                  <td>{r.accion}</td>
                  <td>
                    <span className={`estado ${
                      r.resultado === "Éxito" ? "exito" :
                      r.resultado === "Pendiente" ? "pendiente" : "fallido"
                    }`}>
                      {r.resultado}
                    </span>
                  </td>
                  <td>{r.ip}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
