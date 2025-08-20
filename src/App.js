//import logo from './logo.svg';
//import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPages from "./pages/loginPage/LoginPage";
import ForgotPage from "./pages/ForgotPage/ForgotPage";
import Registerpage from "./RegisterPage/Registerpage";
//import para HOOKS
import HooksGral from "./pages/playground/HooksGral";
import UseStateHook from "./pages/playground/UseState/UseState";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPages />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/register" element={<Registerpage />} />

        {/* Rutas para Hooks */}
        <Route path="/hooks" element={<HooksGral />} />
        <Route path="/useState" element={<UseStateHook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
