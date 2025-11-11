import React, { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiLogOut,
  FiDownload,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./DashboardAdmin.css";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  /* 📊 Cálculos de estadísticas */
  const stats = useMemo(() => {
    const totalPedidos = pedidos.length;
    const totalVentas = pedidos.reduce((s, p) => s + (p.total || 0), 0);
    return { totalPedidos, totalVentas, totalClientes: clientes.length };
  }, [pedidos, clientes]);

  /* 📅 Ventas agrupadas por mes */
  const ventasMes = useMemo(() => {
    const map = new Map();
    pedidos.forEach((p) => {
      const fecha =
        p.fecha && p.fecha.toDate ? p.fecha.toDate() : new Date(p.fecha);
      const key = fecha.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      map.set(key, (map.get(key) || 0) + (p.total || 0));
    });
    return [...map.entries()].map(([mes, total]) => ({ mes, total }));
  }, [pedidos]);

  /* 🟢 Gráfico por estados */
  const estadosData = useMemo(() => {
    const counts = {};
    pedidos.forEach((p) => {
      counts[p.estado || "Pendiente"] =
        (counts[p.estado || "Pendiente"] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [pedidos]);

  const chartColors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  /* 🔐 Autenticación y carga de datos */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }

      setUser(u);
      const snap = await getDoc(doc(db, "usuarios", u.uid));
      const role = snap.exists() ? snap.data().rol : "cliente";
      setIsAdmin(role === "admin");

      if (role === "admin") {
        await loadData();
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* 🔄 Cargar datos de Firestore */
  async function loadData() {
    const pSnap = await getDocs(collection(db, "pedidos"));
    const uSnap = await getDocs(collection(db, "usuarios"));
    setPedidos(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setClientes(uSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  /* 📥 Exportar pedidos a PDF */
  function exportPDF() {
    const doc = new jsPDF();
    doc.text("📦 Reporte de Pedidos", 14, 22);
    const rows = pedidos.map((p, i) => [
      i + 1,
      p.id,
      p.cliente?.nombre || p.cliente?.email || "-",
      p.estado,
      `$${p.total}`,
    ]);

    autoTable(doc, {
      head: [["#", "ID", "Cliente", "Estado", "Total"]],
      body: rows,
      startY: 30,
    });
    doc.save(`pedidos_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  /* ⏳ Cargando o sin permisos */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Cargando dashboard...
      </div>
    );

  if (!isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        🚫 Acceso denegado
      </div>
    );

  /* ✅ Vista principal */
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 🔝 Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-600 text-white p-2 shadow-lg">
              <FiBarChart2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Admin — Dashboard</h1>
              <p className="text-sm text-gray-500">
                Ventas y pedidos en tiempo real
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded shadow-sm hover:bg-gray-50"
            >
              <FiDownload /> PDF
            </button>

            <button
              onClick={() => {
                signOut(auth);
                navigate("/login");
              }}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700"
            >
              <FiLogOut /> Salir
            </button>
          </div>
        </header>

        {/* 📦 Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <FiShoppingCart
              className="mx-auto text-indigo-600 mb-2"
              size={26}
            />
            <h2 className="text-lg font-semibold">Pedidos</h2>
            <p className="text-2xl font-bold">{stats.totalPedidos}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <FiUsers className="mx-auto text-green-600 mb-2" size={26} />
            <h2 className="text-lg font-semibold">Clientes</h2>
            <p className="text-2xl font-bold">{stats.totalClientes}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <FiBarChart2 className="mx-auto text-yellow-500 mb-2" size={26} />
            <h2 className="text-lg font-semibold">Ventas</h2>
            <p className="text-2xl font-bold">
              ${stats.totalVentas.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 📈 Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 📊 Ventas por mes */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3 text-center text-indigo-700">
              Ventas por Mes
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ventasMes}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#4f46e5" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🧾 Pedidos por Estado */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3 text-center text-green-700">
              Pedidos por Estado
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={estadosData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {estadosData.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 💰 Ventas por Estado de Pago */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3 text-center text-yellow-700">
              Ventas por Estado de Pago
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  {
                    name: "Pagado",
                    total: pedidos
                      .filter((p) => p.pago === "Pagado")
                      .reduce((a, b) => a + (b.total || 0), 0),
                  },
                  {
                    name: "Pendiente",
                    total: pedidos
                      .filter((p) => p.pago === "Pendiente")
                      .reduce((a, b) => a + (b.total || 0), 0),
                  },
                  {
                    name: "Rechazado",
                    total: pedidos
                      .filter((p) => p.pago === "Rechazado")
                      .reduce((a, b) => a + (b.total || 0), 0),
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#f59e0b" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
