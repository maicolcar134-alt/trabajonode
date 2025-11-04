import React, { useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Container, Spinner, Table, Badge, Button } from "react-bootstrap";
import { FaBoxOpen, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- Importar
import "./Pedidos.css";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate(); // <-- Hook de navegación

  const volverAdmin = () => {
    navigate("/Admin"); // <-- Ajusta la ruta según tu panel de admin
  };

  // 🔍 Buscar pedidos por número de teléfono
  const buscarPedidos = () => {
    if (!telefono.trim())
      return alert("Por favor ingresa tu número de teléfono");
    setCargando(true);
    const q = query(
      collection(db, "pedidos"),
      where("cliente.telefono", "==", telefono)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setPedidos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    });
    return () => unsub();
  };

  // 📋 Mostrar todos los pedidos
  const mostrarTodos = async () => {
    setCargando(true);
    const q = query(collection(db, "pedidos"));
    const snapshot = await getDocs(q);
    setPedidos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    setCargando(false);
  };

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

  // 🧾 Registrar en la colección de auditoría
  const registrarAuditoria = async (accion, idPedido, detalles = {}) => {
    try {
      await addDoc(collection(db, "auditoria_logs"), {
        accion,
        idPedido,
        detalles,
        fecha: serverTimestamp(),
        usuario: "Administrador",
      });
      console.log("Auditoría registrada:", accion);
    } catch (error) {
      console.error("Error registrando auditoría:", error);
    }
  };

  // ✅ Actualizar estado del pedido en Firestore y registrar log
  const actualizarEstado = async (idPedido, nuevoEstado) => {
    try {
      const ref = doc(db, "pedidos", idPedido);
      await updateDoc(ref, { estado: nuevoEstado });
      await registrarAuditoria("Cambio de estado", idPedido, {
        nuevoEstado,
      });
      alert("✅ Estado del pedido actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error al actualizar el estado del pedido.");
    }
  };

  // 💵 Actualizar estado de pago y registrar log
  const actualizarPago = async (idPedido, nuevoPago) => {
    try {
      const ref = doc(db, "pedidos", idPedido);
      await updateDoc(ref, { pago: nuevoPago });
      await registrarAuditoria("Actualización de pago", idPedido, {
        nuevoPago,
      });
      alert("✅ Estado del pago actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando pago:", error);
      alert("Error al actualizar el estado del pago.");
    }
  };

  return (
    <Container className="mt-5 mb-5 text-white">
      {/* BOTÓN REGRESAR AL ADMIN */}
      <div className="mb-3">
        <Button variant="secondary" onClick={volverAdmin}>
          <FaArrowLeft className="me-2" />
          Regresar al Admin
        </Button>
      </div>

      <h2 className="text-center mb-4 fw-bold">
        <FaBoxOpen className="me-2" />
        Gestión de Pedidos
      </h2>

      {/* 🔍 Barra de búsqueda */}
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
        <button className="btn btn-secondary fw-bold" onClick={mostrarTodos}>
          Mostrar todos
        </button>
      </div>

      {/* ⏳ Cargando */}
      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Cargando pedidos...</p>
        </div>
      )}

      {/* ⚠️ Sin resultados */}
      {!cargando && pedidos.length === 0 && (
        <p className="text-center text-muted">
          No se encontraron pedidos para mostrar.
        </p>
      )}

      {/* 📦 Tabla de pedidos */}
      {pedidos.length > 0 && (
        <div className="table-responsive shadow-sm mt-4">
          <Table striped bordered hover variant="dark">
            <thead className="text-center align-middle">
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Estado envío</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
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

                  {/* 💳 Estado de pago */}
                  <td className="text-center">
                    <select
                      className="form-select form-select-sm d-inline w-auto bg-dark text-white border-secondary"
                      value={pedido.pago || "Pendiente"}
                      onChange={(e) =>
                        actualizarPago(pedido.id, e.target.value)
                      }
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </td>

                  {/* 🚚 Estado de envío */}
                  <td className="text-center">
                    <Badge bg={colorEstado(pedido.estado)} className="me-2">
                      {pedido.estado || "Pendiente"}
                    </Badge>
                    <select
                      className="form-select form-select-sm d-inline w-auto bg-dark text-white border-secondary"
                      value={pedido.estado}
                      onChange={(e) =>
                        actualizarEstado(pedido.id, e.target.value)
                      }
                    >
                      <option value="En proceso">En proceso</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
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
