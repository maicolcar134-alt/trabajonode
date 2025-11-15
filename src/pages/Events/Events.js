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

      <footer className="footer mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warm)] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🎆</span>
                </div>
                <div>
                  <h3 className="m-0">PyroShop</h3>
                  <p className="text-sm text-white/70 m-0">Pirotecnia Legal</p>
                </div>
              </div>
              <p className="text-sm text-white/80">
                Venta legal y responsable de pirotecnia certificada.
              </p>
            </div>

            <div>
              <h4 className="mb-4">Legal y Seguridad</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <a
                    href="/politicasventa"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Política de Venta Responsable
                  </a>
                </li>
                <li>
                  <a
                    href="/terminoscondiciones"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a
                    href="/PoliticasPrivacidad"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="/normativaregulacion"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Normativa y Regulación
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <a
                    href="/Seguridad"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline"
                  >
                    Guía de Seguridad
                  </a>
                </li>
                <li>
                  <a
                    href="/HelpCenter"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline"
                  >
                    Ayuda al Usuario
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Contacto</h4>
              <ul className="space-y-3 list-none p-0 m-0">
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>+573213148729</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>info@pyroshop.co</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>
                    Calle 12 # 45-67
                    <br />
                    Ocaña, Norte de Santander
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-white/90 m-0">
              <strong>Aviso Legal:</strong> La venta de artículos pirotécnicos
              está sujeta a la normativa vigente. Está prohibida la venta a
              menores de 18 años. El comprador se compromete a usar los
              productos de forma responsable y siguiendo todas las instrucciones
              de seguridad. PyroShop no se hace responsable del uso inadecuado
              de los productos.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p className="m-0">
              © 2025 PyroShop. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
