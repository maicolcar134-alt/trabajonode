import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SeguridadAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";

function SeguridadAdmin() {
  const navigate = useNavigate();

  const [user, setUser] = useState(true);
  const [cart, setCart] = useState([]);

  const handleLogout = () => {
    console.log("Cerrar sesión");
    alert("Sesión cerrada correctamente");
    setUser(false);
    navigate("/dashboard");
  };

  const descargarGuia = () => {
    const contenido = `
    📘 GUÍA DE SEGURIDAD PIROTÉCNICA

    ⚠️ ADVERTENCIA LEGAL
    El uso de artículos pirotécnicos está regulado por la ley.
    Solo deben ser manipulados por adultos responsables y en zonas autorizadas.

    🧯 INFORMACIÓN VITAL
    - No apuntes fuegos artificiales hacia personas o animales.
    - Evita encenderlos en espacios cerrados o con viento fuerte.
    - Ten siempre agua o un extintor de emergencia.

    🚀 ANTES / DURANTE / DESPUÉS
    ➤ Antes:
      Verifica el estado del producto y lee las instrucciones.
    ➤ Durante:
      Mantén distancia segura, evita alcohol y sigue recomendaciones.
    ➤ Después:
      Asegúrate de que no existan residuos encendidos.

    🚫 PROHIBICIONES ÉTICAS
    - No usar pirotecnia cerca de hospitales, animales o ancianos.
    - No hacer demostraciones sin supervisión profesional.
    - No vender productos ilegales.

    🚨 PROTOCOLOS DE EMERGENCIA
    En caso de accidente, mantén la calma.
    Busca ayuda médica y llama a emergencias.

    ❓ PREGUNTAS FRECUENTES
    - ¿Puedo usar pirotecnia en zonas residenciales?
      No, salvo autorización oficial.
    - ¿Qué hago si un producto no enciende?
      Espera 10 minutos y apágalo con agua.
    - ¿Los niños pueden manipular pirotecnia?
      No. Solo adultos responsables.

    -----------------------------------------
    Guía generada automáticamente desde el sistema.
    `;

    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Guia_de_Seguridad_Pirotecnica.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="seguridad-container">

      <header className="header">

        {/* EJEMPLO para cuando quieras agregar imágenes:
        
        <img 
          src={banner}
          loading="lazy"
          alt="Banner de seguridad"
          className="banner-img"
        />
        
        */}

        <h1 className="titulo-principal">Guía de Seguridad Pirotécnica</h1>
        <p className="subtitulo">
          Información esencial para el manejo responsable y seguro de productos
          pirotécnicos.
        </p>
      </header>

      <section className="bloque advertencia">
        <h2>⚠️ Advertencia Legal</h2>
        <p>
          El uso de artículos pirotécnicos está regulado por la ley. Solo deben
          ser manipulados por adultos responsables y en espacios autorizados.
        </p>
      </section>

      <section className="bloque vital">
        <h2>🧯 Información Vital</h2>
        <ul>
          <li>No apuntes fuegos artificiales hacia personas o animales.</li>
          <li>Evita encenderlos en espacios cerrados o con viento fuerte.</li>
          <li>Ten siempre a mano agua o un extintor de emergencia.</li>
        </ul>
      </section>

      <section className="bloque pasos">
        <h2>🚀 Antes, Durante y Después del Uso</h2>
        <div className="pasos-grid">
          <div className="paso">
            <h3>Antes</h3>
            <p>Verifica el estado del producto y asegúrate de tener una zona despejada.</p>
          </div>
          <div className="paso">
            <h3>Durante</h3>
            <p>Mantén distancia, evita alcohol y sigue las recomendaciones.</p>
          </div>
          <div className="paso">
            <h3>Después</h3>
            <p>Verifica que no queden residuos encendidos.</p>
          </div>
        </div>
      </section>

      <section className="bloque prohibiciones">
        <h2>🚫 Prohibiciones Éticas</h2>
        <ul>
          <li>No usar pirotecnia cerca de hospitales, animales o ancianos.</li>
          <li>No realizar demostraciones sin supervisión.</li>
          <li>No vender productos ilegales.</li>
        </ul>
      </section>

      <section className="bloque emergencia">
        <h2>🚨 Protocolos de Emergencia</h2>
        <p>En caso de accidente, busca ayuda médica inmediata.</p>

        <button onClick={descargarGuia} className="btn-protocolo">
          📄 Descargar Guía de Emergencia
        </button>
      </section>

      <section className="bloque faq">
        <h2>❓ Preguntas Frecuentes</h2>
        <details>
          <summary>¿Puedo usar pirotecnia en zonas residenciales?</summary>
          <p>No, salvo autorización oficial.</p>
        </details>
        <details>
          <summary>¿Qué hago si un producto no enciende?</summary>
          <p>Espera 10 minutos, luego apágalo con agua.</p>
        </details>
        <details>
          <summary>¿Los niños pueden manipular pirotecnia?</summary>
          <p>No, solo adultos responsables.</p>
        </details>
      </section>
    </div>
  );
}

export default SeguridadAdmin;
