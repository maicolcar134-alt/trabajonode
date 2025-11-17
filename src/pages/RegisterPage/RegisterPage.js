import { useState } from "react";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "./RegisterPage.css";
import logo from "../../assets/Explosión de color y energía.png";

function RegisterPage() {
  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 🔹 Estado para las verificaciones de edad
  const [edadVerificada, setEdadVerificada] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Función para calcular edad
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // 🔹 Contar cuántos usuarios mayores de edad hay
  const contarVerificados = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const mayores = snapshot.docs.filter((d) => d.data().edad >= 18);
    setEdadVerificada(mayores.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validaciones básicas
    for (const key in formData) {
      if (formData[key] === "") {
        Swal.fire(
          "Campos incompletos",
          "Por favor llena todos los campos.",
          "warning"
        );
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Correo inválido", "Escribe un correo válido.", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Contraseña", "Las contraseñas no coinciden.", "error");
      return;
    }

    // 🔹 Calcular edad del usuario
    const edad = calcularEdad(formData.fechaNacimiento);

    if (edad < 18) {
      Swal.fire({
        icon: "error",
        title: "Edad no permitida",
        text: "Debes tener al menos 18 años para registrarte.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 🔹 Guardar en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        cedula: formData.cedula,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        fechaNacimiento: formData.fechaNacimiento,
        edad: edad,
        sexo: formData.sexo,
        telefono: formData.telefono,
        email: formData.email,
        Rol: "Cliente",
        estado: "pendiente",
      });

      // 🔹 Actualizar contador de verificaciones
      await contarVerificados();

      Swal.fire(
        "¡Registro exitoso!",
        `Usuario registrado correctamente. Verificaciones de edad: ${
          edadVerificada + 1
        }`,
        "success"
      ).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire("Error", "Este correo ya está registrado.", "error");
      } else {
        console.error(error);
        Swal.fire("Error", "No se pudo registrar el usuario.", "error");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient">
      <div className="form-card">
        <img
          src={logo}
          alt="logo mas"
          className="logo mb-3 d-block mx-auto"
          style={{ width: "120px" }}
        />
        <h3 className="mb-4 text-center">Registro de Usuario</h3>

        {/* 🔹 Tarjeta con el contador de edad verificada */}
        <div className="d-flex justify-content-center align-items-center mb-3 gap-2">
          {edadVerificada > 0 ? (
            <FaCheckCircle className="icono-verificado" />
          ) : (
            <FaExclamationTriangle className="icono-noverificado" />
          )}
          <h5 className="m-0 text-success">
            Verificaciones de edad: {edadVerificada}
          </h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombres</label>
            <input
              type="text"
              className="form-control"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Tus nombres"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Tus apellidos"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cédula</label>
            <input
              type="text"
              className="form-control"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="Tu cédula"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha de Nacimiento</label>
            <input
              type="date"
              className="form-control"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 3001234567"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Sexo</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexo"
                  value="Masculino"
                  checked={formData.sexo === "Masculino"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Masculino</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexo"
                  value="Femenino"
                  checked={formData.sexo === "Femenino"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Femenino</label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Escribe tu contraseña"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Repetir Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
            <a href="/" className="btn btn-outline-secondary">
              Volver al inicio
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
