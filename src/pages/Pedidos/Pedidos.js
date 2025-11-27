import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Container,
  Table,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import { FaBoxOpen, FaTrashAlt, FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Pedidos.css";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listenerActivo, setListenerActivo] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const navigate = useNavigate();

  // 🔍 Buscar pedidos por teléfono
  const buscarPedidos = () => {
    if (!telefono.trim()) {
      alert("Por favor ingresa un número de teléfono.");
      return;
    }
    setCargando(true);
    if (listenerActivo) listenerActivo();

    const q = query(
      collection(db, "pedidos"),
      where("cliente.telefono", "==", telefono)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setPedidos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    });

    setListenerActivo(() => unsub);
  };

  // 📋 Mostrar todos los pedidos
  const mostrarTodos = () => {
    setCargando(true);
    if (listenerActivo) listenerActivo();

    const q = query(collection(db, "pedidos"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPedidos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    });

    setListenerActivo(() => unsub);
  };

  // 🔁 Actualizar pedidos manualmente
  const actualizarPedidos = async () => {
    setCargando(true);
    const snapshot = await getDocs(collection(db, "pedidos"));
    setPedidos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    setCargando(false);
  };

  // 🧹 Limpieza
  useEffect(() => {
    mostrarTodos();
    return () => {
      if (listenerActivo) listenerActivo();
    };
  }, []);

  // 🎨 Colores del estado
  const colorEstado = (estado) => {
    switch (estado) {
      case "En proceso":
        return "warning";
      case "Enviado":
        return "primary";
      case "Entregado":
        return "success";
      default:
        return "secondary";
    }
  };

  // 🧾 Registrar acción en auditoría
  const registrarAuditoria = async (accion, idPedido, detalles = {}) => {
    try {
      await addDoc(collection(db, "auditoria_logs"), {
        accion,
        idPedido,
        detalles,
        fecha: serverTimestamp(),
        usuario: "Administrador",
      });
    } catch (error) {
      console.error("Error registrando auditoría:", error);
    }
  };

  // ✅ Actualizar estado
  const actualizarEstado = async (idPedido, nuevoEstado) => {
    try {
      const ref = doc(db, "pedidos", idPedido);
      await updateDoc(ref, { estado: nuevoEstado });
      await registrarAuditoria("Cambio de estado", idPedido, { nuevoEstado });
    } catch (error) {
      alert("Error al actualizar el estado del pedido.");
    }
  };

  // 💳 Actualizar pago
  const actualizarPago = async (idPedido, nuevoPago) => {
    try {
      const ref = doc(db, "pedidos", idPedido);
      await updateDoc(ref, { pago: nuevoPago });
      await registrarAuditoria("Actualización de pago", idPedido, {
        nuevoPago,
      });
    } catch (error) {
      alert("Error al actualizar el estado del pago.");
    }
  };

  // 🗑️ Eliminar un pedido individual
  const eliminarPedido = async (idPedido) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este pedido?"
    );
    if (!confirmar) return;
    try {
      await deleteDoc(doc(db, "pedidos", idPedido));
      await registrarAuditoria("Eliminación de pedido", idPedido);
      setPedidos((prev) => prev.filter((p) => p.id !== idPedido));
      alert("Pedido eliminado correctamente ✅");
    } catch (error) {
      alert("Error al eliminar el pedido.");
    }
  };

  // ✅ Seleccionar/desmarcar pedido
  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Seleccionar todos
  const seleccionarTodos = () => {
    if (seleccionados.length === pedidos.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(pedidos.map((p) => p.id));
    }
  };

  // 🗑️ Eliminar pedidos seleccionados
  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) {
      alert("⚠️ No hay pedidos seleccionados.");
      return;
    }
    const confirmar = window.confirm(
      `¿Eliminar ${seleccionados.length} pedidos seleccionados?`
    );
    if (!confirmar) return;
    try {
      for (const id of seleccionados) {
        await deleteDoc(doc(db, "pedidos", id));
        await registrarAuditoria("Eliminación múltiple de pedido", id);
      }

      setPedidos((prev) => prev.filter((p) => !seleccionados.includes(p.id)));
      setSeleccionados([]);
      alert("✅ Pedidos eliminados correctamente.");
    } catch (error) {
      alert("❌ Error al eliminar pedidos seleccionados.");
    }
  };

  return (
    <Container className="mt-5 mb-5 text-white">
      <h2 className="text-center mb-4 fw-bold">
        <FaBoxOpen className="me-2" /> Gestión de Pedidos
      </h2>

      {/* 🔍 BUSCADOR */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          placeholder="Ingresa el número de teléfono del cliente"
          className="form-control w-50 me-2 bg-dark text-white border-secondary"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <button
          className="btn btn-warning fw-bold me-2"
          onClick={buscarPedidos}
        >
          Buscar
        </button>
        <button
          className="btn btn-secondary fw-bold me-2"
          onClick={mostrarTodos}
        >
          Mostrar todos
        </button>
        <button
          className="btn btn-info fw-bold text-white"
          onClick={actualizarPedidos}
        >
          <FaSyncAlt className="me-1" /> Actualizar
        </button>
      </div>

      {/* 🔘 ELIMINAR SELECCIONADOS */}
      {pedidos.length > 0 && (
        <div className="text-center mb-3">
          <Button
            variant="danger"
            onClick={eliminarSeleccionados}
            disabled={seleccionados.length === 0}
          >
            <FaTrashAlt className="me-2" /> Eliminar seleccionados (
            {seleccionados.length})
          </Button>
        </div>
      )}



      {/* ⚠️ SIN RESULTADOS */}
      {!cargando && pedidos.length === 0 && (
        <p className="text-center text-muted">No se encontraron pedidos.</p>
      )}

      {/* 📦 TABLA DE PEDIDOS */}
      {pedidos.length > 0 && (
        <div className="table-responsive shadow-sm mt-4">
          <Table striped bordered hover variant="dark">
            <thead className="text-center align-middle">
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={seleccionados.length === pedidos.length}
                    onChange={seleccionarTodos}
                  />
                </th>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Estado envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={seleccionados.includes(pedido.id)}
                      onChange={() => toggleSeleccion(pedido.id)}
                    />
                  </td>
                  <td className="text-center fw-semibold">{pedido.id}</td>
                  <td>{pedido.cliente?.nombre || "Sin nombre"}</td>
                  <td>{pedido.cliente?.telefono || "N/A"}</td>
                  <td>
                    {Array.isArray(pedido.items) ? (
                      pedido.items.map((item, idx) => (
                        <div key={idx}>
                          • {item.nombre} × {item.cantidad} — $
                          {(item.precio * item.cantidad).toLocaleString()}
                        </div>
                      ))
                    ) : (
                      <span className="text-muted">Sin productos</span>
                    )}
                  </td>
                  <td className="fw-bold text-end">
                    ${pedido.total?.toLocaleString() || "0"}
                  </td>

                  {/* 💳 PAGO */}
                  <td className="text-center">
                    <select
                      className="form-select form-select-sm bg-dark text-white border-secondary"
                      value={pedido.pago || "Pendiente"}
                      onChange={(e) => {
                        const nuevoPago = e.target.value;
                        actualizarPago(pedido.id, nuevoPago);
                        setPedidos((prev) =>
                          prev.map((p) =>
                            p.id === pedido.id ? { ...p, pago: nuevoPago } : p
                          )
                        );
                      }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </td>

                  {/* 🚚 ESTADO */}
                  <td className="text-center">
                    <Badge bg={colorEstado(pedido.estado)} className="me-2">
                      {pedido.estado || "Pendiente"}
                    </Badge>
                    <select
                      className="form-select form-select-sm bg-dark text-white border-secondary"
                      value={pedido.estado || "En proceso"}
                      onChange={(e) => {
                        const nuevoEstado = e.target.value;
                        actualizarEstado(pedido.id, nuevoEstado);
                        setPedidos((prev) =>
                          prev.map((p) =>
                            p.id === pedido.id
                              ? { ...p, estado: nuevoEstado }
                              : p
                          )
                        );
                      }}
                    >
                      <option value="En proceso">En proceso</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </td>

                  {/* 🗑️ ELIMINAR */}
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarPedido(pedido.id)}
                    >
                      <FaTrashAlt /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}
