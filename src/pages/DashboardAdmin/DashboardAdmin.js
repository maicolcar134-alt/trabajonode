import React, { useEffect, useState, Suspense } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { useIsMobile } from "../../hooks/useIsMobile";
import "./DashboardAdmin.css";

// --------------------------------------------------
// 🟦 Lazy Loading de Recharts (IMPORTANTE)
// --------------------------------------------------
const ResponsiveContainer = React.lazy(() => import("recharts").then(m => ({ default: m.ResponsiveContainer })));
const LineChart = React.lazy(() => import("recharts").then(m => ({ default: m.LineChart })));
const Line = React.lazy(() => import("recharts").then(m => ({ default: m.Line })));
const XAxis = React.lazy(() => import("recharts").then(m => ({ default: m.XAxis })));
const YAxis = React.lazy(() => import("recharts").then(m => ({ default: m.YAxis })));
const Tooltip = React.lazy(() => import("recharts").then(m => ({ default: m.Tooltip })));
const CartesianGrid = React.lazy(() => import("recharts").then(m => ({ default: m.CartesianGrid })));

const BarChart = React.lazy(() => import("recharts").then(m => ({ default: m.BarChart })));
const Bar = React.lazy(() => import("recharts").then(m => ({ default: m.Bar })));

export default function DashboardAdmin() {
  const isMobile = useIsMobile(768);

  const [ventas, setVentas] = useState([]);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);

  const [pedidos, setPedidos] = useState([]);
  const [pedidosTotal, setPedidosTotal] = useState(0);
  const [pedidosProceso, setPedidosProceso] = useState(0);
  const [pedidosEnviados, setPedidosEnviados] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState(0);

  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  useEffect(() => {
    const q = query(collection(db, "ventas"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVentas(data);
      calcularMetricasVentas(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "pedidos"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPedidos(data);
      calcularMetricasPedidos(data);
    });
    return () => unsub();
  }, []);

  const calcularMetricasVentas = (lista) => {
    const hoyISO = hoy.toISOString().split("T")[0];
    let totalHoy = 0;
    let totalMes = 0;

    lista.forEach((v) => {
      const fecha = v.fecha?.toDate();
      if (!fecha) return;
      const fechaISO = fecha.toISOString().split("T")[0];
      if (fechaISO === hoyISO) totalHoy += Number(v.total || 0);
      if (fecha >= inicioMes) totalMes += Number(v.total || 0);
    });

    setVentasHoy(totalHoy);
    setVentasMes(totalMes);
  };

  const calcularMetricasPedidos = (lista) => {
    setPedidosTotal(lista.length);
    setPedidosProceso(lista.filter((p) => p.estado === "En proceso").length);
    setPedidosEnviados(lista.filter((p) => p.estado === "Enviado").length);
    setPedidosEntregados(lista.filter((p) => p.estado === "Entregado").length);
  };

  // Ventas por día
  let ventasPorDia = Array.from({ length: 31 }, (_, d) => ({ dia: d + 1, total: 0 }));
  ventas.forEach((v) => {
    const fecha = v.fecha?.toDate();
    if (!fecha) return;
    if (fecha >= inicioMes) {
      ventasPorDia[fecha.getDate() - 1].total += Number(v.total || 0);
    }
  });

  const ventasPorDiaOptimizado = isMobile
    ? ventasPorDia.filter((item) => item.dia % 3 === 0 || item.dia === 1)
    : ventasPorDia;

  let acumulado = 0;
  const balanceData = ventasPorDia.map((item) => {
    acumulado += item.total;
    return { dia: item.dia, total: item.total, balance: acumulado };
  });

  const balanceDataOptimizado = isMobile
    ? balanceData.filter((item) => item.dia % 3 === 0 || item.dia === 1)
    : balanceData;

  const pedidosChart = [
    { estado: "En proceso", cantidad: pedidosProceso },
    { estado: "Enviado", cantidad: pedidosEnviados },
    { estado: "Entregado", cantidad: pedidosEntregados },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Dashboard Administrativo</h1>

      <div className="metricas-grid">
        <div className="card-metrica">
          <h3>🟩 Ventas del Día</h3>
          <p className="card-valor">${ventasHoy.toLocaleString()}</p>
        </div>

        <div className="card-metrica">
          <h3>🟦 Ventas del Mes</h3>
          <p className="card-valor">${ventasMes.toLocaleString()}</p>
        </div>

        <div className="card-metrica">
          <h3>💵 Registros de Venta</h3>
          <p className="card-valor">{ventas.length}</p>
        </div>

        <div className="card-metrica">
          <h3>📦 Total Pedidos</h3>
          <p className="card-valor">{pedidosTotal}</p>
        </div>

        <div className="card-metrica">
          <h3>🟠 En Proceso</h3>
          <p className="card-valor">{pedidosProceso}</p>
        </div>

        <div className="card-metrica">
          <h3>🔵 Enviados</h3>
          <p className="card-valor">{pedidosEnviados}</p>
        </div>

        <div className="card-metrica">
          <h3>🟢 Entregados</h3>
          <p className="card-valor">{pedidosEntregados}</p>
        </div>
      </div>

      {/* ----------- Gráfica Ventas ------------ */}
      <section className="grafica-box">
        <h2>📆 Ventas por día del mes</h2>

        <Suspense fallback={<p>Cargando gráfica...</p>}>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <LineChart data={ventasPorDiaOptimizado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </Suspense>
      </section>

      {/* ----------- Balance Acumulado ------------ */}
      <section className="grafica-box">
        <h2>💰 Balance acumulado del mes</h2>

        <Suspense fallback={<p>Cargando gráfica...</p>}>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 350}>
            <LineChart data={balanceDataOptimizado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#2196f3" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Suspense>
      </section>

      {/* ----------- Pedidos ------------ */}
      <section className="grafica-box">
        <h2>📦 Pedidos por estado</h2>

        <Suspense fallback={<p>Cargando gráfica...</p>}>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 350}>
            <BarChart data={pedidosChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </Suspense>
      </section>
    </div>
  );
}
