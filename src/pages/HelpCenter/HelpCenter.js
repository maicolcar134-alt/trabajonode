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
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            className="brand-logo"
          >
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link
                onClick={() => navigate("/Dashboard")}
                className="active-link"
              >
                Inicio
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/Categorias")}>
                Categorias
              </Nav.Link>

              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>
                Ofertas
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/Seguridad")}>
                seguridad
              </Nav.Link>

              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>
              <Nav.Link
                onClick={() => navigate("/Admin")}
                className="text-warning"
              >
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>

              {/* Botón de usuario o iniciar sesión */}
              {user ? (
                <Nav.Item className="logout-container" onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img
                      src={user}
                      alt="Foto de usuario"
                      className="user-photo-nav"
                    />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link
                  onClick={() => navigate("/login")}
                  className="d-flex align-items-center gap-2 fw-bold text-light"
                >
                  <FaUser /> Acceder
                </Nav.Link>
              )}

              {/* Ícono carrito */}
              <Nav.Link
                onClick={() => navigate("/Carrito")}
                className="cart-icon"
              >
                <FaShoppingCart />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <div className="header">
        <h2>Centro De Ayuda</h2>
        <br></br>
        <h2>¿En qué podemos ayudarte?</h2>
        <p>
          Encuentra respuestas rápidas o contacta con nuestro equipo de soporte.
        </p>
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
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pyroshopmc@gmail.com"
            class="btn-soporte"
          >
            💬 Abrir Chat de Soporte
          </a>
          <small>Tiempo medio de respuesta: 5 minutos</small>
        </div>
      </div>

      <div className="contact-section">
        {/* Teléfono */}
        <div className="card green">
          <h3>📞 Teléfono</h3>
          <p className="main">+57 3213148729</p>
          <p>🕒 L-V: 8:00–18:00, S: 9:00–13:00</p>

          <a href="tel:+573213148729" className="btn-contact">
            Contactar
          </a>
        </div>

        {/* Email */}
        <div className="card blue">
          <h3>📧 Email</h3>
          <p className="main">pyroshopmc@gmail.com</p>
          <p>📬 Respuesta en 24h</p>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pyroshopmc@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contact"
          >
            Contactar
          </a>
        </div>

        {/* WhatsApp */}
        <div className="card orange">
          <h3>💬 WhatsApp</h3>
          <p className="main">+57 3213148729</p>
          <p>🕓 L-V: 7:00–21:00</p>

          <a
            href="https://wa.me/573213148729"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contact"
          >
            Contactar
          </a>
        </div>
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
    </div>
  );
}
