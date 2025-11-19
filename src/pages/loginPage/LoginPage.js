import { useState } from "react";
import Swal from "sweetalert2";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./LoginPage.css";
import logo from "../../assets/Explosión de color y energía.png";
import { registrarLog } from "../../utils/auditoriaService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN CON EMAIL/PASSWORD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire(
        "Campos vacíos",
        "Por favor llena todos los campos.",
        "warning"
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 📄 Buscar datos del usuario en Firestore
      const userDocRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        Swal.fire("Acceso denegado", "Tu cuenta no está registrada.", "error");
        // 🔴 Registrar intento de acceso con cuenta inexistente
        await registrarLog("Intento de inicio de sesión (usuario no registrado)", "Fallido");
        return;
      }

      const data = userSnap.data();

      // 🚫 Validar estado
      if (data.estado === "Inactivo") {
        Swal.fire(
          "Acceso denegado",
          "Tu cuenta está inactiva. Contacta al administrador.",
          "error"
        );
        return;
      }

     // ✅ Mostrar bienvenida
Swal.fire({
  title: "¡Bienvenido!",
  text: `Sesión iniciada como ${user.email}`,
  icon: "success",
  timer: 1800,
  showConfirmButton: false,
}).then(() => {
  // 🔹 Si el usuario es ADMIN → redirigir al panel admin
  if (data.rol === "admin") {
    window.location.href = "/admin/dashboard";
  }
  // 🔹 Si NO es admin → redirigir al dashboard normal
  else {
    window.location.href = "/dashboard";
  }
});
    } catch (error) {
      console.error("Error de login:", error);
      let message = "Error al iniciar sesión. Inténtalo de nuevo.";

      // Mensajes específicos según el código de error
      if (error.code === "auth/user-not-found") {
        message = "Usuario no encontrado. Verifica tu correo.";
      } else if (error.code === "auth/wrong-password") {
        message = "Contraseña incorrecta. Inténtalo de nuevo.";
      } else if (error.code === "auth/too-many-requests") {
        message =
          "Demasiados intentos fallidos. Intenta nuevamente más tarde.";
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
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
