import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

import { motion } from "framer-motion";
import {
  Button,
  Modal,
  Form,
  Table,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";

import "./EventosAdmin.css";

export default function EventosAdmin() {
  const [eventos, setEventos] = useState([]);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [eventoActual, setEventoActual] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora: "",
    tipo: "",
    estado: "Pendiente",
    video: "",
  });

  /* ================================
  CARGAR EVENTOS
  ================================ */
  const cargarEventos = async () => {
    const res = await getDocs(collection(db, "eventos"));
    const data = res.docs.map((d) => ({ id: d.id, ...d.data() }));
    setEventos(data);
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  /* ================================
  CREAR EVENTO
  ================================ */
  const crearEvento = async () => {
    try {
      await addDoc(collection(db, "eventos"), {
        ...form,
      });

      setModalAgregar(false);
      resetForm();
      cargarEventos();
    } catch (error) {
      console.error(error);
      alert("Error al crear evento.");
    }
  };

  /* ================================
  ACTUALIZAR EVENTO
  ================================ */
  const actualizarEvento = async () => {
    try {
      const refDoc = doc(db, "eventos", eventoActual.id);

      await updateDoc(refDoc, {
        ...form,
      });

      setModalEditar(false);
      resetForm();
      cargarEventos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar evento.");
    }
  };

  /* ================================
  ELIMINAR EVENTO
  ================================ */
  const eliminarEvento = async (id) => {
    try {
      await deleteDoc(doc(db, "eventos", id));
      cargarEventos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar evento.");
    }
  };

  /* ================================
  RESET FORM
  ================================ */
  const resetForm = () => {
    setForm({
      nombre: "",
      descripcion: "",
      fecha: "",
      hora: "",
      tipo: "",
      estado: "Pendiente",
      video: "",
    });
  };

  /* ================================
  ABRIR MODAL EDITAR
  ================================ */
  const abrirEditar = (ev) => {
    setEventoActual(ev);
    setForm({
      nombre: ev.nombre,
      descripcion: ev.descripcion,
      fecha: ev.fecha,
      hora: ev.hora,
      tipo: ev.tipo,
      estado: ev.estado,
      video: ev.video || "",
    });
    setModalEditar(true);
  };

  /* ================================
  RENDER
  ================================ */
  return (
    <Container className="eventos-admin-container">
      <motion.h1
        className="titulo-admin"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Panel de Administración – Eventos
      </motion.h1>

      <Button className="btn-agregar" onClick={() => setModalAgregar(true)}>
        + Agregar Evento
      </Button>

      <Card className="card-tabla">
        <Card.Body>
          <Table
            striped
            bordered
            hover
            responsive
            variant="dark"
            className="tabla-eventos"
          >
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Video</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {eventos.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.nombre}</td>
                  <td>{ev.descripcion}</td>
                  <td>{ev.fecha}</td>
                  <td>{ev.hora}</td>
                  <td>{ev.tipo}</td>
                  <td>
                    <span
                      className={
                        ev.estado === "Confirmado"
                          ? "estado-confirmado"
                          : "estado-pendiente"
                      }
                    >
                      {ev.estado}
                    </span>
                  </td>

                  <td>
                    {ev.video ? (
                      <a
                        href={ev.video}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver Video
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => abrirEditar(ev)}
                      className="mx-1"
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarEvento(ev.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* MODAL AGREGAR */}
      <Modal show={modalAgregar} onHide={() => setModalAgregar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Evento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
            </Form.Group>

            <Row className="mt-3">
              <Col>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                />
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="Concierto">Concierto</option>
                <option value="Festival">Festival</option>
                <option value="Cultural">Cultural</option>
                <option value="Deportivo">Deportivo</option>
                <option value="Gastronomía">Gastronomía</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmado">Confirmado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Video (URL)</Form.Label>
              <Form.Control
                type="text"
                value={form.video}
                onChange={(e) => setForm({ ...form, video: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalAgregar(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={crearEvento}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal show={modalEditar} onHide={() => setModalEditar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Evento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />
            </Form.Group>

            <Row className="mt-3">
              <Col>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                />
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="Concierto">Concierto</option>
                <option value="Festival">Festival</option>
                <option value="Cultural">Cultural</option>
                <option value="Deportivo">Deportivo</option>
                <option value="Gastronomía">Gastronomía</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmado">Confirmado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Video (URL)</Form.Label>
              <Form.Control
                type="text"
                value={form.video}
                onChange={(e) => setForm({ ...form, video: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalEditar(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={actualizarEvento}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
