import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./HelpCenter.css";
import logo from "../../assets/Explosión de color y energía.png";



export default function HelpCenter() {
  const navigate = useNavigate();
  const user = false; // 🔸 cambia esto por tu lógica de autenticación real

  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Aquí agregas tu lógica real para cerrar sesión (Firebase, etc.)
  };

  return (
    <div className="helpcenter">
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
                    <img src={user} alt="Foto de usuario" className="user-photo-nav" />
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



      {/* 🔹 CONTENIDO PRINCIPAL */}
      <div className="header">
        <button className="btn-center">Centro de Ayuda</button>
        <h2>¿En qué podemos ayudarte?</h2>
        <p>
          Encuentra respuestas rápidas o contacta con nuestro equipo de soporte.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar en preguntas frecuentes..."
          />
        </div>
      </div>

      {/* 🔹 Tarjetas de contacto */}
      <div className="contact-section">
        <div className="card green">
          <h3>📞 Teléfono</h3>
          <p className="main">+57 3213148729</p>
          <p>🕒 L-V: 8:00–18:00, S: 9:00–13:00</p>
          <button>Contactar</button>
        </div>

        <div className="card blue">
          <h3>📧 Email</h3>
          <p className="main">soporte@pyroshop.co</p>
          <p>📬 Respuesta en 24h</p>
          <button>Contactar</button>
        </div>

        <div className="card orange">
          <h3>💬 WhatsApp</h3>
          <p className="main">+57 3213148729</p>
          <p>🕓 L-V: 7:00–21:00</p>
          <button>Contactar</button>
        </div>
      </div>

      {/* 🔹 Secciones de categorías */}
      <div className="categories">
        <button className="active">📦 Pedidos y Compras</button>
        <button>🚚 Envíos y Entregas</button>
        <button>🔁 Devoluciones y Cambios</button>
        <button>🔒 Seguridad y Legal</button>
        <button>👤 Cuenta y Perfil</button>
      </div>

      {/* 🔹 Preguntas frecuentes */}
      <div className="faq-section">
        <h3>Pedidos y Compras</h3>
        <details>
          <summary>¿Cómo hago un pedido?</summary>
          <p>
            Ingresa al catálogo, selecciona el producto y sigue los pasos del
            carrito hasta el pago.
          </p>
        </details>
        <details>
          <summary>¿Puedo cancelar o modificar mi pedido?</summary>
          <p>
            Puedes cancelarlo dentro de las primeras 2 horas comunicándote con
            nuestro soporte.
          </p>
        </details>
        <details>
          <summary>¿Qué formas de pago aceptan?</summary>
          <p>
            Aceptamos tarjetas de crédito, débito, transferencias y pagos en
            efectivo.
          </p>
        </details>
        <details>
          <summary>¿Emiten facturas?</summary>
          <p>
            Sí, enviamos la factura automáticamente a tu correo electrónico tras
            completar la compra.
          </p>
        </details>
      </div>

      {/* 🔹 Guías y Chat */}
      <div className="extra-section">
        <div className="guide purple">
          <h4>📘 Guías y Tutoriales</h4>
          <ul>
            <li>→ Cómo elegir el producto adecuado</li>
            <li>→ Guía de almacenamiento seguro</li>
            <li>→ Normativas por comunidad autónoma</li>
            <li>→ Calculadora de cantidad por evento</li>
          </ul>
        </div>

        <div className="support orange-dark">
          <h4>❓ ¿No encuentras respuesta?</h4>
          <p>
            Nuestro equipo está disponible para ayudarte con cualquier consulta
            específica.
          </p>
          <button>💬 Abrir Chat de Soporte</button>
          <small>Tiempo medio de respuesta: 5 minutos</small>
        </div>
      </div>
    </div>
  );
}
