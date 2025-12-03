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
import { Container, Table, Badge, Button, Form } from "react-bootstrap";
import { FaBoxOpen, FaTrashAlt, FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Pedidos.css";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listenerActivo, setListenerActivo] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 20;
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // BUSCAR PEDIDOS POR TELÉFONO
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // MOSTRAR TODOS
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // ACTUALIZAR
  // ---------------------------------------------------------
  const actualizarPedidos = async () => {
    setCargando(true);
    const snapshot = await getDocs(collection(db, "pedidos"));
    setPedidos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    setCargando(false);
  };

  useEffect(() => {
    mostrarTodos();
    return () => {
      if (listenerActivo) listenerActivo();
    };
  }, []);

  // ---------------------------------------------------------
  // COLORES
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // AUDITORÍA
  // ---------------------------------------------------------
  const registrarAuditoria = async (accion, idPedido, detalles = {}) => {
    try {
      await addDoc(collection(db, "auditoria_logs"), {
        accion,
        idPedido,
        detalles,
        fecha: serverTimestamp(),
        usuario: "Administrador",
      });
    } catch (error) {}
  };

  // ---------------------------------------------------------
  // ACTUALIZAR ESTADO
  // ---------------------------------------------------------
  const actualizarEstado = async (idPedido, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "pedidos", idPedido), { estado: nuevoEstado });
      registrarAuditoria("Cambio estado", idPedido, { nuevoEstado });
    } catch (error) {
      alert("Error al actualizar el estado.");
    }
  };

  // ---------------------------------------------------------
  // ACTUALIZAR PAGO
  // ---------------------------------------------------------
  const actualizarPago = async (idPedido, nuevoPago) => {
    try {
      await updateDoc(doc(db, "pedidos", idPedido), { pago: nuevoPago });
      registrarAuditoria("Cambio pago", idPedido, { nuevoPago });
    } catch (error) {
      alert("Error al actualizar el pago.");
    }
  };

  // ---------------------------------------------------------
  // ELIMINAR 1 PEDIDO
  // ---------------------------------------------------------
  const eliminarPedido = async (idPedido) => {
    if (!window.confirm("¿Seguro?")) return;

    try {
      await deleteDoc(doc(db, "pedidos", idPedido));
      registrarAuditoria("Eliminar pedido", idPedido);
      setPedidos((prev) => prev.filter((p) => p.id !== idPedido));
    } catch (error) {
      alert("Error eliminando el pedido.");
    }
  };

  // ---------------------------------------------------------
  // SELECCIONAR
  // ---------------------------------------------------------
  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const seleccionarTodos = () => {
    if (seleccionados.length === pedidos.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(pedidos.map((p) => p.id));
    }
  };

  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) {
      alert("No hay pedidos seleccionados.");
      return;
    }

    if (!window.confirm("¿Eliminar pedidos seleccionados?")) return;

    try {
      for (const id of seleccionados) {
        await deleteDoc(doc(db, "pedidos", id));
        registrarAuditoria("Eliminar múltiple", id);
      }

      setPedidos((prev) => prev.filter((p) => !seleccionados.includes(p.id)));
      setSeleccionados([]);
    } catch (error) {
      alert("Error eliminando pedidos.");
    }
  };

  return (
    <Container className="mt-5 mb-5 text-white">
      <h2 className="text-center mb-4 fw-bold">
        <FaBoxOpen className="me-2" /> Gestión de Pedidos
      </h2>

      {/* ---------------- BUSCADOR ---------------- */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          placeholder="Teléfono del cliente"
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

      {/* ---------------- BOTÓN ELIMINAR SELECCIONADOS ---------------- */}
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

      {/* ---------------- TABLA ---------------- */}
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
                  <td>{pedido.cliente?.nombre}</td>
                  <td>{pedido.cliente?.telefono}</td>

                  <td>
                    {pedido.items?.map((item, i) => (
                      <div key={i}>
                        • {item.nombre} × {item.cantidad} — $
                        {(item.precio * item.cantidad).toLocaleString()}
                      </div>
                    ))}
                  </td>

                  <td className="fw-bold text-end">
                    ${pedido.total?.toLocaleString()}
                  </td>

                  {/* PAGO */}
                  <td className="text-center">
                    <select
                      className="form-select form-select-sm bg-dark text-white border-secondary"
                      value={pedido.pago}
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

                  {/* ESTADO */}
                  <td className="text-center">
                    <Badge bg={colorEstado(pedido.estado)} className="me-2">
                      {pedido.estado}
                    </Badge>

                    <select
                      className="form-select form-select-sm bg-dark text-white border-secondary"
                      value={pedido.estado}
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

                  {/* ACCIONES */}
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarPedido(pedido.id)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {pedidos.length === 0 && !cargando && (
        <p className="text-center text-muted">No se encontraron pedidos</p>
      )}
    </Container>
  );
}
