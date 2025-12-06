import { useState } from "react";
import Swal from "sweetalert2";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./LoginPage.css";
import logo from "../../assets/Explosión de color y energía.webp";
import { registrarLog } from "../../utils/auditoriaService";
import { retryAsyncSmartly } from "../../utils/retryHelper";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ========== VALIDACIONES ================
  const validarInputs = () => {
    if (!email.trim() || !password.trim()) {
      Swal.fire("Campos vacíos", "Por favor llena todos los campos.", "warning");
      return false;
    }

    // Email válido
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Swal.fire("Correo inválido", "Ingresa un correo válido.", "warning");
      return false;
    }

    return true;
  };

  // ========== LOGIN ================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarInputs()) return;

    try {
      // Autenticación con reintentos
      const userCredential = await retryAsyncSmartly(
        () => signInWithEmailAndPassword(auth, email, password),
        3,
        1000
      );

      const user = userCredential.user;

      // Obtener datos del usuario de Firestore con reintento
      const userDoc = doc(db, "usuarios", user.uid);
      const userSnap = await retryAsyncSmartly(() => getDoc(userDoc), 3, 1000);

      // Usuario sin registro en Firestore
      if (!userSnap.exists()) {
        Swal.fire("Acceso denegado", "Tu cuenta no está registrada.", "error");
        await registrarLog(
          "Intento de inicio de sesión (usuario no registrado)",
          "Fallido"
        );
        return;
      }

      const data = userSnap.data();

      // Validar estado del usuario
      if (data.estado === "Inactivo") {
        Swal.fire(
          "Cuenta inactiva",
          "Tu cuenta está inactiva. Contacta al administrador.",
          "error"
        );
        return;
      }

      // ========== BIENVENIDA ==========
      Swal.fire({
        title: "¡Bienvenido!",
        text: `Sesión iniciada como ${user.email}`,
        icon: "success",
        timer: 1700,
        showConfirmButton: false,
      }).then(() => {
        const destino = data.rol === "admin" 
          ? "/admin/dashboard" 
          : "/dashboard";

        window.location.href = destino;
      });

    } catch (error) {
      console.error("❌ Error de login:", error);
      let message = "Error al iniciar sesión. Inténtalo de nuevo.";

      switch (error.code) {
        case "auth/user-not-found":
          message = "Usuario no encontrado. Verifica tu correo.";
          break;
        case "auth/wrong-password":
          message = "Contraseña incorrecta.";
          break;
        case "auth/too-many-requests":
          message = "Demasiados intentos fallidos. Intenta más tarde.";
          break;
        case "auth/network-request-failed":
          message = "Problema de conexión. Verifica tu red.";
          break;
      }

      Swal.fire("Error de autenticación", message, "error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
      <div className="form-card">
        <img
          src={logo}
          alt="logo mas"
          className="logo mb-3 d-block mx-auto"
          style={{
            width: "160px",
            borderRadius: "50%",
            border: "2px solid #D4AF37",
            padding: "5px",
          }}
        />

        <h3 className="mb-4 text-center">Iniciar Sesión</h3>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <a href="/register">¿No tienes cuenta? Regístrate</a>
          <br />
          <a href="/forgot">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
