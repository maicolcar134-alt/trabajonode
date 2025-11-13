import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaBox,
  FaClipboardList,
  FaUsers,
  FaTruck,
  FaStore,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig"; // ⚠️ ajusta la ruta a tu archivo firebase.js
import Swal from "sweetalert2";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verificarAcceso = () => {
      const user = auth.currentUser;

      // 🔒 Si no hay usuario logueado
      if (!user) {
        Swal.fire("Acceso denegado", "Debes iniciar sesión primero.", "error");
        navigate("/login");
        return;
      }

      // 🔹 Solo permitir este correo
      if (user.email === "maicolcar134@gmail.com") {
        setIsAuthorized(true);
      } else {
        Swal.fire(
          "Acceso restringido",
          "Solo el administrador puede acceder a esta sección.",
          "warning"
        );
        navigate("/dashboard");
      }
    };

    verificarAcceso();
  }, [navigate]);

  if (isAuthorized === null) {
    return <p className="text-center mt-5">Verificando acceso...</p>;
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartBar /> },
    { name: "Inventario", path: "/admin/inventario", icon: <FaBox /> },
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

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
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

        <div className="footer">
          <p>© 2025 PyroShop</p>
        </div>
      </aside>

      {/* ✅ CONTENIDO ADMIN */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
