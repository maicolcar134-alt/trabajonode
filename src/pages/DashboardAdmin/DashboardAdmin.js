import React, { useEffect } from 'react';
import './DashboardAdmin.css';
import { Line, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { registrarLog } from "../../utils/auditoriaService"; // ✅ importar el servicio de auditoría

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const DashboardaAdmin = () => {
  const navigate = useNavigate();

  // 🟢 Registrar acceso al panel
  useEffect(() => {
    const registrarAcceso = async () => {
      await registrarLog("Acceso al panel administrativo", "Éxito");
    };
    registrarAcceso();
  }, []);

  // 🔹 Acción del botón Volver
  const handleVolver = async () => {
    await registrarLog("Salida del panel administrativo", "Éxito");
    navigate('/Admin'); // Ruta de retorno
  };

  // Datos vacíos para los gráficos
  const lineData = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#6b7280'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* 🔹 Barra superior */}
      <div className="top-status-bar">
        <span className="status-text">Panel Administrativo</span>

        {/* 🔙 Botón Volver al Inicio */}
        <button className="btn-volver" onClick={handleVolver}>
          <Home size={16} />
          <span>Volver Admin</span>
        </button>
      </div>

      {/* 🔹 Tarjetas estadísticas */}
      <div className="stats-cards">
        <div className="card green">
          <h2>--</h2>
          <p>Ventas del Día</p>
        </div>
        <div className="card orange">
          <h2>--</h2>
          <p>Productos</p>
        </div>
        <div className="card blue">
          <h2>--</h2>
          <p>Activos</p>
        </div>
        <div className="card red">
          <h2>--</h2>
          <p>Pendientes</p>
        </div>
      </div>

      {/* 🔹 Gráficos */}
      <div className="charts-row">
        <div className="chart-box line-chart">
          <h3>📈 Ventas Semanales</h3>
          <Line data={lineData} />
        </div>
        <div className="chart-box pie-chart">
          <h3>📊 Distribución de Productos</h3>
          <Pie data={pieData} />
        </div>
      </div>

      {/* 🔹 Cumplimiento Legal */}
      <div className="compliance-section">
        <h3>✅ Cumplimiento Legal</h3>
        <div className="progress-item">
          <span>Productos con ficha técnica</span>
          <div className="progress-bar yellow" style={{ width: '0%' }}></div>
        </div>
        <div className="progress-item">
          <span>Verificaciones KYC completadas</span>
          <div className="progress-bar red" style={{ width: '0%' }}></div>
        </div>
        <div className="progress-item">
          <span>Productos certificados CE</span>
          <div className="progress-bar green" style={{ width: '0%' }}></div>
        </div>
      </div>

      {/* 🔹 Últimas Operaciones */}
      <div className="operations-section">
        <h3>🕓 Últimas Operaciones</h3>
        <ul>
          <li className="success">--</li>
          <li className="warning">--</li>
          <li className="info">--</li>
          <li className="error">--</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardaAdmin;

