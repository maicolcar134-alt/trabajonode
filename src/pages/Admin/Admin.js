import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaUsers,
  FaCog,
  FaClipboardList,
  FaTruck,
  FaShieldAlt,
  FaFileAlt,
  FaChartBar,
 
} from "react-icons/fa";
import "./Admin.css";
const Admin = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/DashboardaAdmin", icon: <FaChartBar /> },
    { name: "Inventario", path: "/inventario", icon: <FaBox />, badge: 23 },
    { name: "Pedidos", path: "/pedidos", icon: <FaClipboardList />, badge: 5 },
    { name: "Usuarios", path: "/usuarios", icon: <FaUsers /> },
    { name: "Fichas y Documentos", path: "/fichas", icon: <FaFileAlt />, badge: 3 },
    { name: "Envíos / Zonas", path: "/envios", icon: <FaTruck /> },
    { name: "Configuración", path: "/configuracion", icon: <FaCog /> },
    { name: "Cumplimiento", path: "/cumplimiento", icon: <FaShieldAlt />, badge: 2 },
    { name: "Auditoría / Logs", path: "/auditoria", icon: <FaClipboardList /> },
  ];

  return (
    <div className="w-64 bg-[#0b1120] p-4 flex flex-col shadow-lg h-screen">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-orange-500 p-2 rounded-lg text-2xl">🔥</div>
        <div>
          <h1 className="text-xl font-bold text-white">PyroAdmin</h1>
          <p className="text-sm text-gray-400">Panel de Control</p>
        </div>
      </div>

      {/* Botón de inicio */}
      
    

      {/* Menú lateral */}
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center justify-between py-2 px-3 rounded-lg text-sm transition ${
                isActive
                  ? "bg-[#1e293b] text-white"
                  : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
              }`
            }
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Pie de menú */}
      <div className="mt-auto pt-6 border-t border-gray-700 text-center text-gray-500 text-xs">
        <p>© 2025 PyroDigital</p>
      </div>
    </div>
  );
};

export default Admin;

