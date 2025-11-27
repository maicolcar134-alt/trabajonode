import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  limit,
  startAfter,
  endBefore,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import {
  Container,
  Table,
  Spinner,
  Badge,
  Button,
  Form,
  Collapse,
} from "react-bootstrap";
import {
  FaClipboardList,
  FaTrashAlt,
  FaSyncAlt,
  FaArrowLeft,
  FaArrowRight,
  FaEye,
} from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Auditoria.css";

export default function Auditoria() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [cargandoLogs, setCargandoLogs] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [seleccionadosLogs, setSeleccionadosLogs] = useState([]);

  // 📄 Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [ultimoVisible, setUltimoVisible] = useState(null);
  const [primerVisible, setPrimerVisible] = useState(null);
  const [bloquearSiguiente, setBloquearSiguiente] = useState(false);
  const [bloquearAnterior, setBloquearAnterior] = useState(true);

  // 📄 Estado para mostrar/ocultar detalles
  const [detallesAbiertos, setDetallesAbiertos] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // ---------------------------
  // == FUNCIONES DE AUDITORÍA ==
  // ---------------------------

  const cargarLogs = (direction = "inicio") => {
    setCargandoLogs(true);

    let q = query(
      collection(db, "auditoria_logs"),
      orderBy("fecha", "desc"),
      limit(10)
    );

    if (direction === "next" && ultimoVisible) {
      q = query(
        collection(db, "auditoria_logs"),
        orderBy("fecha", "desc"),
        startAfter(ultimoVisible),
        limit(10)
      );
    } else if (direction === "prev" && primerVisible) {
      q = query(
        collection(db, "auditoria_logs"),
        orderBy("fecha", "desc"),
        endBefore(primerVisible),
        limit(10)
      );
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLogs(data);
      setCargandoLogs(false);

      if (data.length > 0) {
        setPrimerVisible(snapshot.docs[0]);
        setUltimoVisible(snapshot.docs[snapshot.docs.length - 1]);
      }

      if (direction === "next") {
        setPaginaActual((prev) => prev + 1);
        setBloquearAnterior(false);
        setBloquearSiguiente(data.length < 10);
      } else if (direction === "prev") {
        setPaginaActual((prev) => Math.max(prev - 1, 1));
        setBloquearSiguiente(false);
        setBloquearAnterior(paginaActual - 1 === 1);
      } else {
        setPaginaActual(1);
        setBloquearAnterior(true);
        setBloquearSiguiente(data.length < 10);
      }
    });

    return unsub;
  };

  useEffect(() => {
    const unsub = cargarLogs("inicio");
    return () => unsub();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "--";
    if (fecha.seconds) {
      const date = new Date(fecha.seconds * 1000);
      return date.toLocaleString("es-CO", {
        dateStyle: "short",
        timeStyle: "short",
      });
    }
    return new Date(fecha).toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const eliminarRegistro = async (id) => {
    if (!window.confirm("¿Eliminar este registro de auditoría?")) return;
    try {
      setEliminandoId(id);
      await deleteDoc(doc(db, "auditoria_logs", id));
      setEliminandoId(null);
    } catch (error) {
      console.error("Error eliminando registro:", error);
      alert("❌ Error al eliminar el registro.");
      setEliminandoId(null);
    }
  };

  const toggleDetalles = (id) => {
    setDetallesAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ---------------------------
  // == RENDER AUDITORÍA ==
  // ---------------------------

  return (
    <Container className="mt-4 mb-5">
      <div className="bg-dark p-3 rounded shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-warning mb-0">
            <FaClipboardList className="me-2" />
            Registros de Auditoría (página {paginaActual})
          </h5>
        </div>

        {cargandoLogs ? (
          <div className="text-center my-3">
            <Spinner animation="border" variant="light" />
            <p className="mt-2">Cargando registros...</p>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-muted">No hay registros de auditoría.</p>
        ) : (
          <>
            <div className="table-responsive mt-2">
              <Table
                striped
                bordered
                hover
                variant="dark"
                className="align-middle"
              >
                <thead className="text-center table-warning text-dark">
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Acción</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Detalles completos</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      <tr>
                        <td className="text-center">
                          {(paginaActual - 1) * 10 + index + 1}
                        </td>
                        <td className="text-info fw-bold">
                          {log.pedidoId || log.id}
                        </td>
                        <td className="text-center">
                          <Badge bg="secondary">{log.accion || "—"}</Badge>
                        </td>
                        <td className="text-center">
                          {log.usuario
                            ? log.usuario.email || log.usuario.uid
                            : "--"}
                        </td>
                        <td className="text-center">
                          {formatearFecha(log.fecha)}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => toggleDetalles(log.id)}
                          >
                            <FaEye /> Ver
                          </Button>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => eliminarRegistro(log.id)}
                            disabled={eliminandoId === log.id}
                          >
                            {eliminandoId === log.id ? "..." : <FaTrashAlt />}
                          </Button>
                        </td>
                      </tr>

                      {/* 🔹 Detalles completos expandibles */}
                      <tr>
                        <td colSpan="7" className="p-0">
                          <Collapse in={!!detallesAbiertos[log.id]}>
                            <div className="bg-black text-light p-3">
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                }}
                              >
                                {JSON.stringify(log, null, 2)}
                              </pre>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* 🔹 Controles de paginación */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="outline-warning"
                onClick={() => cargarLogs("prev")}
                disabled={bloquearAnterior}
              >
                <FaArrowLeft /> Anterior
              </Button>

              <span className="text-light fw-bold">Página {paginaActual}</span>

              <Button
                variant="outline-warning"
                onClick={() => cargarLogs("next")}
                disabled={bloquearSiguiente}
              >
                Siguiente <FaArrowRight />
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
