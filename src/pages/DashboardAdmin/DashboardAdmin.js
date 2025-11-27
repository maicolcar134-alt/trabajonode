import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// Gráficas (Recharts)
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import "./DashboardAdmin.css";

export default function DashboardAdmin() {
  // ------------------------------
  // ESTADOS
  // ------------------------------
  const [ventas, setVentas] = useState([]);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);

  const [pedidos, setPedidos] = useState([]);
  const [pedidosTotal, setPedidosTotal] = useState(0);
  const [pedidosProceso, setPedidosProceso] = useState(0);
  const [pedidosEnviados, setPedidosEnviados] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState(0);

  // FECHAS
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  // --------------------------------------------------
  // 🔥 Cargar Ventas
  // --------------------------------------------------
  useEffect(() => {
    const q = query(collection(db, "ventas"), orderBy("fecha", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVentas(data);
      calcularMetricasVentas(data);
    });

    return () => unsub();
  }, []);

  // --------------------------------------------------
  // 🔥 Cargar Pedidos
  // --------------------------------------------------
  useEffect(() => {
    const q = query(collection(db, "pedidos"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPedidos(data);
      calcularMetricasPedidos(data);
    });

    return () => unsub();
  }, []);

  // --------------------------------------------------
  // 📌 Calcular métricas de ventas
  // --------------------------------------------------
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

  // --------------------------------------------------
  // 📦 Calcular métricas de pedidos
  // --------------------------------------------------
  const calcularMetricasPedidos = (lista) => {
    setPedidosTotal(lista.length);
    setPedidosProceso(lista.filter((p) => p.estado === "En proceso").length);
    setPedidosEnviados(lista.filter((p) => p.estado === "Enviado").length);
    setPedidosEntregados(lista.filter((p) => p.estado === "Entregado").length);
  };

  // --------------------------------------------------
  // 📊 Ventas por día del mes
  // --------------------------------------------------
  let ventasPorDia = [];

  for (let d = 1; d <= 31; d++) {
    ventasPorDia.push({ dia: d, total: 0 });
  }

  ventas.forEach((v) => {
    const fecha = v.fecha?.toDate();
    if (!fecha) return;
    if (fecha >= inicioMes) {
      const dia = fecha.getDate();
      ventasPorDia[dia - 1].total += Number(v.total || 0);
    }
  });

  // --------------------------------------------------
  // 💰 Balance acumulado
  // --------------------------------------------------
  let acumulado = 0;
  const balanceData = ventasPorDia.map((item) => {
    acumulado += item.total;
    return { dia: item.dia, total: item.total, balance: acumulado };
  });

  // --------------------------------------------------
  // 📈 Gráfica: Pedidos por estado
  // --------------------------------------------------
  const pedidosChart = [
    { estado: "En proceso", cantidad: pedidosProceso },
    { estado: "Enviado", cantidad: pedidosEnviados },
    { estado: "Entregado", cantidad: pedidosEntregados },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Dashboard Administrativo</h1>

      {/* ------------------------------------------- */}
      {/* 🔥 TARJETAS PRINCIPALES */}
      {/* ------------------------------------------- */}
      <div className="metricas-grid">
        {/* Ventas del día */}
        <div className="card-metrica">
          <h3>🟩 Ventas del Día</h3>
          <p className="card-valor">${ventasHoy.toLocaleString()}</p>
        </div>

        {/* Ventas del mes */}
        <div className="card-metrica">
          <h3>🟦 Ventas del Mes</h3>
          <p className="card-valor">${ventasMes.toLocaleString()}</p>
        </div>

        {/* Registros venta */}
        <div className="card-metrica">
          <h3>💵 Registros de Venta</h3>
          <p className="card-valor">{ventas.length}</p>
        </div>

        {/* Pedidos totales */}
        <div className="card-metrica">
          <h3>📦 Total Pedidos</h3>
          <p className="card-valor">{pedidosTotal}</p>
        </div>

        {/* En proceso */}
        <div className="card-metrica">
          <h3>🟠 En Proceso</h3>
          <p className="card-valor">{pedidosProceso}</p>
        </div>

        {/* Enviados */}
        <div className="card-metrica">
          <h3>🔵 Enviados</h3>
          <p className="card-valor">{pedidosEnviados}</p>
        </div>

        {/* Entregados */}
        <div className="card-metrica">
          <h3>🟢 Entregados</h3>
          <p className="card-valor">{pedidosEntregados}</p>
        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* 📈 GRÁFICA VENTAS POR DÍA */}
      {/* ------------------------------------------- */}
      <section className="grafica-box">
        <h2>📆 Ventas por día del mes</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ventasPorDia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#4caf50" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ------------------------------------------- */}
      {/* 💰 BALANCE ACUMULADO */}
      {/* ------------------------------------------- */}
      <section className="grafica-box">
        <h2>💰 Balance acumulado del mes</h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={balanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2196f3"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ------------------------------------------- */}
      {/* 📦 GRÁFICA DE PEDIDOS */}
      {/* ------------------------------------------- */}
      <section className="grafica-box">
        <h2>📦 Pedidos por estado</h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={pedidosChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="estado" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#ff9800" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
