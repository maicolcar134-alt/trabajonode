import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Container, Table, Spinner, Badge, Button } from "react-bootstrap";
import {
  FaClipboardList,
  FaArrowLeft,
  FaTrashAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Auditoria.css";

export default function Auditoria() {
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);
  const navigate = useNavigate();

  const volverAdmin = () => {
    navigate("/dashboard"); // Ajusta la ruta a tu panel de admin
  };

  const cargarLogs = () => {
    setCargando(true);
    const q = query(collection(db, "auditoria_logs"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
      setCargando(false);
    });
    return unsub;
  };

  useEffect(() => {
    const unsub = cargarLogs();
    return () => unsub();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "--";
    const date = new Date(fecha.seconds * 1000);
    return date.toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // Eliminar registro individual
  const eliminarRegistro = async (id, pedidoId) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar el registro con Pedido ID ${pedidoId}?`
      )
    )
      return;

    try {
      setEliminandoId(id);
      await deleteDoc(doc(db, "auditoria_logs", id));
      alert(`✅ Registro con Pedido ID ${pedidoId} eliminado correctamente.`);
      setEliminandoId(null);
    } catch (error) {
      console.error("Error eliminando registro:", error);
      alert("❌ Ocurrió un error al eliminar el registro.");
      setEliminandoId(null);
    }
  };

  return (
    <Container className="mt-5 mb-5 text-white">
      {/* BOTÓN REGRESAR AL ADMIN */}
      <div className="mb-3 text-start">
        <Button variant="secondary" onClick={volverAdmin}>
          <FaArrowLeft className="me-2" />
          Regresar al Admin
        </Button>
      </div>

      {/* Título */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-warning">
          <FaClipboardList className="me-2" />
          Auditoría del Sistema
        </h2>
        <p className="text-muted">
          Registros automáticos de cambios en pedidos, pagos y estados.
        </p>
      </div>

      {/* Botón actualizar */}
      <div className="text-center mb-3">
        <Button variant="warning" className="me-2" onClick={cargarLogs}>
          <FaSyncAlt className="me-1" /> Actualizar
        </Button>
      </div>

      {/* Cargando */}
      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="light" />
          <p className="mt-2">Cargando registros...</p>
        </div>
      )}

      {/* Sin registros */}
      {!cargando && logs.length === 0 && (
        <p className="text-center text-muted">No hay registros de auditoría.</p>
      )}

      {/* Tabla */}
      {logs.length > 0 && (
        <div className="table-responsive shadow-lg rounded mt-4">
          <Table striped bordered hover variant="dark" className="align-middle">
            <thead className="text-center table-warning text-dark">
              <tr>
                <th>#</th>
                <th>Pedido ID</th>
                <th>Campo</th>
                <th>Valor anterior</th>
                <th>Nuevo valor</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="fw-bold text-info">{log.pedidoId}</td>
                  <td className="text-center">
                    <Badge bg="secondary">{log.campo}</Badge>
                  </td>
                  <td className="text-danger text-center">
                    {log.valorAnterior || "--"}
                  </td>
                  <td className="text-success text-center">
                    {log.nuevoValor || "--"}
                  </td>
                  <td>{log.descripcion}</td>
                  <td className="text-center">{formatearFecha(log.fecha)}</td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarRegistro(log.id, log.pedidoId)}
                      disabled={eliminandoId === log.id}
                    >
                      {eliminandoId === log.id ? (
                        "Eliminando..."
                      ) : (
                        <FaTrashAlt />
                      )}
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
