import React, { useState } from "react";
import { Navbar, Nav, Badge, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./PoliticasVenta.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../../firebaseConfig";
import logo from "../../assets/Explosión de color y energía.png";
import userPhoto from "../../assets/Explosión de color y energía.png";

function PoliticasVenta() {
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
        <h1 className="titulo-principal">Políticas de Venta Responsable</h1>

        <section className="politicas-contenido">
          <h2>1. Compromiso con la seguridad y la legalidad</h2>
          <p>
            En <strong>Pyroshop</strong>, promovemos el uso responsable, seguro y legal
            de los artículos pirotécnicos. Todas nuestras operaciones cumplen con la{" "}
            <strong>Ley 670 de 2001</strong> y demás normativas que regulan la fabricación,
            transporte, almacenamiento, comercialización y uso de pólvora en Colombia.
          </p>
          <p>
            No fomentamos ni apoyamos el uso inadecuado de productos pirotécnicos ni su
            manipulación por parte de menores de edad.
          </p>

          <h2>2. Venta exclusiva a mayores de edad</h2>
          <ul>
            <li>La compra de productos está estrictamente limitada a mayores de 18 años.</li>
            <li>El comprador debe acreditar su edad con un documento de identidad válido.</li>
            <li>Pyroshop se reserva el derecho de rechazar pedidos que no cumplan este requisito.</li>
          </ul>

          <h2>3. Cumplimiento normativo y licencias</h2>
          <p>
            Todos nuestros productos provienen de <strong>proveedores autorizados</strong> y cuentan
            con los permisos y certificaciones exigidos por las autoridades competentes como la Policía Nacional.
          </p>
          <p>
            Pyroshop no comercializa pólvora artesanal o no certificada. Tampoco realiza ventas en
            municipios donde esté prohibida la comercialización de pirotecnia.
          </p>

          <h2>4. Responsabilidad en el uso</h2>
          <ul>
            <li>Los productos deben ser utilizados solo por adultos capacitados.</li>
            <li>
              Se recomienda hacerlo en espacios abiertos, seguros y lejos de personas, animales y
              materiales inflamables.
            </li>
            <li>
              Pyroshop no se hace responsable por daños derivados del uso indebido o incumplimiento
              de las instrucciones.
            </li>
          </ul>

          <h2>5. Prohibiciones</h2>
          <ul>
            <li>Vender o entregar productos pirotécnicos a menores de edad.</li>
            <li>Usar los productos en espacios públicos sin autorización.</li>
            <li>Alterar o fabricar de manera casera artefactos pirotécnicos.</li>
            <li>Revender sin los permisos correspondientes.</li>
          </ul>

          <h2>6. Educación y concienciación</h2>
          <p>
            En Pyroshop creemos que la mejor forma de disfrutar la pirotecnia es con{" "}
            <strong>responsabilidad y conocimiento</strong>. Promovemos el
            uso seguro de la pólvora y los riesgos asociados.
          </p>
        </section>
      </header>
    </div>
  );
}

export default PoliticasVenta;
