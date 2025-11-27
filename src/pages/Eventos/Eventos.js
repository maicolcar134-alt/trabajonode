
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Eventos.css";

function EventoCard({ evento, esAdmin, onEditar, onEliminar }) {
  const [localEvento, setLocalEvento] = useState({ ...evento });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        localEvento.nombre !== evento.nombre ||
        localEvento.fecha !== evento.fecha ||
        localEvento.direccion !== evento.direccion ||
        localEvento.ciudad !== evento.ciudad ||
        localEvento.status !== evento.status
      ) {
        onEditar(evento.id, localEvento);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [localEvento]);

  const handleChange = (campo) => (e) => {
    setLocalEvento((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  return (
    <div className="card">
      <h3>
        {esAdmin ? (
          <input type="text" value={localEvento.nombre} onChange={handleChange("nombre")} />
        ) : (
          localEvento.nombre
        )}
      </h3>
      <p>
        <strong>Fecha:</strong>{" "}
        {esAdmin ? (
          <input type="date" value={localEvento.fecha} onChange={handleChange("fecha")} />
        ) : (
          localEvento.fecha
        )}
      </p>
      <p>
        <strong>Dirección:</strong>{" "}
        {esAdmin ? (
          <input type="text" value={localEvento.direccion} onChange={handleChange("direccion")} />
        ) : (
          localEvento.direccion
        )}
      </p>
      <p>
        <strong>Ciudad:</strong>{" "}
        {esAdmin ? (
          <input type="text" value={localEvento.ciudad} onChange={handleChange("ciudad")} />
        ) : (
          localEvento.ciudad
        )}
      </p>
      <p className={localEvento.status === "Confirmado" ? "ok" : "pending"}>
        {esAdmin ? (
          <select value={localEvento.status} onChange={handleChange("status")}>
            <option value="Próximamente">Próximamente</option>
            <option value="Confirmado">Confirmado</option>
          </select>
        ) : (
          localEvento.status
        )}
      </p>
      {esAdmin && (
        <button
          className="btn-danger"
          onClick={() => {
            if (window.confirm("¿Eliminar este evento?")) onEliminar(evento.id);
          }}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}

export default function EventosAdminAgregar() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    fecha: "",
    direccion: "",
    ciudad: "",
    status: "Próximamente",
  });

  const esAdmin = true;

  useEffect(() => {
    const cargarEventos = async () => {
      setCargando(true);
      const snapshot = await getDocs(collection(db, "eventos"));
      setEventos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCargando(false);
    };
    cargarEventos();
  }, []);

  const agregarEvento = async () => {
    const { nombre, fecha, direccion, ciudad } = nuevoEvento;
    if (!nombre || !fecha || !direccion || !ciudad) {
      toast.error("Completa todos los campos antes de agregar un evento.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "eventos"), nuevoEvento);
      setEventos((prev) => [...prev, { id: docRef.id, ...nuevoEvento }]);
      setNuevoEvento({ nombre: "", fecha: "", direccion: "", ciudad: "", status: "Próximamente" });
      toast.success("Evento agregado correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar evento.");
    }
  };

  const eliminarEvento = async (id) => {
    try {
      await deleteDoc(doc(db, "eventos", id));
      setEventos((prev) => prev.filter((e) => e.id !== id));
      toast.info("Evento eliminado.");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar evento.");
    }
  };

  const editarEvento = async (id, eventoActualizado) => {
    try {
      await updateDoc(doc(db, "eventos", id), { ...eventoActualizado });
      setEventos((prev) =>
        prev.map((e) => (e.id === id ? { ...eventoActualizado, id } : e))
      );
      toast.success("Evento actualizado.");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar evento.");
    }
  };

  return (
    <div className="events-page">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <section className="hero">
        <h1>Gestión de Eventos</h1>
        <p>Administra tus eventos</p>
      </section>

      {esAdmin && (
        <section className="section">
          <h2>Agregar Nuevo Evento</h2>
          <div className="form-agregar">
            <input
              type="text"
              placeholder="Nombre del evento"
              value={nuevoEvento.nombre}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
            />
            <input
              type="date"
              placeholder="Fecha"
              value={nuevoEvento.fecha}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dirección"
              value={nuevoEvento.direccion}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, direccion: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={nuevoEvento.ciudad}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, ciudad: e.target.value })}
            />
            <select
              value={nuevoEvento.status}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, status: e.target.value })}
            >
              <option value="Próximamente">Próximamente</option>
              <option value="Confirmado">Confirmado</option>
            </select>
            <button className="btn-primary" onClick={agregarEvento}>
              Agregar Evento
            </button>
          </div>
        </section>
      )}

      <section className="section">
        <h2>Eventos Existentes</h2>
        {cargando ? (
          <p>Cargando eventos...</p>
        ) : eventos.length === 0 ? (
          <p>No hay eventos disponibles.</p>
        ) : (
          <div className="cards">
            {eventos.map((e) => (
              <EventoCard
                key={e.id}
                evento={e}
                esAdmin={esAdmin}
                onEditar={editarEvento}
                onEliminar={eliminarEvento}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
