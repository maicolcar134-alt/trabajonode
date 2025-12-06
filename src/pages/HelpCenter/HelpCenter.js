import React from "react";
import { useNavigate } from "react-router-dom";
import "./HelpCenter.css";

export default function HelpCenter() {
  const navigate = useNavigate();
  const user = false; // 🔸 Cambiar por lógica real

  const handleLogout = () => {
    console.log("Cerrar sesión");
  };

  return (
    <div className="helpcenter">

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <div className="header">
        <h2>Centro De Ayuda</h2>
        <br />
        <h2>¿En qué podemos ayudarte?</h2>
        <p>
          Encuentra respuestas rápidas o contacta con nuestro equipo de soporte.
        </p>
      </div>

      {/* 🔹 Preguntas frecuentes */}
      <div className="faq-section">
        <h3>Pedidos y Compras</h3>

        <details>
          <summary>¿Cómo hago un pedido?</summary>
          <p>
            Ingresa al catálogo, selecciona el producto y sigue los pasos del
            carrito hasta el pago.
          </p>
        </details>

        <details>
          <summary>¿Puedo cancelar o modificar mi pedido?</summary>
          <p>
            Puedes cancelarlo dentro de las primeras 2 horas comunicándote con
            nuestro soporte.
          </p>
        </details>

        <details>
          <summary>¿Qué formas de pago aceptan?</summary>
          <p>
            Aceptamos tarjetas de crédito, débito, transferencias y pagos en
            efectivo.
          </p>
        </details>

        <details>
          <summary>¿Emiten facturas?</summary>
          <p>
            Sí, enviamos la factura automáticamente a tu correo electrónico tras
            completar la compra.
          </p>
        </details>
      </div>

      {/* 🔹 Guías y Chat */}
      <div className="extra-section">
        <div className="guide purple">
          <h4>📘 Guías y Tutoriales</h4>
          <ul>
            <li>→ Cómo elegir el producto adecuado</li>
            <li>→ Guía de almacenamiento seguro</li>
            <li>→ Normativas por comunidad autónoma</li>
            <li>→ Calculadora de cantidad por evento</li>
          </ul>
        </div>

        <div className="support orange-dark">
          <h4>❓ ¿No encuentras respuesta?</h4>
          <p>
            Nuestro equipo está disponible para ayudarte con cualquier consulta
            específica.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pyroshopmc@gmail.com"
            className="btn-soporte"
          >
            💬 Abrir Chat de Soporte
          </a>
          <small>Tiempo medio de respuesta: 5 minutos</small>
        </div>
      </div>

      {/* 🔹 Contacto */}
      <div className="contact-section">

        {/* Teléfono */}
        <div className="card green">
          <h3>📞 Teléfono</h3>
          <p className="main">+57 3213148729</p>
          <p>🕒 L-V: 8:00–18:00, S: 9:00–13:00</p>

          <a href="tel:+573213148729" className="btn-contact">
            Contactar
          </a>
        </div>

        {/* Email */}
        <div className="card blue">
          <h3>📧 Email</h3>
          <p className="main">pyroshopmc@gmail.com</p>
          <p>📬 Respuesta en 24h</p>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pyroshopmc@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contact"
          >
            Contactar
          </a>
        </div>

        {/* WhatsApp */}
        <div className="card orange">
          <h3>💬 WhatsApp</h3>
          <p className="main">+57 3213148729</p>
          <p>🕓 L-V: 7:00–21:00</p>

          <a
            href="https://wa.me/573213148729"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contact"
          >
            Contactar
          </a>
        </div>

      </div>
    </div>
  );
}
