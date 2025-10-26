import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auditoria.css";

export default function Auditoria() {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate("/Admin"); // 🔙 Ruta de inicio
  };

  const registros = []; // vacío

  return (
    <div className="auditoria">
      {/* 🔘 Botón Volver al Inicio */}
      <button className="btn-volver" onClick={handleVolver}>
        <i className="fa-solid fa-arrow-left"></i> Volver Admin
      </button>

      <h1>Auditoría y Logs</h1>
      <p className="subtext">
        Registro inalterable de operaciones del sistema
      </p>

      {/* Tarjetas métricas */}
      <div className="cards">
        <div className="card">
          <h2>0</h2>
          <p>Registros Totales</p>
        </div>
        <div className="card success">
          <h2>0</h2>
          <p>Operaciones Exitosas</p>
        </div>
        <div className="card warning">
          <h2>0</h2>
          <p>Pendientes Revisión</p>
        </div>
        <div className="card danger">
          <h2>0</h2>
          <p>Operaciones Fallidas</p>
        </div>
      </div>

      {/* Panel de solo lectura */}
      <div className="solo-lectura">
        <i className="fa-solid fa-shield-halved"></i>
        <span>Registro de Auditoría de Solo Lectura</span>
        <p>
          Este registro es inalterable y cumple con los requisitos legales de
          trazabilidad. Todos los eventos quedan registrados con fecha, hora,
          usuario e IP de origen.
        </p>
      </div>

      {/* Registro de actividad */}
      <div className="actividad">
        <div className="header-actividad">
          <h3>Registro de Actividad</h3>
          <div className="acciones">
            <button className="btn filtro">
              <i className="fa-solid fa-filter"></i> Filtrar
            </button>
            <button className="btn exportar">
              <i className="fa-solid fa-file-csv"></i> Exportar CSV
            </button>
          </div>
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
                <td colSpan="5" className="sin-datos">
                  No hay registros de auditoría disponibles.
                </td>
              </tr>
            ) : (
              registros.map((r, i) => (
                <tr key={i}>
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

      {/* Política de retención */}
      <div className="retencion">
        <h4>Política de Retención</h4>
        <p>
          Los logs de auditoría se conservan durante 7 años según normativa
          legal. Los registros mayores de 90 días se archivan automáticamente.
        </p>
        <span>Última exportación de archivo: 01/10/2025 02:00:00</span>
      </div>
    </div>
  );
}
