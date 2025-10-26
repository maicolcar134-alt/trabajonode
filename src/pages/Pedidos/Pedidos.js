import React, { useState, useEffect, useMemo } from "react";
import { Download, Eye, Plus, ArrowDownCircle, Search, Home } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "./Pedidos.css";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [tab, setTab] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Cargar pedidos desde Firestore
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pedidos"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPedidos(data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  // 🔹 Métricas
  const totalActivos = pedidos.length;
  const enProceso = pedidos.filter((p) => p.estado === "Procesando").length;
  const enviados = pedidos.filter((p) => p.estado === "Enviado").length;
  const requierenKyc = pedidos.filter((p) => p.kyc).length;

  // 🔹 Filtro por pestañas y búsqueda
  const listaFiltrada = useMemo(() => {
    const porTab =
      tab === "Todos"
        ? pedidos
        : tab === "Pendientes"
        ? pedidos.filter((p) => p.estado === "Pendiente")
        : tab === "En Proceso"
        ? pedidos.filter((p) => p.estado === "Procesando")
        : tab === "Enviados"
        ? pedidos.filter((p) => p.estado === "Enviado")
        : tab === "Entregados"
        ? pedidos.filter((p) => p.estado === "Entregado")
        : pedidos;

    if (!busqueda.trim()) return porTab;

    const q = busqueda.toLowerCase();
    return porTab.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.cliente?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q)
    );
  }, [tab, pedidos, busqueda]);

  // 🔹 Acción del botón "Volver al inicio"
  const handleVolver = () => {
    navigate("/Admin"); // Cambia la ruta según tu estructura, ej: "/admin"
  };

  return (
    <div className="pedidos-page">
      <header className="pedidos-header">
        <div>
          <h1>Gestión de Pedidos</h1>
          <p>Monitorea y administra todos los pedidos</p>
        </div>

        <div className="header-buttons">
          {/* 🔙 Botón Volver al Inicio */}
          <button className="btn-volver" onClick={handleVolver}>
            <Home size={16} />
            Volver  Admin 
          </button>

          {/* ➕ Botón Nuevo Pedido */}
          <button className="btn-nuevo">
            <Plus size={16} /> Nuevo Pedido
          </button>
        </div>
      </header>

      <section className="pedidos-metrics">
        <div className="metric card-dark">
          <div className="metric-value">{totalActivos}</div>
          <div className="metric-label">Pedidos Activos</div>
        </div>
        <div className="metric card-dark">
          <div className="metric-value highlight-amber">{enProceso}</div>
          <div className="metric-label">En Proceso</div>
        </div>
        <div className="metric card-dark">
          <div className="metric-value highlight-blue">{enviados}</div>
          <div className="metric-label">Enviados</div>
        </div>
        <div className="metric card-dark">
          <div className="metric-value highlight-red">{requierenKyc}</div>
          <div className="metric-label">Requieren KYC</div>
        </div>
      </section>

      <section className="lista-pedidos card-container">
        <div className="lista-header">
          <h3>Lista de Pedidos</h3>
          <div className="lista-controls">
            <div className="tabs">
              {["Todos", "Pendientes", "En Proceso", "Enviados", "Entregados"].map(
                (t) => (
                  <button
                    key={t}
                    className={`tab ${tab === t ? "active" : ""}`}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
            <div className="search-export">
              <div className="search">
                <Search size={14} />
                <input
                  placeholder="Buscar por ID, cliente o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <button className="btn-export">
                <ArrowDownCircle size={16} /> Exportar
              </button>
            </div>
          </div>
        </div>

        <div className="tabla-wrap">
          {loading ? (
            <div className="sin-resultados">Cargando pedidos...</div>
          ) : (
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Items</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.map((p) => (
                  <tr key={p.id}>
                    <td className="id">{p.id}</td>
                    <td className="cliente">
                      <div className="cliente-nombre">{p.cliente}</div>
                      <div className="cliente-email">{p.email}</div>
                    </td>
                    <td className="monto">{p.monto}</td>
                    <td className="estado-cell">
                      <span
                        className={`badge estado-${p.estado
                          ?.toLowerCase()
                          ?.replace(/\s+/g, "")}`}
                      >
                        {p.estado}
                      </span>
                      {p.kyc && <span className="badge kyc">KYC</span>}
                    </td>
                    <td className="fecha">{p.fecha}</td>
                    <td className="items">{p.items}</td>
                    <td className="acciones">
                      <button title="Ver" className="icon-btn">
                        <Eye size={16} />
                      </button>
                      <button title="Descargar" className="icon-btn">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {listaFiltrada.length === 0 && (
                  <tr>
                    <td colSpan="7" className="sin-resultados">
                      No hay pedidos que coincidan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

