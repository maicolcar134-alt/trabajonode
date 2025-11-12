// src/layouts/NavbarMain.jsx
import { Navbar, Container, Nav } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/espectaculo-fuegos-artificiales.jpg"; // 👈 ajusta la ruta de tu logo según dónde esté

const NavbarMain = ({ user, handleLogout, userPhoto }) => {
  const navigate = useNavigate();

  return (
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
            <Nav.Link onClick={() => navigate("/dashboard")} className="active-link">
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

            {/* Botón de usuario o iniciar sesión */}
            {user ? (
              <Nav.Item
                className="logout-container"
                onClick={handleLogout}
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

            {/* Ícono carrito */}
            <Nav.Link onClick={() => navigate("/carrito")} className="cart-icon">
              <FaShoppingCart />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMain;
