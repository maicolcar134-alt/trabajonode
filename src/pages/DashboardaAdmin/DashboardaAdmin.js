import React from 'react';
import './DashboardaAdmin.css';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const DashboardaAdmin = () => {
  const lineData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Ventas',
        data: [800000, 950000, 870000, 910000, 970000, 990000, 930000],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ['Bengalas', 'Cohes', 'Fuentes', 'Baterías', 'Otros'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#6b7280'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="top-status-bar">
        <span className="status-text">🟢 Sistema operando normalmente</span>
      </div>

      <div className="stats-cards">
        <div className="card green">
          <h2>$12.800.000</h2>
          <p>Ventas del Día</p>
        </div>
        <div className="card orange">
          <h2>23</h2>
          <p>Productos</p>
        </div>
        <div className="card blue">
          <h2>47</h2>
          <p>Activos</p>
        </div>
        <div className="card red">
          <h2>5</h2>
          <p>Pendientes</p>
        </div>
      </div>

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

      <div className="compliance-section">
        <h3>✅ Cumplimiento Legal</h3>
        <div className="progress-item">
          <span>Productos con ficha técnica</span>
          <div className="progress-bar yellow" style={{ width: '94%' }}></div>
        </div>
        <div className="progress-item">
          <span>Verificaciones KYC completadas</span>
          <div className="progress-bar red" style={{ width: '87%' }}></div>
        </div>
        <div className="progress-item">
          <span>Productos certificados CE</span>
          <div className="progress-bar green" style={{ width: '100%' }}></div>
        </div>
      </div>

      <div className="operations-section">
        <h3>🕓 Últimas Operaciones</h3>
        <ul>
          <li className="success">#12847 - Juan Pérez — Pedido completado</li>
          <li className="warning">#12846 - María García — Verificación KYC</li>
          <li className="info">#12845 - Carlos López — Pedido enviado</li>
          <li className="error">#12844 - Ana Martínez — Ficha técnica subida</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardaAdmin;
