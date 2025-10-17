import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Admin.css';
import 'tailwindcss/tailwind.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Admin() {
  const salesData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Ventas',
        data: [1200000, 2800000, 2100000, 3500000, 4000000, 4600000, 3200000],
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
        borderColor: 'rgba(255,115,74,1)',
        backgroundColor: 'rgba(255,115,74,0.06)',
        fill: true
      }
    ]
  };

  const pieData = {
    labels: ['Bengalas', 'Cohetes', 'Petardos', 'Otros'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(255,115,74,0.95)',
          'rgba(59,130,246,0.95)',
          'rgba(234,88,12,0.95)',
          'rgba(99,102,241,0.95)'
        ]
      }
    ]
  };

  const orders = [
    { id: '#3251', client: 'María G.', status: 'Entregado', total: '$120.000' },
    { id: '#3252', client: 'Juan P.', status: 'En tránsito', total: '$250.000' },
    { id: '#3253', client: 'Carlos R.', status: 'Pendiente', total: '$90.000' },
    { id: '#3254', client: 'Laura M.', status: 'Cancelado', total: '$0' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 font-inter flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/70 border-r border-slate-800 p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{background: 'linear-gradient(45deg,#ff7a2c,#ffcf4c)'}}>
            🔥
          </div>
          <div>
            <div className="font-bold text-lg">PyroAdmin</div>
            <div className="text-sm text-slate-400">Panel de Control</div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon="fa-solid fa-cube" label="Dashboard" active />
          <NavItem icon="fa-solid fa-boxes-stacked" label="Inventario" badge="23" />
          <NavItem icon="fa-solid fa-receipt" label="Pedidos" badge="5" />
          <NavItem icon="fa-solid fa-users" label="Usuarios" />
          <NavItem icon="fa-regular fa-file-lines" label="Fichas y Documentos" badge="3" />
          <NavItem icon="fa-solid fa-truck" label="Envíos / Zonas" />
          <NavItem icon="fa-solid fa-gear" label="Configuración" />
          <NavItem icon="fa-solid fa-shield-halved" label="Cumplimiento" badge="2" />
          <NavItem icon="fa-solid fa-list" label="Auditoría / Logs" />
        </nav>

        <div className="text-slate-500 text-xs mt-4">v1.0 • Pyro</div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 bg-slate-800/60 px-3 py-2 rounded-md min-w-[340px]">
            <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
            <input className="bg-transparent outline-none text-slate-300 placeholder:text-slate-500" placeholder="Buscar pedido, usuario o SKU..." />
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-md font-semibold shadow-md"> <i className="fa-solid fa-plus mr-2"></i> Nuevo Producto</button>
            <div className="relative p-2 bg-slate-800/50 rounded-md">
              <i className="fa-regular fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">3</span>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-md"><i className="fa-regular fa-user"></i></div>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-md border border-slate-700">
            <span className="w-3 h-3 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 block"></span>
            <span className="text-emerald-300">Sistema operando normalmente</span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg p-4 bg-gradient-to-b from-emerald-600 to-emerald-700 shadow"> 
              <div className="flex justify-between items-start">
                <i className="fa-solid fa-dollar-sign text-2xl"></i>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs">+12.5%</div>
              </div>
              <div className="text-2xl font-bold mt-4">$12.800.000</div>
              <div className="text-sm text-slate-200/80">Ventas del Día</div>
            </div>

            <div className="rounded-lg p-4 bg-gradient-to-b from-orange-600 to-orange-700 shadow flex flex-col justify-center">
              <i className="fa-solid fa-box text-2xl mb-2"></i>
              <div className="text-3xl font-bold">23</div>
              <div className="text-sm text-slate-200/80">productos</div>
            </div>

            <div className="rounded-lg p-4 bg-gradient-to-b from-blue-600 to-blue-700 shadow flex flex-col justify-center">
              <i className="fa-solid fa-cart-plus text-2xl mb-2"></i>
              <div className="text-3xl font-bold">47</div>
              <div className="text-sm text-slate-200/80">activos</div>
            </div>

            <div className="rounded-lg p-4 bg-gradient-to-b from-red-600 to-red-700 shadow flex flex-col justify-center">
              <i className="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
              <div className="text-3xl font-bold">5</div>
              <div className="text-sm text-slate-200/80">pendientes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 bg-slate-800/60 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Ventas Semanales</h3>
                <div className="text-sm text-slate-400">Última semana</div>
              </div>
              <div style={{height: 220}}>
                <Line data={salesData} options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#9aa3ad' } },
                    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#9aa3ad' } }
                  }
                }} />
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Distribución de Productos</h3>
                <div className="text-sm text-slate-400">Categorías</div>
              </div>
              <div className="flex items-center justify-center" style={{height:220}}>
                <Pie data={pieData} options={{ plugins: { legend: { position: 'right', labels: { color: '#cbd5e1' } } } }} />
              </div>
            </div>

            <div className="lg:col-span-3 bg-slate-800/60 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Últimos Pedidos</h3>
                <div className="text-sm text-slate-400">Recientes</div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-slate-400 text-left">
                    <tr>
                      <th className="py-2 pr-4">Pedido</th>
                      <th className="py-2 pr-4">Cliente</th>
                      <th className="py-2 pr-4">Estado</th>
                      <th className="py-2 pr-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-t border-slate-700">
                        <td className="py-3 pr-4">{o.id}</td>
                        <td className="py-3 pr-4">{o.client}</td>
                        <td className="py-3 pr-4 text-slate-300">{o.status}</td>
                        <td className="py-3 pr-4">{o.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function NavItem({ icon, label, badge, active }){
  return (
    <div className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition ${active ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/40'}`}>
      <i className={`${icon} w-5 text-center`}></i>
      <div className="flex-1 text-sm">{label}</div>
      {badge && <div className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">{badge}</div>}
    </div>
  );
}

export default Admin;




