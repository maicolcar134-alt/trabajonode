

import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase"; // ajusta la ruta si es necesario
import "./ZonasEnvio.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ZonasEnvioProFirebase() {
  const navigate = useNavigate();

  // datos crudos
  const [zonasRaw, setZonasRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI / filtros / paginación / orden
  const [busqueda, setBusqueda] = useState("");
  const [tab, setTab] = useState("Todos");
  const [sortField, setSortField] = useState("nombre"); // campo por defecto
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  // modal / form
  const [modalOpen, setModalOpen] = useState(false);
  const [formZona, setFormZona] = useState({ nombre: "", ciudad: "", costo: "", estado: "Activa", id: null });

  // notificaciones
  const [notif, setNotif] = useState(null); // { tipo: 'success'|'error'|'info', msg }

  // ---------------------------
  //  ON-SNAPSHOT: realtime feed
  // ---------------------------
  useEffect(() => {
    setLoading(true);
    const colRef = collection(db, "zonas");
    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setZonasRaw(data);
        setLoading(false);
      },
      (err) => {
        console.error("onSnapshot zonas error:", err);
        setNotif({ tipo: "error", msg: "Error cargando zonas (ver consola)" });
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // ---------------------------
  //  FILTRADO + búsqueda + orden + paginación (cliente)
  // ---------------------------
  const listaProcesada = useMemo(() => {
    let arr = [...zonasRaw];

    // filtro por tab (estado)
    if (tab !== "Todos") arr = arr.filter((z) => z.estado === tab);

    // búsqueda
    const q = busqueda.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (z) =>
          (z.nombre || "").toString().toLowerCase().includes(q) ||
          (z.ciudad || "").toString().toLowerCase().includes(q)
      );
    }

    // orden
    arr.sort((a, b) => {
      const va = (a[sortField] ?? "").toString().toLowerCase();
      const vb = (b[sortField] ?? "").toString().toLowerCase();
      if (va === vb) return 0;
      if (sortDir === "asc") return va > vb ? 1 : -1;
      return va > vb ? -1 : 1;
    });

    return arr;
  }, [zonasRaw, busqueda, tab, sortField, sortDir]);

  // paginación
  const totalPaginas = Math.max(1, Math.ceil(listaProcesada.length / porPagina));
  useEffect(() => {
    if (pagina > totalPaginas) setPagina(1);
  }, [totalPaginas, pagina]);

  const zonasPaginadas = useMemo(() => {
    const start = (pagina - 1) * porPagina;
    return listaProcesada.slice(start, start + porPagina);
  }, [listaProcesada, pagina]);

  // ---------------------------
  //  ACCIONES: CRUD
  // ---------------------------
  const abrirModalCrear = () => {
    setFormZona({ nombre: "", ciudad: "", costo: "", estado: "Activa", id: null });
    setModalOpen(true);
  };

  const abrirModalEditar = (z) => {
    setFormZona({ nombre: z.nombre || "", ciudad: z.ciudad || "", costo: z.costo || "", estado: z.estado || "Activa", id: z.id });
    setModalOpen(true);
  };

  const guardarZona = async (ev) => {
    ev?.preventDefault?.();
    const { nombre, ciudad, costo, estado, id } = formZona;
    if (!nombre || !ciudad) {
      setNotif({ tipo: "info", msg: "Completa nombre y ciudad." });
      setTimeout(() => setNotif(null), 3500);
      return;
    }

    try {
      if (id) {
        await updateDoc(doc(db, "zonas", id), { nombre, ciudad, costo: Number(costo ?? 0), estado });
        setNotif({ tipo: "success", msg: "Zona actualizada." });
      } else {
        await addDoc(collection(db, "zonas"), { nombre, ciudad, costo: Number(costo ?? 0), estado });
        setNotif({ tipo: "success", msg: "Zona creada." });
      }
    } catch (err) {
      console.error("guardarZona:", err);
      setNotif({ tipo: "error", msg: "Error guardando zona." });
    } finally {
      setModalOpen(false);
      setTimeout(() => setNotif(null), 3500);
    }
  };

  const eliminarZona = async (id) => {
    if (!window.confirm("¿Eliminar esta zona?")) return;
    try {
      await deleteDoc(doc(db, "zonas", id));
      setNotif({ tipo: "success", msg: "Zona eliminada." });
      setTimeout(() => setNotif(null), 3000);
    } catch (err) {
      console.error("eliminarZona:", err);
      setNotif({ tipo: "error", msg: "Error eliminando zona." });
    }
  };

  // alternar orden al pulsar cabecera
  const toggleSort = (campo) => {
    if (sortField === campo) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(campo);
      setSortDir("asc");
    }
  };

  // ---------------------------
  //  UI
  // ---------------------------
  return (
    <div className="zonas-page">
      {/* Notificación */}
      {notif && (
        <div className={`notificacion ${notif.tipo}`}>
          <span>{notif.msg}</span>
          <button className="cerrar-notificacion" onClick={() => setNotif(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="zonas-header">
        <div className="title">
          <FaArrowLeft className="btn-volver-icon" style={{ cursor: "pointer" }} onClick={() => navigate("/")} />
          <span>Zonas / Envíos</span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn-nuevo" onClick={abrirModalCrear}><FaPlus style={{ marginRight: 6 }} /> Nueva Zona</button>
        </div>
      </div>

      {/* acciones: tabs, buscador */}
      <div className="zonas-actions" style={{ marginBottom: 12 }}>
        <div className="tabs">
          {["Todos", "Activa", "Inactiva"].map((t) => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setPagina(1); }}>
              {t}
            </button>
          ))}
        </div>

        <div className="actions-right">
          <input
            placeholder="Buscar por nombre o ciudad..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
          />
        </div>
      </div>

      {/* tabla */}
      <div className="tabla-wrap">
        {loading ? (
          <div className="sin-datos">Cargando zonas...</div>
        ) : (
          <table className="tabla-zonas">
            <thead>
              <tr>
                <th onClick={() => toggleSort("nombre")} style={{ cursor: "pointer" }}>
                  Nombre {sortField === "nombre" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("ciudad")} style={{ cursor: "pointer" }}>
                  Ciudad {sortField === "ciudad" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("costo")} style={{ cursor: "pointer" }}>
                  Costo {sortField === "costo" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("estado")} style={{ cursor: "pointer" }}>
                  Estado {sortField === "estado" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {zonasPaginadas.length === 0 ? (
                <tr><td colSpan="5" className="sin-datos">No hay zonas.</td></tr>
              ) : (
                zonasPaginadas.map((z) => (
                  <tr key={z.id}>
                    <td>{z.nombre}</td>
                    <td>{z.ciudad}</td>
                    <td>{typeof z.costo !== "undefined" ? `$${z.costo}` : "-"}</td>
                    <td><span className={`estado ${z.estado}`}>{z.estado}</span></td>
                    <td>
                      <button className="icon-btn" onClick={() => abrirModalEditar(z)} title="Editar"><FaEdit /></button>
                      <button className="icon-btn delete" onClick={() => eliminarZona(z.id)} title="Eliminar"><FaTrash /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* paginación */}
      <div className="paginacion" style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <button disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>◀</button>
        <span> {pagina} / {totalPaginas} </span>
        <button disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)}>▶</button>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{formZona.id ? "Editar Zona" : "Nueva Zona"}</h3>
              <button className="close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={(e) => { guardarZona(e); }}>
              <input placeholder="Nombre" value={formZona.nombre} onChange={(e) => setFormZona((s) => ({ ...s, nombre: e.target.value }))} />
              <input placeholder="Ciudad" value={formZona.ciudad} onChange={(e) => setFormZona((s) => ({ ...s, ciudad: e.target.value }))} />
              <input type="number" placeholder="Costo" value={formZona.costo} onChange={(e) => setFormZona((s) => ({ ...s, costo: e.target.value }))} />
              <select value={formZona.estado} onChange={(e) => setFormZona((s) => ({ ...s, estado: e.target.value }))}>
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>

              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={{ flex: 1 }}>{formZona.id ? "Actualizar" : "Guardar"}</button>
                <button type="button" style={{ flex: 1 }} onClick={() => { setModalOpen(false); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
