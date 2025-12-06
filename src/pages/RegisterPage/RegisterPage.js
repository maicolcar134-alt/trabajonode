import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { validarEmail, validarEmailConDominios } from "../../utils/validarEmail";
import "./RegisterPage.css";
import logo from "../../assets/Explosión de color y energía.webp";

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [phoneDisplay, setPhoneDisplay] = useState("");

  const formatColPhone = (digits) => {
    if (!digits) return "";
    const d = digits.replace(/\D/g, "");
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)} ${d.slice(3)}`;
    return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,10)}`;
  };

  const [edadVerificada, setEdadVerificada] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombres" || name === "apellidos") {
      const cleanedName = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s\-']/g, "").replace(/\s+/g, " ").slice(0, 60);
      setFormData((prev) => ({ ...prev, [name]: cleanedName }));
      return;
    }

    if (name === "telefono") {
      let cleaned = value.replace(/[^\d\+]/g, "");

      if (cleaned.startsWith("+")) {
        if (!cleaned.startsWith("+57")) {
          cleaned = cleaned.replace("+", "");
        }
      }

      if (cleaned.startsWith("+57")) {
        const after = cleaned.replace("+57", "").replace(/\D/g, "").slice(0, 10);
        setFormData((prev) => ({ ...prev, telefono: after }));
        setPhoneDisplay(`+57 ${formatColPhone(after)}`);
        return;
      }

      const digits = cleaned.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, telefono: digits }));
      setPhoneDisplay(formatColPhone(digits));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (formData.telefono) {
      setPhoneDisplay(formatColPhone(formData.telefono));
    }
  }, [formData.telefono]);

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

  const contarVerificados = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const mayores = snapshot.docs.filter((d) => d.data().edad >= 18);
    setEdadVerificada(mayores.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    const valid = {};

    const required = ["nombres", "apellidos", "fechaNacimiento", "sexo", "telefono", "email", "password", "confirmPassword"];
    required.forEach((k) => {
      valid[k] = !!(formData[k] && String(formData[k]).trim() !== "");
      if (!valid[k]) errors[k] = "Campo requerido";
    });

    const nameRx = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/;
    if (formData.nombres && !nameRx.test(formData.nombres)) {
      valid.nombres = false;
      errors.nombres = "Solo letras, espacios, guiones o apóstrofes";
    }
    if (formData.apellidos && !nameRx.test(formData.apellidos)) {
      valid.apellidos = false;
      errors.apellidos = "Solo letras, espacios, guiones o apóstrofes";
    }

    const telefonoDigits = (formData.telefono || "").replace(/\D/g, "");
    if (telefonoDigits.length !== 10) {
      valid.telefono = false;
      errors.telefono = "Debe tener exactamente 10 dígitos";
    }

    const allowed = ["gmail.com", "hotmail.com", "outlook.com", "live.com", "yahoo.com", "icloud.com"];
    const resultadoDominio = validarEmailConDominios(formData.email, allowed, "simple");
    if (!resultadoDominio.valido) {
      valid.email = false;
      errors.email = resultadoDominio.razon || "Correo inválido";
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      valid.password = false;
      valid.confirmPassword = false;
      errors.password = "Las contraseñas no coinciden";
    }

    const edad = calcularEdad(formData.fechaNacimiento);
    if (!isFinite(edad) || edad < 18) {
      valid.fechaNacimiento = false;
      errors.fechaNacimiento = "Debes tener al menos 18 años";
    }

    const emailQ = query(collection(db, "usuarios"), where("email", "==", (formData.email || "").toLowerCase()));
    const phoneQ = query(collection(db, "usuarios"), where("telefono", "==", telefonoDigits));
    const [emailSnap, phoneSnap] = await Promise.all([getDocs(emailQ), getDocs(phoneQ)]);
    if (!emailSnap.empty) {
      valid.email = false;
      errors.email = "Correo ya registrado";
    }
    if (!phoneSnap.empty) {
      valid.telefono = false;
      errors.telefono = "Teléfono ya registrado";
    }

    const anyInvalid = Object.values(valid).some((v) => v === false);
    if (anyInvalid) {
      const labels = {
        nombres: "Nombres",
        apellidos: "Apellidos",
        fechaNacimiento: "Fecha de Nacimiento (edad)",
        sexo: "Sexo",
        telefono: "Teléfono",
        email: "Correo Electrónico",
        password: "Contraseña",
        confirmPassword: "Confirmar Contraseña",
      };

      const rows = Object.keys(labels)
        .map((k) => {
          const ok = valid[k] !== false;
          const icon = ok ? "✅" : "❌";
          const msg = errors[k] ? `<small style="color:#d33;margin-left:8px">${errors[k]}</small>` : "";
          return `<div style="display:flex;align-items:center;gap:8px;margin:6px 0">${icon} <strong>${labels[k]}</strong> ${msg}</div>`;
        })
        .join("");

      await Swal.fire({
        title: "Errores en el formulario",
        html: rows,
        icon: "error",
        width: 600,
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

      const telefonoGuardar = (formData.telefono || "").replace(/\D/g, "");
      await setDoc(doc(db, "usuarios", user.uid), {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        fechaNacimiento: formData.fechaNacimiento,
        edad: edad,
        sexo: formData.sexo,
        telefono: telefonoGuardar,
        email: formData.email,
        Rol: "Cliente",
        estado: "pendiente",
      });

      await contarVerificados();

      Swal.fire(
        "¡Registro exitoso!",
        `Usuario registrado correctamente. Verificaciones de edad: ${edadVerificada + 1}`,
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
          loading="lazy"   
        />

        <h3 className="mb-4 text-center">Registro de Usuario</h3>

        <div className="d-flex justify-content-center align-items-center mb-3 gap-2">
          {edadVerificada > 0 ? (
            <FaCheckCircle className="icono-verificado" />
          ) : (
            <FaExclamationTriangle className="icono-noverificado" />
          )}
          <h5 className="m-0 text-success">Verificaciones de edad: {edadVerificada}</h5>
        </div>

        <form onSubmit={handleSubmit}>
          {/* CAMPOS IGUAL QUE TU VERSIÓN */}
          ...
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
