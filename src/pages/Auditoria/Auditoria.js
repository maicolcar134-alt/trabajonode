import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { buscarConNormalizacion } from "../../utils/normalizarBusqueda";
import "./Auditoria.css";

export default function Auditoria() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // 🔍 NUEVO: estado del buscador

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 20;

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "auditoria"), orderBy("fecha", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha?.toDate().toLocaleString() || "-",
      }));
      setRegistros(data);
    });

    return () => unsubscribe();
  }, []);



  // 🔍 NUEVO — FILTRO EN TIEMPO REAL (con normalización de acentos)
  const registrosFiltrados = registros.filter((r) => {
    const texto = busqueda.trim();
    if (!texto) return true;

    return (
      buscarConNormalizacion(r.usuario || "", texto) ||
      buscarConNormalizacion(r.accion || "", texto) ||
      buscarConNormalizacion(r.resultado || "", texto) ||
      buscarConNormalizacion(r.ip || "", texto) ||
      buscarConNormalizacion(r.fecha || "", texto)
    );
  });

  // Cálculo de paginación
  const totalPaginas = Math.max(1, Math.ceil(registrosFiltrados.length / itemsPorPagina));
  const registrosPaginados = registrosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  return (
    <div className="auditoria">
    

      <h1>Auditoría y Logs</h1>
      <p className="subtext">Registro inalterable de operaciones del sistema</p>

      {/* 🔍 Buscador en tiempo real */}
      <div className="buscador-box">
        <input
          type="text"
          placeholder="Buscar por usuario, acción, IP, resultado, fecha..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador"
        />
      </div>

      {/* Métricas */}
      <div className="cards">
        <div className="card">
          <h2>{registros.length}</h2>
          <p>Registros Totales</p>
        </div>
        <div className="card success">
          <h2>{registros.filter((r) => r.resultado === "Éxito").length}</h2>
          <p>Operaciones Exitosas</p>
        </div>
        <div className="card warning">
          <h2>{registros.filter((r) => r.resultado === "Pendiente").length}</h2>
          <p>Pendientes Revisión</p>
        </div>
        <div className="card danger">
          <h2>{registros.filter((r) => r.resultado === "Fallido").length}</h2>
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
            {registrosPaginados.length === 0 ? (
              <tr>
                <td colSpan="5" className="sin-datos">
                  No hay registros que coincidan con la búsqueda
                </td>
              </tr>
            ) : (
              registrosPaginados.map((r) => (
                <tr key={r.id}>
                  <td>{r.fecha}</td>
                  <td>
                    <span className="tag">{r.usuario}</span>
                  </td>
                  <td>{r.accion}</td>
                  <td>
                    <span
                      className={`estado ${
                        r.resultado === "Éxito"
                          ? "exito"
                          : r.resultado === "Pendiente"
                          ? "pendiente"
                          : "fallido"
                      }`}
                    >
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

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="paginacion-container">
          <button
            className="btn-pagination"
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </button>

          <span className="info-pagina">
            Página {paginaActual} de {totalPaginas} ({registrosFiltrados.length} items)
          </span>

          <button
            className="btn-pagination"
            onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
