import React, { useState } from "react";
import { Navbar, Nav, Badge, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./NormativaRegulacion.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/Explosión de color y energía.png";
import userPhoto from "../../assets/Explosión de color y energía.png";

function NormativaRegulacion() {
  const navigate = useNavigate();

  const [user, setUser] = useState(true);
  const [cart, setCart] = useState([]);

  const handleLogout = () => {
    alert("Sesión cerrada correctamente");
    setUser(false);
    navigate("/dashboard");
  };

  return (
    <div className="seguridad-container">
      {/* 🟡 NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            className="brand-logo d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => navigate("/Dashboard")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/Categorias")}>Categorías</Nav.Link>
              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>Ofertas</Nav.Link>
              <Nav.Link onClick={() => navigate("/Seguridad")}>Seguridad</Nav.Link>
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>
              <Nav.Link
                onClick={() => navigate("/Admin")}
                className="text-warning fw-bold"
              >
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>

              {user ? (
                <Nav.Item
                  className="logout-container"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img src={userPhoto} alt="user" className="user-photo-nav" />
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

              <Nav.Link
                onClick={() => navigate("/Carrito")}
                className="position-relative text-light"
              >
                <FaShoppingCart size={18} />
                {cart.length > 0 && (
                  <Badge
                    bg="warning"
                    text="dark"
                    pill
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                      fontSize: "0.7rem",
                    }}
                  >
                    {cart.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🧨 CONTENIDO PRINCIPAL */}
      <header className="header">
        <h1 className="titulo-principal">Normativa y Regulación</h1>

        <section className="politicas-contenido">
          <p>
            <strong>Pyroshop – Ocaña, Norte de Santander</strong>
          </p>

          <p>
            La comercialización, almacenamiento, distribución y uso de artículos
            pirotécnicos en Colombia se encuentra estrictamente regulada por leyes
            nacionales, decretos y ordenanzas municipales. Pyroshop cumple con toda
            la normativa aplicable a nivel nacional y local, especialmente la vigente
            en el municipio de Ocaña, Norte de Santander, donde se desarrolla su
            principal operación comercial.
          </p>

          <h2>1. Normativa Nacional en Colombia</h2>
          <p>A nivel nacional, Pyroshop se acoge y cumple con las siguientes leyes y disposiciones:</p>

          <h3>1.1 Ley 670 de 2001</h3>
          <ul>
            <li>Prohibición de venta de pirotecnia a menores de edad.</li>
            <li>Responsabilidad del comercio en la distribución segura.</li>
            <li>Campañas de prevención durante temporadas decembrinas.</li>
          </ul>

          <h3>1.2 Ley 1801 de 2016 – Código Nacional de Seguridad y Convivencia Ciudadana</h3>
          <ul>
            <li>Art. 30 y 31: Prohíben la fabricación o distribución sin autorización.</li>
            <li>Art. 33: Sanciona la venta de pólvora a menores de edad.</li>
            <li>Art. 34: Regula eventos públicos con pirotecnia.</li>
          </ul>

          <h3>1.3 Decreto 4481 de 2006</h3>
          <p>Establece especificaciones técnicas y requisitos de seguridad para la comercialización.</p>

          <h3>1.4 Decreto 2157 de 2017 – Gestión del Riesgo</h3>
          <p>Regula la prevención y manejo de riesgos asociados a materiales peligrosos como la pólvora.</p>

          <h3>1.5 Resoluciones del Ministerio de Salud</h3>
          <ul>
            <li>Clasificación de artículos pirotécnicos permitidos.</li>
            <li>Normas de seguridad y manipulación.</li>
            <li>Protocolos para reportes de incidentes.</li>
          </ul>

          <h2>2. Normativa Departamental – Norte de Santander</h2>
          <p>
            La gobernación emite anualmente lineamientos adicionales en temporadas de
            alto riesgo (diciembre–enero):
          </p>
          <ul>
            <li>Restricciones de horarios para uso de pirotecnia.</li>
            <li>Permisos para espectáculos con pólvora.</li>
            <li>Campañas de prevención y control.</li>
          </ul>

          <h2>3. Normativa Municipal – Ocaña, Norte de Santander</h2>
          <p>La Alcaldía Municipal de Ocaña regula:</p>

          <h3>✔ Prohibición de venta a menores de edad</h3>
          <p>Es obligatorio verificar la identificación del comprador.</p>

          <h3>✔ Comercialización solo de artículos permitidos</h3>
          <ul>
            <li>Totes o triángulos</li>
            <li>Voladores artesanales</li>
            <li>Rascapiedras</li>
            <li>Detonantes de alta peligrosidad</li>
            <li>Pólvora negra suelta</li>
            <li>Artefactos no certificados</li>
          </ul>

          <h3>✔ Permisos para eventos públicos</h3>
          <ul>
            <li>Permiso de la Alcaldía</li>
            <li>Concepto favorable de Bomberos de Ocaña</li>
            <li>Plan de emergencias</li>
            <li>Personal experto en manipulación</li>
          </ul>

          <h3>✔ Control policial y sanciones</h3>
          <ul>
            <li>Decomiso de artículos prohibidos.</li>
            <li>Multas por venta a menores.</li>
            <li>Sellamiento de establecimientos.</li>
          </ul>

          <h3>✔ Regulación del almacenamiento</h3>
          <ul>
            <li>Bodegas con ventilación adecuada.</li>
            <li>Señalización de zonas de riesgo.</li>
            <li>Extintores certificados.</li>
            <li>Inventarios actualizados.</li>
          </ul>

          <h2>4. Responsabilidades de Pyroshop</h2>
          <ul>
            <li>Verificar mayoría de edad.</li>
            <li>Vender solo productos permitidos.</li>
            <li>Contar con proveedores certificados.</li>
            <li>Mantener medidas de seguridad.</li>
            <li>Reportar incidentes.</li>
          </ul>

          <h2>5. Recomendaciones legales para compradores</h2>
          <ul>
            <li>Ser mayor de 18 años.</li>
            <li>Usar pirotecnia en espacios seguros.</li>
            <li>No manipular bajo efectos de alcohol.</li>
            <li>No permitir acceso a menores.</li>
            <li>Seguir instrucciones del fabricante.</li>
          </ul>

          <h2>6. Actualizaciones normativas</h2>
          <p>
            La normativa puede actualizarse anualmente. Pyroshop modificará esta
            sección cuando la Alcaldía de Ocaña o el Gobierno Nacional publiquen
            nuevas disposiciones.
          </p>
        </section>
      </header>
    </div>
  );
}

export default NormativaRegulacion;
