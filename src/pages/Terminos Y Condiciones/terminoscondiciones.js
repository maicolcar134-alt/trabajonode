import React, { useState } from "react";
import { Navbar, Nav, Badge, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./terminoscondiciones.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../../firebaseConfig";
import logo from "../../assets/Explosión de color y energía.png";
import userPhoto from "../../assets/Explosión de color y energía.png";

function TerminosCondiciones() {
  const navigate = useNavigate();

  // 🧠 Estado simulado de usuario y carrito
  const [user, setUser] = useState(true);
  const [cart, setCart] = useState([]);

  // 🔒 Cierre de sesión
  const handleLogout = () => {
    console.log("Cerrar sesión");
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

              {/* 👤 Usuario / Login */}
              {user ? (
                <Nav.Item
                  className="logout-container"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img
                      src={userPhoto}
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

              {/* 🛒 Carrito */}
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
        <h1 className="titulo-principal">Términos y Condiciones de Uso – Pyroshop</h1>

        <section className="politicas-contenido">

          <h3>1. Aceptación de los términos</h3>
          <p>
            Al acceder y utilizar la plataforma virtual de Pyroshop, el usuario declara
            haber leído, entendido y aceptado los presentes Términos y Condiciones,
            así como las políticas complementarias que hacen parte integral de este
            documento.
          </p>

          <h3>2. Marco legal aplicable</h3>
          <p>Pyroshop opera bajo las leyes colombianas aplicables, incluyendo:</p>
          <ul>
            <li>Ley 670 de 2001</li>
            <li>Decreto 4481 de 2006</li>
            <li>Ley 1801 de 2016 – Código Nacional de Policía</li>
            <li>Normativas locales y municipales</li>
          </ul>

          <h3>3. Condiciones para la compra</h3>

          <h4>3.1 Edad mínima</h4>
          <p>
            Solo pueden realizar compras personas mayores de 18 años. Al realizar la
            compra, el usuario declara ser mayor de edad.
          </p>

          <h4>3.2 Uso responsable</h4>
          <p>El usuario se compromete a cumplir las normas de seguridad y uso adecuado.</p>

          <h4>3.3 Restricciones</h4>
          <ul>
            <li>No vender a menores</li>
            <li>No enviar a zonas donde está prohibido</li>
            <li>Cancelación de pedidos sospechosos</li>
          </ul>

          <h3>4. Registro de usuario</h3>
          <p>El usuario debe registrar información veraz y actualizada.</p>

          <h3>5. Información sobre productos</h3>
          <p>Pyroshop publica información completa de los productos, que puede cambiar sin previo aviso.</p>

          <h3>6. Precios, pagos y facturación</h3>
          <p>Precios con impuestos incluidos salvo indicación contraria.</p>

          <h4>6.2 Métodos de pago</h4>
          <ul>
            <li>Bancolombia</li>
            <li>Nequi</li>
            <li>PayPal</li>
            <li>Pago contraentrega</li>
          </ul>

          <h3>7. Envíos, transporte y entregas</h3>
          <p>Solo a zonas permitidas por normativa local.</p>

          <h3>8. Devoluciones y garantías</h3>
          <p>Por ser productos peligrosos, no aplica retracto.</p>

          <h4>8.2 Garantía</h4>
          <p>Solo por defectos de fabricación con evidencia.</p>

          <h3>9. Seguridad</h3>
          <ul>
            <li>No permitir acceso a menores</li>
            <li>No usar bajo efectos de alcohol</li>
            <li>Seguir normas de seguridad</li>
          </ul>

          <h3>10. Limitación de responsabilidad</h3>
          <p>Pyroshop no responde por daños derivados del mal uso.</p>

          <h3>11. Política de privacidad</h3>
          <p>Se siguen las normas de protección de datos vigentes en Colombia.</p>

          <h3>12. Propiedad intelectual</h3>
          <p>Todo el contenido está protegido por derechos de autor.</p>

          <h3>13. Modificaciones</h3>
          <p>Pyroshop puede actualizar estos términos en cualquier momento.</p>
        </section>
      </header>
    </div>
  );
}

export default TerminosCondiciones;
