import React, { useState, useCallback, Suspense, memo } from "react";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

// LOGO optimizado (ubicado en /public/ para máximo caching)
const LOGO_SRC = "./assets/Logo.webp";

// Lazy loading de iconos (code splitting real)
const FaSignOutAlt = React.lazy(() =>
  import("react-icons/fa").then(x => ({ default: x.FaSignOutAlt }))
);

const FaUser = React.lazy(() =>
  import("react-icons/fa").then(x => ({ default: x.FaUser }))
);

const FaShoppingCart = React.lazy(() =>
  import("react-icons/fa").then(x => ({ default: x.FaShoppingCart }))
);

const DashboardNavbar = memo(({ user, userPhoto, handleLogout, carrito, rol }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Previene renders innecesarios por pathname
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const handleToggle = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleClose = useCallback(
    (to) => {
      if (to) navigate(to);
      setExpanded(false);
    },
    [navigate]
  );

  return (
    <Navbar
      expanded={expanded}
      expand="lg"
      variant="dark"
      className="dashboard-navbar"
    >
      <Container>

        {/* Brand con espacio reservado → cero CLS */}
        <Navbar.Brand
          onClick={() => handleClose("/dashboard")}
          className="brand-logo d-flex align-items-center"
        >
          <img
            src={LOGO_SRC}
            alt="logo"
            height="40"
            width="40"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            style={{
              objectFit: "contain",
              display: "block",
              aspectRatio: "1/1"
            }}
          />
          <span className="ms-2 fw-bold text-warning">PyroShop</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            <Nav.Link onClick={() => handleClose("/dashboard")} className={isActive("/dashboard") ? "active-item" : ""}>Inicio</Nav.Link>
            <Nav.Link onClick={() => handleClose("/categorias")} className={isActive("/categorias") ? "active-item" : ""}>Categorias</Nav.Link>
            <Nav.Link onClick={() => handleClose("/ofertaspirotecnia")} className={isActive("/ofertaspirotecnia") ? "active-item" : ""}>Ofertas</Nav.Link>
            <Nav.Link onClick={() => handleClose("/Seguridad")} className={isActive("/Seguridad") ? "active-item" : ""}>Seguridad</Nav.Link>
            <Nav.Link onClick={() => handleClose("/Events")} className={isActive("/Events") ? "active-item" : ""}>Eventos</Nav.Link>
            <Nav.Link onClick={() => handleClose("/helpcenter")} className={isActive("/helpcenter") ? "active-item" : ""}>Ayuda</Nav.Link>

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
                <Nav.Link
                  onClick={() => {
                    handleLogout();
                    setExpanded(false);
                  }}
                  className="logout-link d-flex align-items-center gap-2 text-danger fw-bold"
                >
                  <Suspense fallback={<span style={{ width: 16 }} />}>
                    <FaSignOutAlt size={18} />
                  </Suspense>
                  Cerrar Sesión

                  {/* Wrapper predefine espacio → previene CLS */}
                  <div className="user-photo-nav-wrapper">
                    {userPhoto && (
                      <img
                        src={userPhoto}
                        alt="Foto de usuario"
                        className="user-photo-nav"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Link
                onClick={() => handleClose("/login")}
                className={isActive("/login") ? "active-item" : ""}
              >
                <Suspense fallback={<span style={{ width: 18 }} />}>
                  <FaUser size={18} />
                </Suspense>
                Acceder
              </Nav.Link>
            )}

            <Nav.Link
              onClick={() => handleClose("/carrito")}
              className={`position-relative ${isActive("/carrito") ? "active-item" : ""}`}
            >
              <Suspense fallback={<span style={{ width: 20 }} />}>
                <FaShoppingCart size={20} />
              </Suspense>

              {carrito?.length > 0 && (
                <Badge
                  bg="warning"
                  text="dark"
                  pill
                  className="cart-badge"
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
});

export default DashboardNavbar;
