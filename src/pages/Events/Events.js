import React from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";
import userDefault from "../../assets/Explosión de color y energía.png"; 


 import DashboardNavbar from "../components/Navbar";

export default function EventsPage() {
  const navigate = useNavigate();
  const user = true; // simula usuario logueado (cámbialo según tu auth)
  const userPhoto = user ? userDefault : null;

  const handleLogout = () => {
    alert("Sesión cerrada correctamente");
    navigate("/dashboard");
  };

  const eventPackages = [
    {
      id: "bodas",
      name: "Bodas y Celebraciones",
      description:
        "Haz inolvidable tu día especial con un espectáculo pirotécnico personalizado.",
      price: "$3.500.000",
      duration: "10-15 minutos",
      features: [
        "Fuentes de chispas doradas",
        "Bengalas frías para entrada de novios",
        "Batería final de colores",
      ],
      category: "Premium",
    },
    {
      id: "corporativos",
      name: "Eventos Corporativos",
      description:
        "Impresiona a tus clientes y colaboradores con un show profesional.",
      price: "$5.200.000",
      duration: "15-20 minutos",
      features: [
        "Colores corporativos",
        "Sincronización con música",
        "Video promocional incluido",
      ],
      category: "Premium",
    },
    {
      id: "cumpleanos",
      name: "Cumpleaños y Fiestas",
      description:
        "Celebra tu día especial con efectos pirotécnicos seguros y espectaculares.",
      price: "$1.500.000",
      duration: "5-8 minutos",
      features: [
        "Fuentes de colores",
        "Bengalas personalizadas",
        "Efectos sin humo disponibles",
      ],
      category: "Standard",
    },
  ];

  const processSteps = [
    { number: 1, title: "Consulta Inicial", text: "Cuéntanos sobre tu evento y tus ideas." },
    { number: 2, title: "Propuesta Personalizada", text: "Diseñamos un show a tu medida." },
    { number: 3, title: "Permisos y Planificación", text: "Gestionamos todo el proceso técnico y legal." },
    { number: 4, title: "Ejecución del Evento", text: "Nuestro equipo realiza el show con total seguridad." },
  ];

  const upcomingEvents = [
    { name: "Festival de Verano Ocaña", date: "15 Dic 2025", location: "Parque San Francisco", status: "Confirmado" },
    { name: "Celebración Año Nuevo", date: "31 Dic 2025", location: "Club Campestre", status: "Próximamente" },
  ];

  return (
    <div className="events-page">
   
        <>
      <DashboardNavbar />
    </>

      {/* HERO */}
      <section className="hero">
        <h1>Espectáculos Pirotécnicos para Eventos</h1>
        <p>Convierte tu evento en una experiencia inolvidable con nuestros shows profesionales.</p>
        <div className="hero-buttons">
        <a
          href="https://wa.me/573213148729?text=¡Hola!%20Estoy%20interesado%20en%20una%20cotización%20de%20espectáculos%20pirotécnicos."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Solicitar Cotización
        </a>
        </div>
      </section>

      {/* PAQUETES */}
      <section className="section">
        <h2>Paquetes Disponibles</h2>
        <div className="cards">
          {eventPackages.map((pkg) => (
            <div key={pkg.id} className="card">
              <h3>{pkg.name}</h3>
              <p className="category">{pkg.category}</p>
              <p>{pkg.description}</p>
              <p className="price">{pkg.price}</p>
              <p><strong>Duración:</strong> {pkg.duration}</p>
              <ul>
                {pkg.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <button className="btn-primary small">Solicitar Información</button>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="section process">
        <h2>Cómo Trabajamos</h2>
        <div className="steps">
          {processSteps.map((s) => (
            <div key={s.number} className="step">
              <div className="step-number">{s.number}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS */}
      <section className="section">
        <h2>Próximos Eventos</h2>
        <div className="cards">
          {upcomingEvents.map((e, i) => (
            <div key={i} className="card small">
              <h3>{e.name}</h3>
              <p>{e.date}</p>
              <p>{e.location}</p>
              <p className={e.status === "Confirmado" ? "ok" : "pending"}>{e.status}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section className="cta">
        <h2>¿Listo para un evento memorable?</h2>
        <p>Contáctanos hoy para recibir una propuesta personalizada.</p>
       {/* <button className="btn-light">+57 3213148729 </button> */}
        <p className="small-text">Horario: Lunes a Viernes 7:00 - 18:00 | WhatsApp 24/7</p>
      </section>
    </div>
  );
}
