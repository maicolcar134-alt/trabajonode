import { BrowserRouter, Route, Routes } from 'react-router-dom';




// Rutas públicas
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundPage from './pages/components/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';




// Rutas para hooks

import UseEffectPlay from './pages/Playground/UseEffectPlay';
import UseRefPlay from './pages/Playground/UseRefPlay';
import UseStatePlay from './pages/Playground/UseStatePlay';
import './App.css';


// Protege rutas con autenticación Firebase
import ProtectedRoute from './pages/components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage/DashboardPage'; 
import AuxiliaresPage from './pages/AuxiliaresPage/AuxiliaresPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import DashboardAdmin from './pages/DashboardAdmin/DashboardAdmin';
import Inventario from './pages/Inventario/Inventario';
import CategoriasAdmin from './pages/CategoriasAdmin/CategoriasAdmin';
import SeguridadAdmin from './pages/Seguridad/SeguridadAdmin';
import HelpCenter from './pages/HelpCenter/HelpCenter';
import OfertasPirotecnia from './pages/OfertasPirotecnia/OfertasPirotecnia';
import EventsPage from './pages/Events/Events';
import Pedidos from './pages/Pedidos/Pedidos';
import Pedidos from  './pages/Pedidos/Pedidos'
import Auditoria from './pages/Auditoria/Auditoria';
import ZonasEnvioPro from './pages/ZonasEnvio/ZonasEnvio';
import Carrito from "./pages/CarritoPage/Carrito";
import Checkout from './pages/CheckoutPage/Checkout';
import Gracias from './pages/Gracias/Gracias';



import Admin from './pages/Admin/Admin';





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* Rutas públicas */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

      

       
      

        {/* Rutas protegidas con Firebase Auth */}
        <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute> } />
        <Route path="/usuarios" element={<ProtectedRoute> <AuxiliaresPage /> </ProtectedRoute> } />
        <Route path="/dashboarda" element={<ProtectedRoute> <DashboardAdmin /> </ProtectedRoute> } />
      <Route path="/inventario" element={<ProtectedRoute> <Inventario /> </ProtectedRoute> } />
      <Route path="/Categorias" element={ <CategoriasAdmin />  } />
      <Route path="/Seguridad" element={<ProtectedRoute> <SeguridadAdmin /> </ProtectedRoute> } />
       <Route path="/DashboardAdmin" element={<ProtectedRoute> <DashboardAdmin /> </ProtectedRoute> } /> 
       <Route path="/Inventario" element={<ProtectedRoute> <Inventario /> </ProtectedRoute> } />
        <Route path="/categorias" element={<ProtectedRoute> <CategoriasAdmin /> </ProtectedRoute> } />
        <Route path="/seguridad" element={ <SeguridadAdmin />  } />  
        <Route path="/Pedidos" element={<ProtectedRoute> <Pedidos/> </ProtectedRoute> } /> 
        <Route path="/helpcenter" element={ <HelpCenter />  } />
        <Route path="/ofertaspirotecnia" element={ <OfertasPirotecnia />  } /> 
        <Route path="/events" element={<EventsPage />  } /> 
        <Route path="/auditoria" element={<ProtectedRoute> <Auditoria /> </ProtectedRoute> } /> 
        <Route path="/ZonasEnvio" element={<ProtectedRoute> <ZonasEnvioPro /> </ProtectedRoute> } />
       <Route path="/Carrito" element={<ProtectedRoute> <Carrito /> </ProtectedRoute> } />
       <Route path="/checkout" element={<ProtectedRoute> < Checkout/> </ProtectedRoute> } />
       <Route path="/gracias" element={<ProtectedRoute> < Gracias/> </ProtectedRoute> } />
       
          
     
        <Route path="/Admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute> } />
        {/* Ruta genérica para páginas no encontradas */}
        <Route path="" element={<NotFoundPage />} />
        
        
        

        {/* Rutas para prácticas de hooks */}
        <Route path="/usestate" element={<UseStatePlay />} />
        <Route path="/useeffect" element={<UseEffectPlay />} />
        <Route path="/useref" element={<UseRefPlay />} />
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;