/**
 * Componente para gestión de backups administrativos
 * Permite listar, descargar y restaurar backups
 */

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  listBackups,
  downloadBackup,
  downloadBackupAsFile,
  getBackupStats,
  restoreBackup,
} from "../../utils/backupService";
import "./BackupAdmin.css";

export default function BackupAdmin() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    cargarBackups();
  }, []);

  const cargarBackups = async () => {
    try {
      setLoading(true);
      const listaBackups = await listBackups();
      setBackups(listaBackups);

      if (listaBackups.length === 0) {
        Swal.fire({
          title: "No hay backups",
          text: "Los backups se generan automáticamente cada domingo a las 1:00 AM UTC",
          icon: "info",
        });
      }
    } catch (error) {
      Swal.fire("Error", `No se pudieron cargar los backups: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBackup = async (backup) => {
    try {
      setLoading(true);
      const data = await downloadBackup(backup.path);
      setSelectedBackup({ ...backup, data });
      setStats(getBackupStats(data));
    } catch (error) {
      Swal.fire("Error", `No se pudo descargar el backup: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async () => {
    if (!selectedBackup?.data) return;

    try {
      const filename = `backup-${selectedBackup.name}`;
      downloadBackupAsFile(selectedBackup.data, filename);
      Swal.fire("Éxito", "Backup descargado correctamente", "success");
    } catch (error) {
      Swal.fire("Error", `No se pudo descargar: ${error.message}`, "error");
    }
  };

  const handleRestaurar = async () => {
    if (!selectedBackup?.data) return;

    const resultado = await Swal.fire({
      title: "Selecciona colecciones a restaurar",
      html: `
        <div style="text-align: left;">
          <label>
            <input type="checkbox" id="cat" checked> Categorías
          </label><br/>
          <label>
            <input type="checkbox" id="zonas" checked> Zonas
          </label><br/>
          <label>
            <input type="checkbox" id="eventos" checked> Eventos
          </label><br/>
          <label>
            <input type="checkbox" id="ofertas" checked> Ofertas
          </label>
        </div>
        <p style="color: red; font-weight: bold;">
          ⚠️ ADVERTENCIA: Esto reemplazará los datos existentes
        </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Restaurar",
      confirmButtonColor: "#d33",
    });

    if (resultado.isConfirmed) {
      const seleccionadas = [];
      document.getElementById("cat")?.checked && seleccionadas.push("categorias");
      document.getElementById("zonas")?.checked && seleccionadas.push("zonas");
      document.getElementById("eventos")?.checked && seleccionadas.push("eventos");
      document.getElementById("ofertas")?.checked && seleccionadas.push("ofertas");

      if (seleccionadas.length === 0) {
        Swal.fire("Aviso", "Selecciona al menos una colección", "warning");
        return;
      }

      try {
        setLoading(true);
        const restauracionResultado = await restoreBackup(selectedBackup.data, seleccionadas);

        if (restauracionResultado.errores.length === 0) {
          Swal.fire(
            "✅ Éxito",
            `${restauracionResultado.restauradas} documentos restaurados en ${seleccionadas.length} colecciones`,
            "success"
          );
        } else {
          Swal.fire(
            "⚠️ Restauración parcial",
            `${restauracionResultado.restauradas} documentos restaurados. Errores: ${restauracionResultado.errores.join("; ")}`,
            "warning"
          );
        }

        // Recargar backups
        await cargarBackups();
      } catch (error) {
        Swal.fire("Error", `Fallo en restauración: ${error.message}`, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="backup-admin-container">
      <h2>💾 Gestión de Backups Administrativos</h2>

      <div className="backup-info">
        <p>
          <strong>Backups automáticos:</strong> Se generan cada domingo a las 1:00 AM UTC
        </p>
        <p>
          <strong>Retención:</strong> Últimos 52 backups (1 año completo)
        </p>
        <button
          onClick={cargarBackups}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Cargando..." : "🔄 Recargar"}
        </button>
      </div>

      <div className="backup-list">
        <h3>Backups Disponibles ({backups.length})</h3>
        {backups.length === 0 ? (
          <p className="empty">No hay backups disponibles</p>
        ) : (
          <ul>
            {backups.map((backup, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectBackup(backup)}
                className={selectedBackup?.path === backup.path ? "active" : ""}
              >
                <span className="backup-name">{backup.name}</span>
                <span className="backup-date">
                  {new Date(backup.timeCreated).toLocaleString()}
                </span>
                <span className="backup-size">
                  {(backup.size / 1024).toFixed(2)} KB
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedBackup && stats && (
        <div className="backup-details">
          <h3>Detalles del Backup</h3>

          <div className="stats">
            <div className="stat-item">
              <strong>Timestamp:</strong>
              <span>{new Date(stats.timestamp).toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <strong>Total Documentos:</strong>
              <span>{stats.totalDocumentos}</span>
            </div>
          </div>

          <div className="collections-breakdown">
            <h4>Colecciones incluidas:</h4>
            <table>
              <thead>
                <tr>
                  <th>Colección</th>
                  <th>Documentos</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.colecciones).map(([col, count]) => (
                  <tr key={col}>
                    <td>{col}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="backup-actions">
            <button
              onClick={handleDescargar}
              disabled={loading}
              className="btn btn-info"
            >
              📥 Descargar como JSON
            </button>
            <button
              onClick={handleRestaurar}
              disabled={loading}
              className="btn btn-danger"
            >
              ⚠️ Restaurar (Reemplazar datos)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
