import { BrowserRouter, Route, Routes } from "react-router-dom";

// Rutas públicas
import "bootstrap/dist/css/bootstrap.min.css";
import NotFoundPage from "./pages/components/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

// Playground hooks
import UseEffectPlay from "./pages/Playground/UseEffectPlay";
import UseRefPlay from "./pages/Playground/UseRefPlay";
import UseStatePlay from "./pages/Playground/UseStatePlay";

import "./App.css";

// Autenticación
import ProtectedRoute from "./pages/components/ProtectedRoute";

// Rutas principales
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import AuxiliaresPage from "./pages/AuxiliaresPage/AuxiliaresPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";

// Rutas del panel admin
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import Inventario from "./pages/Inventario/Inventario";
import Categorias from "./pages/CategoriasAdmin/CategoriasAdmin";
import Seguridad from "./pages/Seguridad/SeguridadAdmin";
import Pedidos from "./pages/pedidos/Pedidos";
import Auditoria from "./pages/Auditoria/Auditoria";
import ZonasEnvioPro from "./pages/ZonasEnvio/ZonasEnvio";

// Cliente tienda
import HelpCenter from "./pages/HelpCenter/HelpCenter";
import OfertasPirotecnia from "./pages/OfertasPirotecnia/OfertasPirotecnia";
import EventsPage from "./pages/Events/Events";
import Carrito from "./pages/CarritoPage/Carrito";
import Checkout from "./pages/CheckoutPage/Checkout";
import Gracias from "./pages/Gracias/Gracias";

// Layout admin persistente
import Admin from "./pages/Admin/Admin";

import PoliticasVenta from "./pages/PoliticasVenta/PoliticasVenta";
import TerminosCondiciones from "./pages/Terminos Y Condiciones/terminoscondiciones";
import PoliticasPrivacidad from "./pages/PoliticaPrivacidad/PoliticaPrivacidad";
import NormativaRegulacion from "./pages/NormativaRegulacion/NormativaRegulacion";



function App() {
  return (
    <BrowserRouter>


    
      <Routes>
        {/* ✅ RUTAS PÚBLICAS */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ✅ RUTAS PROTEGIDAS GENERALES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <AuxiliaresPage />
            </ProtectedRoute>
          }
        />
        <Route path="/PoliticasVenta" element={<PoliticasVenta />} />
        <Route path="/TerminosCondiciones" element={<TerminosCondiciones />} />
        <Route path="/PoliticasPrivacidad" element={<PoliticasPrivacidad />} />
        <Route path="/NormativaRegulacion" element={<NormativaRegulacion />} />

        {/* ✅✅✅ PANEL ADMIN CON SIDEBAR FIJO ✅✅✅ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rol="admin">
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="inventario" element={<Inventario />} />

          <Route path="pedidos" element={<Pedidos />} />
          <Route path="usuarios" element={<AuxiliaresPage />} />
          <Route path="auditoria" element={<Auditoria />} />
          <Route path="zonas" element={<ZonasEnvioPro />} />
        </Route>

        {/* ✅ TIENDA (PÚBLICO / CLIENTES) */}
        <Route path="/helpcenter" element={<HelpCenter />} />
        <Route path="/ofertaspirotecnia" element={<OfertasPirotecnia />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/seguridad" element={<Seguridad />} />

        {/* ✅ COMPRA */}
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gracias"
          element={
            <ProtectedRoute>
              <Gracias />
            </ProtectedRoute>
          }
        />

        {/* ✅ PLAYGROUND */}
        <Route path="/usestate" element={<UseStatePlay />} />
        <Route path="/useeffect" element={<UseEffectPlay />} />
        <Route path="/useref" element={<UseRefPlay />} />

        {/* ✅ 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
