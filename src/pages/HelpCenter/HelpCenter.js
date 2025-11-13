import React from "react";
import { Navbar, Badge, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./HelpCenter.css";
import logo from "../../assets/Explosión de color y energía.png";
import userPhotoDefault from "../../assets/Explosión de color y energía.png";
import { auth, signOut } from "../../firebaseConfig";

export default function HelpCenter() {
  const navigate = useNavigate();

  // 🔸 Usuario autenticado
  const user = auth.currentUser;
  const userPhoto = user?.photoURL || userPhotoDefault;

  // 🔸 Simulación del carrito (sustituir con lógica real)
  const carrito = [];

  // 🔸 Cerrar sesión
  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Deseas cerrar sesión?");
    if (!confirmLogout) return;

    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {/* 🌑 NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          {/* 🔥 Logo y nombre */}
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            className="brand-logo d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="logo" height="45" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* 🔗 Enlaces */}
            <Nav className="mx-auto align-items-center">
              <Nav.Link
                onClick={() => navigate("/dashboard")}
                className="active-link"
              >
                Inicio
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/categorias")}>
                Categorías
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>
                Ofertas
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/seguridad")}>
                Seguridad
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>
              <Nav.Link
                onClick={() => navigate("/admin")}
                className="text-warning"
              >
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>
            </Nav>

            {/* 🔹 Usuario y Carrito */}
            <Nav className="align-items-center gap-3">
              {user ? (
                <Nav.Item
                  className="logout-container"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <Nav.Link className="logout-link d-flex align-items-center gap-2">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img
                      src={userPhoto}
                      alt="Foto de usuario"
                      className="user-photo-nav"
                    />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link onClick={() => navigate("/login")}>
                  <FaUser size={18} className="me-2" />
                  Iniciar Sesión
                </Nav.Link>
              )}

              {/* 🛒 CARRITO */}
              <Nav.Link
                onClick={() => navigate("/carrito")}
                className="position-relative"
              >
                <FaShoppingCart size={20} />
                {carrito.length > 0 && (
                  <Badge bg="warning" text="dark" pill className="cart-badge">
                    {carrito.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔸 CONTENIDO PRINCIPAL */}
      <div className="help-center-container">
        <header className="header">
          <button className="btn-center">Centro de Ayuda</button>
          <h2>¿En qué podemos ayudarte?</h2>
          <p>
            Encuentra respuestas rápidas o contacta con nuestro equipo de
            soporte.
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar en preguntas frecuentes..."
            />
          </div>
        </header>

        {/* 🔹 Tarjetas de contacto */}
        <section className="contact-section">
          <div className="card green">
            <h3>📞 Teléfono</h3>
            <p className="main">+57 321 314 8729</p>
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
            <p className="main">+57 321 314 8729</p>
            <p>🕓 L-V: 7:00–21:00</p>
            <button>Contactar</button>
          </div>
        </section>

        {/* 🔹 Preguntas frecuentes */}
        <section className="faq-section">
          <h3>Pedidos y Compras</h3>
          <details>
            <summary>¿Cómo hago un pedido?</summary>
            <p>
              Selecciona el producto, agrégalo al carrito y realiza el pago.
            </p>
          </details>
          <details>
            <summary>¿Puedo cancelar o modificar mi pedido?</summary>
            <p>
              Puedes cancelarlo en las primeras 2 horas comunicándote con
              soporte.
            </p>
          </details>
          <details>
            <summary>¿Qué formas de pago aceptan?</summary>
            <p>Tarjetas, transferencias y pagos en efectivo.</p>
          </details>
          <details>
            <summary>¿Emiten facturas?</summary>
            <p>
              Sí, enviamos factura automáticamente al correo tras la compra.
            </p>
          </details>
        </section>

        {/* 🔹 Guías y Chat */}
        <section className="extra-section">
          <div className="guide purple">
            <h4>📘 Guías y Tutoriales</h4>
            <ul>
              <li>→ Cómo elegir el producto adecuado</li>
              <li>→ Guía de almacenamiento seguro</li>
              <li>→ Normativas por comunidad</li>
              <li>→ Calculadora de cantidad por evento</li>
            </ul>
          </div>

          <div className="support orange-dark">
            <h4>❓ ¿No encuentras respuesta?</h4>
            <p>
              Nuestro equipo está disponible para ayudarte con cualquier
              consulta.
            </p>
            <button>💬 Abrir Chat de Soporte</button>
            <small>Tiempo medio de respuesta: 5 minutos</small>
          </div>
        </section>
      </div>
    </>
  );
}
