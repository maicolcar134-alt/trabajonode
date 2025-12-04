import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import Logo from "../../assets/Logo.png";
import { Badge } from "react-bootstrap";
import "./Navbar.css";

const DashboardNavbar = ({ user, userPhoto, handleLogout, carrito, rol }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleToggle = () => setExpanded(prev => !prev);
  const handleClose = (to) => {
    if (to) navigate(to);
    setExpanded(false);
  };

  return (
    <Navbar expanded={expanded} expand="lg" variant="dark" className="dashboard-navbar">
      <Container>
        <Navbar.Brand onClick={() => handleClose("/dashboard")} className="brand-logo">
          <img src={Logo} alt="logo" height="40" />
          <span className="ms-2 fw-bold text-warning">PyroShop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link onClick={() => handleClose("/dashboard")} className={isActive("/dashboard") ? "active-item" : ""}>
              Inicio
            </Nav.Link>

            <Nav.Link onClick={() => handleClose("/categorias")} className={isActive("/categorias") ? "active-item" : ""}>
              Categorias
            </Nav.Link>

            <Nav.Link onClick={() => handleClose("/ofertaspirotecnia")} className={isActive("/ofertaspirotecnia") ? "active-item" : ""}>
              Ofertas
            </Nav.Link>

            <Nav.Link onClick={() => handleClose("/Seguridad")} className={isActive("/Seguridad") ? "active-item" : ""}>
              Seguridad
            </Nav.Link>

            <Nav.Link onClick={() => handleClose("/Events")} className={isActive("/Events") ? "active-item" : ""}>
              Eventos
            </Nav.Link>

            <Nav.Link onClick={() => handleClose("/helpcenter")} className={isActive("/helpcenter") ? "active-item" : ""}>
              Ayuda
            </Nav.Link>

            {(rol?.toLowerCase() === "admin" || rol === undefined) && (
              <Nav.Link
                onClick={() => handleClose("/Admin")}
                className={`text-warning ${isActive("/Admin") ? "active-item" : ""}`}
              >
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>
            )}

            {user ? (
              <Nav.Item className="logout-container">
                <Nav.Link onClick={() => { handleLogout(); setExpanded(false); }} className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                  <FaSignOutAlt /> Cerrar Sesión
                  {userPhoto && <img src={userPhoto} alt="Foto" className="user-photo-nav" />}
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Link onClick={() => handleClose("/login")} className={isActive("/login") ? "active-item" : ""}>
                <FaUser /> Acceder
              </Nav.Link>
            )}

            <Nav.Link onClick={() => handleClose("/carrito")} className={`position-relative ${isActive("/carrito") ? "active-item" : ""}`}>
              <FaShoppingCart size={20} />
              {carrito?.length > 0 && (
                <Badge bg="warning" text="dark" pill style={{ position: "absolute", top: "0px", right: "0px", fontSize: "0.7rem" }}>
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
