// src/components/DashboardAdmin.js
// src/components/DashboardAdmin.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Gráficas
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
import "./DashboardAdmin.css"

export default function DashboardAdmin() {
  const [ventas, setVentas] = useState([]);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMes, setVentasMes] = useState(0);

  // FECHAS
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  // Cargar ventas desde Firestore
  useEffect(() => {
    const q = query(collection(db, "ventas"), orderBy("fecha", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVentas(data);
      calcularMetricas(data);
    });

    return () => unsub();
  }, []);

  // Calcular ventas del día y del mes
  const calcularMetricas = (lista) => {
    const hoyISO = hoy.toISOString().split("T")[0];

    let totalHoy = 0;
    let totalMes = 0;

    lista.forEach((v) => {
      const fecha = v.fecha?.toDate();
      if (!fecha) return;

      const fechaISO = fecha.toISOString().split("T")[0];

      if (fechaISO === hoyISO) {
        totalHoy += Number(v.total || 0);
      }

      if (fecha >= inicioMes) {
        totalMes += Number(v.total || 0);
      }
    });

    setVentasHoy(totalHoy);
    setVentasMes(totalMes);
  };

  // --------------------------------------------------
  // Gráfica: Ventas por cada día del mes
  // --------------------------------------------------
  const ventasPorDia = [];

  for (let d = 1; d <= 31; d++) {
    ventasPorDia.push({
      dia: d,
      total: 0,
    });
  }

  ventas.forEach((v) => {
    const fecha = v.fecha?.toDate();
    if (!fecha) return;

    if (fecha >= inicioMes) {
      let dia = fecha.getDate();
      ventasPorDia[dia - 1].total += Number(v.total || 0);
    }
  });

  // --------------------------------------------------
  // 📌 Gráfica de Balance mensual (acumulado)
  // --------------------------------------------------
  let acumulado = 0;
  const balanceData = ventasPorDia.map((item) => {
    acumulado += item.total;
    return {
      dia: item.dia,
      total: item.total,
      balance: acumulado, // línea ascendente acumulada
    };
  });

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Dashboard Administrativo</h1>

      {/* Tarjetas */}
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
          <h3>📦 Total Registros Venta</h3>
          <p className="card-valor">{ventas.length}</p>
        </div>
      </div>

      {/* Gráfica original */}
      <section className="grafica-box">
        <h2>📆 Ventas por Día del Mes</h2>

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

      {/* -------------------------------------------- */}
      {/* 📊 NUEVA GRÁFICA: BALANCE MENSUAL ACUMULADO */}
      {/* -------------------------------------------- */}
      <section className="grafica-box">
        <h2>💰 Balance Acumulado del Mes</h2>

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
    </div>
  );
}
