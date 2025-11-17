import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import Logo from "../../assets/Logo.png";
import { Badge } from "react-bootstrap";

const DashboardNavbar = ({ user, userPhoto, handleLogout, carrito }) => {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" variant="dark" className="dashboard-navbar">
      <Container>
        <Navbar.Brand onClick={() => navigate("/dashboard")} className="brand-logo">
          <img src={Logo} alt="logo" height="40" />
          <span className="ms-2 fw-bold text-warning">PyroShop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link onClick={() => navigate("/dashboard")} className="active-link">
              Inicio
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/categorias")}>Categorias</Nav.Link>
            <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>Ofertas</Nav.Link>
            <Nav.Link onClick={() => navigate("/Seguridad")}>Seguridad</Nav.Link>
            <Nav.Link onClick={() => navigate("/Events")}>Eventos</Nav.Link>
            <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>

            {/* 🔐 ADMIN */}
            <Nav.Link onClick={() => navigate("/Admin")} className="text-warning">
              <i className="bi bi-shield-lock"></i> Admin
            </Nav.Link>

            {/* 🔐 SI HAY USUARIO → CERRAR SESIÓN */}
            {user ? (
              <Nav.Item className="logout-container">
                <Nav.Link
                  onClick={handleLogout}
                  className="logout-link d-flex align-items-center gap-2 text-danger fw-bold"
                >
                  <FaSignOutAlt /> Cerrar Sesión
                  {userPhoto && (
                    <img src={userPhoto} alt="Foto" className="user-photo-nav" />
                  )}
                </Nav.Link>
              </Nav.Item>
            ) : (
              /* 🔓 SI NO HAY USUARIO → LOGIN */
              <Nav.Link
                onClick={() => navigate("/login")}
                className="d-flex align-items-center gap-2 fw-bold text-light"
              >
                <FaUser /> Acceder
              </Nav.Link>
            )}

            {/* 🛒 CARRITO */}
            <Nav.Link onClick={() => navigate("/carrito")} className="position-relative">
              <FaShoppingCart size={20} />
              {carrito?.length > 0 && (
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
                  {carrito.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DashboardNavbar;

