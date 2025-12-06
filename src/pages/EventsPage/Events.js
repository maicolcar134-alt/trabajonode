import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EventosCliente() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [recomendado, setRecomendado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerEventos = async () => {
      const res = await getDocs(collection(db, "eventos"));
      const lista = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setEventos(lista);

      const proximos = [...lista].sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
      );

      setRecomendado(proximos[0] || null);
      setCargando(false);
    };

    obtenerEventos();
  }, []);

  const eventosFiltrados =
    filtro === "Todos" ? eventos : eventos.filter((e) => e.tipo === filtro);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">🎉 Eventos Disponibles</h1>
        <p className="text-muted">Consulta los próximos eventos programados</p>
      </div>

      {/* Evento recomendado */}
      {recomendado && (
        <div className="p-4 mb-4 rounded shadow-lg bg-light">
          <h4 className="fw-bold text-primary">⭐ Evento Recomendado</h4>
          <p className="text-muted">Basado en la fecha más próxima</p>

          <div className="card border-0 shadow-sm mt-3">
            {/* Imagen recomendada con lazy loading */}
            {recomendado.imagen && (
              <img
                src={recomendado.imagen}
                alt={recomendado.nombre}
                className="card-img-top"
                loading="lazy"
              />
            )}

            <div className="card-body">
              <h3 className="card-title">{recomendado.nombre}</h3>

              <p>
                <strong>Tipo:</strong> {recomendado.tipo}
              </p>
              <p>
                <strong>Fecha:</strong> {recomendado.fecha}
              </p>
              <p>
                <strong>Hora:</strong> {recomendado.hora}
              </p>
              <p>{recomendado.descripcion}</p>

              {recomendado.video && (
                <a
                  href={recomendado.video}
                  target="_blank"
                  className="btn btn-danger mt-2"
                  rel="noopener noreferrer"
                >
                  🎬 Ver Video del Evento
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filtro */}
      <div className="mb-4">
        <label className="fw-bold">Filtrar por tipo:</label>
        <select
          className="form-select mt-2"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Concierto">Concierto</option>
          <option value="Festival">Festival</option>
          <option value="Gastronomía">Gastronomía</option>
          <option value="Cultural">Cultural</option>
          <option value="Deportivo">Deportivo</option>
        </select>
      </div>

      {/* Lista de eventos */}
      {cargando ? (
        <p className="text-center text-muted">Cargando eventos...</p>
      ) : eventosFiltrados.length === 0 ? (
        <p className="text-center text-danger">No hay eventos disponibles.</p>
      ) : (
        <div className="row">
          {eventosFiltrados.map((evento) => (
            <div className="col-md-4 mb-4" key={evento.id}>
              <div className="card shadow-sm h-100">

                {/* Imagen del evento con Lazy Loading */}
                {evento.imagen && (
                  <img
                    src={evento.imagen}
                    alt={evento.nombre}
                    className="card-img-top"
                    loading="lazy"
                  />
                )}

                {/* Encabezado del evento */}
                <div className="card-body">
                  <h5 className="card-title fw-bold">{evento.nombre}</h5>

                  <p className="card-text text-muted">{evento.descripcion}</p>

                  <p>
                    <strong>Fecha:</strong> {evento.fecha}
                  </p>
                  <p>
                    <strong>Hora:</strong> {evento.hora}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {evento.tipo}
                  </p>

                  {evento.estado === "Confirmado" ? (
                    <span className="badge bg-success">Confirmado</span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
