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

// Protege rutas con autenticación Firebase
import ProtectedRoute from './pages/components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage/DashboardPage'; 
import AuxiliaresPage from './pages/AuxiliaresPage/AuxiliaresPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';

       

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Rutas protegidas con Firebase Auth */}
        <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute> } />
        <Route path="/auxiliares" element={<ProtectedRoute> <AuxiliaresPage /> </ProtectedRoute> } />

        {/* Ruta genérica para páginas no encontradas */}
        <Route path="*" element={<NotFoundPage />} />

        {/* Rutas para prácticas de hooks */}
        <Route path="/usestate" element={<UseStatePlay />} />
        <Route path="/useeffect" element={<UseEffectPlay />} />
        <Route path="/useref" element={<UseRefPlay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;