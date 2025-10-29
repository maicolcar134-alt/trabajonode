import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Events.css";
import logo from "../../assets/Explosión de color y energía.png"; // cambia la ruta si tu logo está en otro lugar
import userDefault from "../../assets/Explosión de color y energía.png"; // imagen por defecto

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
              {/* NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand onClick={() => navigate("/dashboard")} className="brand-logo">
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>
          

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => navigate("/Dashboard")} className="active-link">Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/Categorias")}>Categorias</Nav.Link>

              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>Ofertas</Nav.Link>
              <Nav.Link onClick={() => navigate("/Seguridad")}>seguridad</Nav.Link>
              
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link> 
              <Nav.Link onClick={() => navigate("/Admin")} className="text-warning">
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>
           

              {/* Botón de usuario o iniciar sesión */}
              {user ? (
                <Nav.Item className="logout-container" onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img src={userPhoto} alt="Foto de usuario" className="user-photo-nav" />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link onClick={() => navigate("/login")} className="d-flex align-items-center gap-2 fw-bold text-light">
                  <FaUser /> Acceder
                </Nav.Link>
              )}

              {/* Ícono carrito */}
              <Nav.Link onClick={() => navigate("/Carrito")} className="cart-icon">
                <FaShoppingCart />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      {/* HERO */}
      <section className="hero">
        <h1>Espectáculos Pirotécnicos para Eventos</h1>
        <p>Convierte tu evento en una experiencia inolvidable con nuestros shows profesionales.</p>
        <div className="hero-buttons">
          <button className="btn-primary">Solicitar Cotización</button>
          <button className="btn-secondary">Ver Portafolio</button>
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
        <button className="btn-light">+57 3213148729</button>
        <p className="small-text">Horario: Lunes a Viernes 7:00 - 18:00 | WhatsApp 24/7</p>
      </section>
    </div>
  );
}
