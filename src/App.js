import { BrowserRouter, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


// Layout global con Navbar
import MainLayout from "./layouts/MainLayout";

//  IMPORTAMOS EL FOOTER
import Footer from "./pages/components/Footer/Footer";

// Rutas públicas
import NotFoundPage from "./pages/components/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import LoginPage from "./pages/loginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";

// Autenticación
import ProtectedRoute from "./pages/components/ProtectedRoute";

// Playground hooks
import UseEffectPlay from "./pages/playground/UseEffectPlay";
import UseRefPlay from "./pages/playground/UseRefPlay";
import UseStatePlay from "./pages/playground/UseStatePlay";

// Tienda / clientes
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import AuxiliaresPage from "./pages/AuxiliaresPage/AuxiliaresPage";
import HelpCenter from "./pages/HelpCenter/HelpCenter";
import OfertasPirotecnia from "./pages/OfertasPirotecnia/OfertasPirotecnia";
import EventsPage from "./pages/Events/Events";
import Carrito from "./pages/CarritoPage/Carrito";
import Checkout from "./pages/CheckoutPage/Checkout";
import Gracias from "./pages/Gracias/Gracias";
import Categorias from "./pages/CategoriasAdmin/CategoriasAdmin"; 
import Seguridad from "./pages/Seguridad/SeguridadAdmin";
import TerminosCondiciones from "./pages/Terminos Y Condiciones/terminoscondiciones";
import PoliticasVenta from "./pages/PoliticasVenta/PoliticasVenta";
import NormativaRegulacion from "./pages/NormativaRegulacion/NormativaRegulacion";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad/PoliticaPrivacidad";

// Panel admin
import Admin from "./pages/Admin/Admin";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import Inventario from "./pages/Inventario/Inventario";
import Pedidos from "./pages/Pedidos/Pedidos";
import Auditoria from "./pages/Auditoria/Auditoria";
import ZonasEnvioPro from "./pages/ZonasEnvio/ZonasEnvio";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/*  RUTAS SIN NAVBAR */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/*  TODA LA APLICACIÓN CON NAVBAR GLOBAL */}
        <Route
          element={
            <>
              <MainLayout />

              {/*FOOTER SE MOSTRARÁ EN TODAS LAS VISTAS DE CLIENTES */}
              <Footer />
            </>
          }
        >

          {/* Página inicial */}
          <Route path="/" element={<DashboardPage />} />

          {/* RUTAS PROTEGIDAS */}
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

          {/* CLIENTES / TIENDA */}
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/ofertaspirotecnia" element={<OfertasPirotecnia />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/seguridad" element={<Seguridad />} />
          <Route path="/terminoscondiciones" element={<TerminosCondiciones />} />
          <Route path="/politicasventa" element={<PoliticasVenta />} />
          <Route path="/normativaregulacion" element={<NormativaRegulacion />} />
          <Route path="/politicaprivacidad" element={<PoliticaPrivacidad />} />

          {/* COMPRA */}
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

          {/* PLAYGROUND */}
          <Route path="/usestate" element={<UseStatePlay />} />
          <Route path="/useeffect" element={<UseEffectPlay />} />
          <Route path="/useref" element={<UseRefPlay />} />

        </Route>

        {/* PANEL ADMIN (NO USA EL NAVBAR DE CLIENTES NI FOOTER) */}
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

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
