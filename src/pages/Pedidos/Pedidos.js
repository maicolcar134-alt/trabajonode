import React, { useState, useEffect } from "react";
import "./Pedidos.css";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Loader2, Plus, Edit, Trash2, Home, Download } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟡 Cargar pedidos desde Firestore
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

  // 🟢 Agregar nuevo pedido
  const handleNuevoPedido = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Nuevo Pedido",
      html: `
        <input id="cliente" class="swal2-input" placeholder="Nombre del cliente">
        <input id="email" class="swal2-input" placeholder="Correo">
        <input id="monto" type="number" class="swal2-input" placeholder="Monto">
        <input id="items" type="number" class="swal2-input" placeholder="Cantidad de ítems">
      `,
      confirmButtonText: "Guardar",
      focusConfirm: false,
      preConfirm: () => {
        return {
          cliente: document.getElementById("cliente").value,
          email: document.getElementById("email").value,
          monto: Number(document.getElementById("monto").value),
          items: Number(document.getElementById("items").value),
        };
      },
    });

    if (formValues) {
      const nuevo = {
        ...formValues,
        estado: "Pendiente",
        fecha: new Date().toLocaleDateString(),
        kyc: false,
      };
      try {
        const docRef = await addDoc(collection(db, "pedidos"), nuevo);
        setPedidos([...pedidos, { id: docRef.id, ...nuevo }]);
        Swal.fire("✅ Pedido agregado", "", "success");
      } catch (error) {
        console.error("Error al agregar pedido:", error);
      }
    }
  };

  // 🟠 Editar estado del pedido
  const handleEditarEstado = async (id, estadoActual) => {
    const opciones = ["Pendiente", "Procesando", "Enviado", "Completado"];
    const { value: nuevoEstado } = await Swal.fire({
      title: "Cambiar estado",
      input: "select",
      inputOptions: opciones.reduce((acc, op) => ({ ...acc, [op]: op }), {}),
      inputValue: estadoActual,
      confirmButtonText: "Actualizar",
    });

    if (nuevoEstado) {
      try {
        const pedidoRef = doc(db, "pedidos", id);
        await updateDoc(pedidoRef, { estado: nuevoEstado });
        setPedidos(
          pedidos.map((p) =>
            p.id === id ? { ...p, estado: nuevoEstado } : p
          )
        );
        Swal.fire("✅ Estado actualizado", "", "success");
      } catch (error) {
        console.error("Error al actualizar estado:", error);
      }
    }
  };

  // 🔴 Eliminar pedido
  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, "pedidos", id));
        setPedidos(pedidos.filter((p) => p.id !== id));
        Swal.fire("🗑️ Pedido eliminado", "", "success");
      } catch (error) {
        console.error("Error al eliminar pedido:", error);
      }
    }
  };

  // 🔙 Volver al Admin
  const handleVolverAdmin = () => {
    navigate("/admin");
  };

  // 📥 Descargar pedidos en CSV
  const handleDescargarCSV = () => {
    if (pedidos.length === 0) {
      Swal.fire("⚠️ No hay pedidos para exportar", "", "warning");
      return;
    }

    const encabezados = ["Cliente", "Email", "Monto", "Estado", "Fecha", "Items"];
    const filas = pedidos.map((p) => [
      p.cliente,
      p.email,
      p.monto,
      p.estado,
      p.fecha,
      p.items,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [encabezados, ...filas].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "pedidos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🧾 Renderizar
  return (
    <div className="pedidos-page">
      <div className="pedidos-header">
        <h2>Gestión de Pedidos</h2>

        <div className="header-buttons">
          <button className="btn-volver" onClick={handleVolverAdmin}>
            <Home size={16} /> Volver Admin
          </button>
          <button className="btn-nuevo" onClick={handleNuevoPedido}>
            <Plus size={16} /> Nuevo Pedido
          </button>
          <button className="btn-descargar" onClick={handleDescargarCSV}>
            <Download size={16} /> Descargar CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <Loader2 className="spinner" /> Cargando pedidos...
        </div>
      ) : pedidos.length === 0 ? (
        <p className="no-data">No hay pedidos registrados.</p>
      ) : (
        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.cliente}</td>
                <td>{p.email}</td>
                <td>${p.monto.toLocaleString()}</td>
                <td>
                  <span className={`badge estado-${p.estado?.toLowerCase()}`}>
                    {p.estado}
                  </span>
                </td>
                <td>{p.fecha}</td>
                <td>{p.items}</td>
                <td>
                  <button
                    className="btn-accion edit"
                    onClick={() => handleEditarEstado(p.id, p.estado)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn-accion delete"
                    onClick={() => handleEliminar(p.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
