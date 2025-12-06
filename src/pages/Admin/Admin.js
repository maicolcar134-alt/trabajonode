import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaBox,
  FaClipboardList,
  FaUsers,
  FaTruck,
  FaStore,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Inicializar estado del sidebar según ancho de pantalla
    const initial = window.innerWidth > 1024;
    setSidebarOpen(initial);

    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(true);
      // not forcing close on resize to small to avoid UX jump, keep current state
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const verificarAcceso = async () => {
      const user = auth.currentUser;

      // ❌ No hay usuario logueado
      if (!user) {
        Swal.fire("Acceso denegado", "Debes iniciar sesión primero.", "error");
        navigate("/login");
        return;
      }

      try {
        // 🔍 Leer solo el documento del usuario actual por UID
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        // ❌ No existe o no es Admin
        if (!snap.exists() || snap.data().Rol !== "Admin") {
          Swal.fire(
            "Acceso restringido",
            "Solo el administrador puede acceder a esta sección.",
            "warning"
          );
          navigate("/dashboard");
          return;
        }

        // ✔ Usuario autorizado
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error verificando rol:", error);
        Swal.fire("Error", "No se pudo verificar tu rol.", "error");
        navigate("/dashboard");
      }
    };

    verificarAcceso();
  }, [navigate]);

  if (isAuthorized === null) {
    return <p className="text-center mt-5">Verificando acceso...</p>;
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboardAdmin", icon: <FaChartBar /> },
    { name: "Inventario", path: "/admin/inventario", icon: <FaBox /> },
    { name: "Eventos",path: "/admin/eventos",icon: <FaBox/>},
    { name: "Pedidos", path: "/admin/pedidos", icon: <FaClipboardList /> },
    { name: "Usuarios", path: "/admin/usuarios", icon: <FaUsers /> },
    { name: "Envío / Zonas", path: "/admin/zonas", icon: <FaTruck /> },
    {
      name: "Auditoría / Logs",
      path: "/admin/auditoria",
      icon: <FaClipboardList />,
    },
  ];

  const handleVolver = () => {
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    const resultado = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que quieres cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (resultado.isConfirmed) {
      try {
        await auth.signOut();
        await Swal.fire({
          title: "Sesión cerrada",
          icon: "success",
          timer: 1100,
          showConfirmButton: false,
        });
        navigate("/login");
      } catch (error) {
        console.error("Error cerrando sesión:", error);
        Swal.fire("Error", "No se pudo cerrar sesión.", "error");
      }
    }
  };

  return (
    <div className="admin-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon">🔥</div>
          <div>
            <h1 className="logo-title">PyroShopAdmin</h1>
            <p className="logo-subtitle">Panel de Control</p>
          </div>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              onClick={() => {
                // Al navegar en pantallas pequeñas, cerrar sidebar
                if (window.innerWidth <= 1024) setSidebarOpen(false);
              }}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <div className="menu-left">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <button className="btn-volver" onClick={handleVolver}>
          <FaStore />
          <span>Volver a la Tienda</span>
        </button>

        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </button>

        <div className="footer">
          <p>© 2025 PyroShop</p>
        </div>
      </aside>

      <main className="admin-content">
        {/* Topbar / Toggle visible en pantallas pequeñas */}
        <div className="topbar">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Abrir menú"
          >
            ☰ Menú
          </button>
        </div>

        {/* Overlay cuando sidebar está abierto en móvil */}
        {sidebarOpen && window.innerWidth <= 1024 && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="admin-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Admin;
