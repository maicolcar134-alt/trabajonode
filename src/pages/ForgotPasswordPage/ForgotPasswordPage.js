import { useState } from 'react';
import Swal from 'sweetalert2';
import { validarEmailConDominios } from '../../utils/validarEmail';
import './ForgotPasswordPage.css';
import logo from '../../assets/Explosión de color y energía.png';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire("Campo vacío", "Por favor ingresa tu correo.", "warning");
      return;
    }

    const allowed = ["gmail.com","hotmail.com","outlook.com","live.com","yahoo.com","icloud.com"];
    const resultado = validarEmailConDominios(email, allowed, "simple");
    if (!resultado.valido) {
      Swal.fire("Correo inválido", resultado.razon, "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        title: "¡Revisa tu correo!",
        html: `Te hemos enviado instrucciones para recuperar tu contraseña, tienes 60 minutos. <strong>¡Podría estar en SPAM!</strong>`,
        icon: "success",
        timer: 5000,
        showConfirmButton: false
      });
      setEmail('');
    } catch (error) {
      console.error("Error Firebase:", error.code, error.message);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
      <div className="form-card">
        <img src={logo} alt="Logo mas " className="logo mb-3" style={{ width: '250px' }} />
        <h3 className="mb-4 text-center">Recuperar Contraseña</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
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
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">Enviar instrucciones</button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleGoBack}>
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
