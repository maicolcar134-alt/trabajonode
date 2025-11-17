import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SeguridadAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";


function SeguridadAdmin() {
  const navigate = useNavigate();

  // 🧠 Estado simulado de usuario y carrito
  const [user, setUser] = useState(true);
  const [cart, setCart] = useState([]);

  // 🔒 Cierre de sesión
  const handleLogout = () => {
    console.log("Cerrar sesión");
    alert("Sesión cerrada correctamente");
    // Aquí puedes agregar lógica real de logout con Firebase:
    // signOut(auth).then(() => navigate("/login"));
    setUser(false);
    navigate("/dashboard");
  };

  return (
    <div className="seguridad-container">



      {/* 🧨 CONTENIDO PRINCIPAL */}
      <header className="header">
        <h1 className="titulo-principal">Guía de Seguridad Pirotécnica</h1>
        <p className="subtitulo">
          Información esencial para el manejo responsable y seguro de productos
          pirotécnicos.
        </p>
      </header>

      {/* ⚠️ ADVERTENCIA */}
      <section className="bloque advertencia">
        <h2>⚠️ Advertencia Legal</h2>
        <p>
          El uso de artículos pirotécnicos está regulado por la ley. Solo deben
          ser manipulados por adultos responsables y en espacios autorizados. El
          incumplimiento puede acarrear sanciones legales y riesgos graves de
          salud.
        </p>
      </section>

      {/* 🧯 INFORMACIÓN VITAL */}
      <section className="bloque vital">
        <h2>🧯 Información Vital</h2>
        <ul>
          <li>No apuntes fuegos artificiales hacia personas o animales.</li>
          <li>Evita encenderlos en espacios cerrados o con viento fuerte.</li>
          <li>Ten siempre a mano agua o un extintor de emergencia.</li>
        </ul>
      </section>

      {/* 🚀 PASOS */}
      <section className="bloque pasos">
        <h2>🚀 Antes, Durante y Después del Uso</h2>
        <div className="pasos-grid">
          <div className="paso">
            <h3>Antes</h3>
            <p>
              Verifica el estado del producto, lee las instrucciones y asegúrate
              de tener una zona despejada y segura.
            </p>
          </div>
          <div className="paso">
            <h3>Durante</h3>
            <p>
              Mantén una distancia prudente, evita el consumo de alcohol y sigue
              las recomendaciones del fabricante.
            </p>
          </div>
          <div className="paso">
            <h3>Después</h3>
            <p>
              Revisa que no queden residuos encendidos y limpia el área. No
              reutilices artículos fallados.
            </p>
          </div>
        </div>
      </section>

      {/* 🚫 PROHIBICIONES */}
      <section className="bloque prohibiciones">
        <h2>🚫 Prohibiciones Éticas</h2>
        <ul>
          <li>No usar pirotecnia cerca de hospitales, animales o ancianos.</li>
          <li>No realizar demostraciones sin supervisión profesional.</li>
          <li>No vender productos ilegales o de origen desconocido.</li>
        </ul>
      </section>

      {/* 🚨 EMERGENCIA */}
      <section className="bloque emergencia">
        <h2>🚨 Protocolos de Emergencia</h2>
        <p>
          En caso de accidente, mantén la calma y busca ayuda médica inmediata.
          Llama a los números de emergencia locales y no apliques remedios sin
          conocimiento.
        </p>
        <button className="btn-protocolo">Ver Guía de Emergencia</button>
      </section>

      {/* ❓ FAQ */}
      <section className="bloque faq">
        <h2>❓ Preguntas Frecuentes</h2>
        <details>
          <summary>¿Puedo usar pirotecnia en zonas residenciales?</summary>
          <p>
            No, salvo que las autoridades locales lo autoricen expresamente.
          </p>
        </details>
        <details>
          <summary>¿Qué hago si un producto no enciende?</summary>
          <p>
            Espera al menos 10 minutos, luego apágalo con agua. No intentes
            encenderlo de nuevo.
          </p>
        </details>
        <details>
          <summary>¿Los niños pueden manipular fuegos artificiales?</summary>
          <p>Absolutamente no. Solo adultos responsables deben hacerlo.</p>
        </details>
      </section>

      {/* 📄 FOOTER */}
      <footer className="footer">
        <h3>📄 Documentación y Recursos</h3>
        <p>
          Descarga el reglamento completo y materiales educativos oficiales.
        </p>
        <button className="btn-descarga">Descargar PDF</button>
      </footer>
    </div>
  );
}

export default SeguridadAdmin;
