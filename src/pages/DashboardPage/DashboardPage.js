// imports...
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from "../../assets/mas.jpg";
import userDefault from "../../assets/user.png";
import "./DashboardPage.css";
import Swal from "sweetalert2";

function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Determinar foto del usuario o usar por defecto
  const userPhoto = user?.photoURL || userDefault;

  // Cerrar sesión con confirmación
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a cerrar sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "No, quedarme",
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        sessionStorage.setItem("logout", "true");
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "¡Has cerrado sesión exitosamente!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cerrar sesión.",
        });
      }
    }
  };

  return (
    <>
        {/* NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand onClick={() => navigate("/dashboard")} className="brand-logo">
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>
          

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => navigate("/inicio")} className="active-link">Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/categorias")}>Categorías</Nav.Link>
              <Nav.Link onClick={() => navigate("/ofertas")}>Ofertas</Nav.Link>
              <Nav.Link onClick={() => navigate("/Auxiliares")}>Auxiliares</Nav.Link>
              <Nav.Link onClick={() => navigate("/eventos")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/ayuda")}>Ayuda</Nav.Link>

              <Nav.Link onClick={() => navigate("/Admin")} className="text-warning">
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>
           

              {/* Botón de usuario o iniciar sesión */}
              {user ? (
                <Nav.Item className="logout-container" onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img src={userPhoto} alt="Foto de usuario" className="user-photo-nav" />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link onClick={() => navigate("/login")} className="d-flex align-items-center gap-2 fw-bold text-light">
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


      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div>
          <img src={logo} alt="logo mas" className="main-logo" />
          <h1 className="welcome-title">Bienvenido a Fuegos Pirotécnicos</h1>
          <p className="welcome-text">
            "Fuegos artificiales que despiertan los sentidos. ¡Descubre un universo de luz y color!"
          </p>

          <h3 className="welcome-title">Información completa del usuario:</h3>

          {user ? (
            <div className="user-details">
              <p><strong>Nombre:</strong> {user.displayName || "Sin nombre"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Correo verificado:</strong> {user.emailVerified ? "Sí" : "No"}</p>
              <p><strong>Teléfono:</strong> {user.phoneNumber || "No registrado"}</p>

              {/* Mostrar los proveedores vinculados */}
              {user.providerData && user.providerData.length > 0 && (
                <div>
                  <h4>Proveedores vinculados:</h4>
                  <ul>
                    {user.providerData.map((provider, index) => (
                      <li key={index}>
                        <p><strong>Proveedor:</strong> {provider.providerId}</p>
                        <p><strong>UID Proveedor:</strong> {provider.uid}</p>
                        <p><strong>Email:</strong> {provider.email}</p>
                        <p><strong>Nombre:</strong> {provider.displayName}</p>
                        <p><strong>Foto:</strong> {provider.photoURL || "Sin foto"}</p>
                        <hr />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadatos */}
              {user.metadata && (
                <div>
                  <p><strong>Creado el:</strong> {new Date(user.metadata.creationTime).toLocaleString()}</p>
                  <p><strong>Último inicio de sesión:</strong> {new Date(user.metadata.lastSignInTime).toLocaleString()}</p>
                </div>
              )}

              {/* Mostrar JSON completo del objeto user */}
              <h4>Datos completos del objeto Firebase User:</h4>
              <pre
                style={{
                  background: "#111",
                  color: "#0f0",
                  padding: "10px",
                  borderRadius: "8px",
                  textAlign: "left",
                  maxWidth: "90%",
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(user, null, 2)}
              </pre>

              <img
                src={userPhoto}
                alt="Foto de usuario"
                style={{
                  maxWidth: "120px",
                  borderRadius: "50%",
                  marginTop: "15px",
                  border: "2px solid #fff",
                }}
              />
            </div>
          ) : (
            <p>No hay usuario autenticado.</p>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer mt-auto">
        <div className="container">
          <small>© 2025 Fuegos Pirotécnicos. Todos los derechos reservados.</small>
        </div>
      </footer>
    </>
  );
}

export default DashboardPage;

