import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/Explosión de color y energía.png";
import userPhoto from "../../assets/Explosión de color y energía.png";
import "./NavbarDashboard.css";

function NavbarDashboard() {
  const navigate = useNavigate();
  const user = false; // Cambia a tu lógica real de autenticación

  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Lógica real para cerrar sesión (Firebase, etc.)
  };

  return (
    <Navbar expand="lg" variant="dark" className="dashboard-navbar">
      <Container>
        <Navbar.Brand onClick={() => navigate("/dashboard")} className="brand-logo">
          <img src={logo} alt="logo" height="40" />
          <span className="ms-2 fw-bold text-warning">PyroShop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link onClick={() => navigate("/Dashboard")} className="active-link">
              Inicio
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/Categorias")}>Categorías</Nav.Link>
            <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>Ofertas</Nav.Link>
            <Nav.Link onClick={() => navigate("/Seguridad")}>Seguridad</Nav.Link>
            <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
            <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>
            <Nav.Link onClick={() => navigate("/Admin")} className="text-warning">
              <i className="bi bi-shield-lock"></i> Admin
            </Nav.Link>

            {user ? (
              <Nav.Item className="logout-container" onClick={handleLogout}>
                <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                  <FaSignOutAlt /> Cerrar Sesión
                  <img src={userPhoto} alt="Foto de usuario" className="user-photo-nav" />
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

            <Nav.Link onClick={() => navigate("/Carrito")} className="cart-icon">
              <FaShoppingCart />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarDashboard;
