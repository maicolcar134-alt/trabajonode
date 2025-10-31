import { NavLink, useNavigate } from "react-router-dom";
import { FaChartBar, FaBox, FaClipboardList, FaUsers, FaTruck, FaStore} from "react-icons/fa";

import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/DashboardaAdmin", icon: <FaChartBar />, badge: null },
    { name: "Inventario", path: "/inventario", icon: <FaBox />, badge: null },
    { name: "Pedidos", path: "/pedidos", icon: <FaClipboardList />, badge: null },
    { name: "Usuarios", path: "/usuarios", icon: <FaUsers /> },
    { name: "Envío / Zonas", path: "/ZonasEnvio", icon: <FaTruck />, badge: null },
    { name: "Auditoría / Logs", path: "/auditoria", icon: <FaClipboardList /> },
  ];

  const handleVolver = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="admin-container">
      {/* Sidebar Izquierda */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">🔥</div>
          <div>
            <h1 className="logo-title">PyroShopAdmin</h1>
            <p className="logo-subtitle">Panel de Control</p>
          </div>
        </div>

        {/* Menú */}
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
              {item.badge && <span className="badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Botón Volver */}
        <button className="btn-volver" onClick={handleVolver}>
          <FaStore />
          <span>Volver a Admin</span>
        </button>

        <div className="footer">
          <p>© 2025 PyroShop</p>
        </div>
      </aside>

      
    </div>
  );
};

export default Admin;
