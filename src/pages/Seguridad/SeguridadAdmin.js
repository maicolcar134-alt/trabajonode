import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./SeguridadAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/Explosión de color y energía.png"; // cambia la ruta si tu logo está en otro lugar
import userPhoto from "../../assets/Explosión de color y energía.png"; // imagen por defecto




function SeguridadAdmin() {
  const navigate = useNavigate();
  const user = false; // cambia a tu lógica real de autenticación

  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Aquí puedes agregar tu lógica real para cerrar sesión (Firebase, etc.)
  };

  return(
     <div className="seguridad-container">
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
              <Nav.Link onClick={() => navigate("/productos")} className="cart-icon">
                <FaShoppingCart />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>



      {/* 🔹 CONTENIDO PRINCIPAL */}
      <header className="header">
        <h1 className="titulo-principal">Guía de Seguridad Pirotécnica</h1>
        <p className="subtitulo">
          Información esencial para el manejo responsable y seguro de productos
          pirotécnicos.
        </p>
      </header>

      <section className="bloque advertencia">
        <h2>⚠️ Advertencia Legal</h2>
        <p>
          El uso de artículos pirotécnicos está regulado por la ley. Solo deben
          ser manipulados por adultos responsables y en espacios autorizados.
          El incumplimiento puede acarrear sanciones legales y riesgos graves de
          salud.
        </p>
      </section>

      <section className="bloque vital">
        <h2>🧯 Información Vital</h2>
        <ul>
          <li>No apuntes fuegos artificiales hacia personas o animales.</li>
          <li>Evita encenderlos en espacios cerrados o con viento fuerte.</li>
          <li>Ten siempre a mano agua o un extintor de emergencia.</li>
        </ul>
      </section>

      <section className="bloque pasos">
        <h2>🚀 Antes, Durante y Después del Uso</h2>
        <div className="pasos-grid">
          <div className="paso">
            <h3>Antes</h3>
            <p>
              Verifica el estado del producto, lee las instrucciones y asegúrate
              de tener una zona despejada y segura.
            </p>
          </div>
          <div className="paso">
            <h3>Durante</h3>
            <p>
              Mantén una distancia prudente, evita el consumo de alcohol y sigue
              las recomendaciones del fabricante.
            </p>
          </div>
          <div className="paso">
            <h3>Después</h3>
            <p>
              Revisa que no queden residuos encendidos y limpia el área. No
              reutilices artículos fallados.
            </p>
          </div>
        </div>
      </section>

      <section className="bloque prohibiciones">
        <h2>🚫 Prohibiciones Éticas</h2>
        <ul>
          <li>No usar pirotecnia cerca de hospitales, animales o ancianos.</li>
          <li>No realizar demostraciones sin supervisión profesional.</li>
          <li>No vender productos ilegales o de origen desconocido.</li>
        </ul>
      </section>

      <section className="bloque emergencia">
        <h2>🚨 Protocolos de Emergencia</h2>
        <p>
          En caso de accidente, mantén la calma y busca ayuda médica inmediata.
          Llama a los números de emergencia locales y no apliques remedios sin
          conocimiento.
        </p>
        <button className="btn-protocolo">Ver Guía de Emergencia</button>
      </section>

      <section className="bloque faq">
        <h2>❓ Preguntas Frecuentes</h2>
        <details>
          <summary>¿Puedo usar pirotecnia en zonas residenciales?</summary>
          <p>
            No, salvo que las autoridades locales lo autoricen expresamente.
          </p>
        </details>
        <details>
          <summary>¿Qué hago si un producto no enciende?</summary>
          <p>
            Espera al menos 10 minutos, luego apágalo con agua. No intentes
            encenderlo de nuevo.
          </p>
        </details>
        <details>
          <summary>¿Los niños pueden manipular fuegos artificiales?</summary>
          <p>Absolutamente no. Solo adultos responsables deben hacerlo.</p>
        </details>
      </section>

      <footer className="footer">
        <h3>📄 Documentación y Recursos</h3>
        <p>
          Descarga el reglamento completo y materiales educativos oficiales.
        </p>
        <button className="btn-descarga">Descargar PDF</button>
      </footer>
    </div>
  );
}

export default SeguridadAdmin;
