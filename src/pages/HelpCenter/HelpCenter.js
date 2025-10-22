import React from "react";
import "./HelpCenter.css";

export default function HelpCenter() {
  return (
    <div className="helpcenter">
      {/* Encabezado */}
      <div className="header">
        <button className="btn-center">Centro de Ayuda</button>
        <h2>¿En qué podemos ayudarte?</h2>
        <p>
          Encuentra respuestas rápidas o contacta con nuestro equipo de soporte.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar en preguntas frecuentes..."
          />
        </div>
      </div>

      {/* Tarjetas de contacto */}
      <div className="contact-section">
        <div className="card green">
          <h3>📞 Teléfono</h3>
          <p className="main">+57 (1) 3213148729</p>
          <p>🕒 L-V: 8:00–18:00, S: 9:00–13:00</p>
          <button>Contactar</button>
        </div>

        <div className="card blue">
          <h3>📧 Email</h3>
          <p className="main">soporte@pyroshop.co</p>
          <p>📬 Respuesta en 24h</p>
          <button>Contactar</button>
        </div>

        <div className="card orange">
          <h3>💬 WhatsApp</h3>
          <p className="main">+57 3213148729</p>
          <p>🕓 L-V: 7:00–21:00</p>
          <button>Contactar</button>
        </div>
      </div>

      {/* Secciones de categorías */}
      <div className="categories">
        <button className="active">📦 Pedidos y Compras</button>
        <button>🚚 Envíos y Entregas</button>
        <button>🔁 Devoluciones y Cambios</button>
        <button>🔒 Seguridad y Legal</button>
        <button>👤 Cuenta y Perfil</button>
      </div>

      {/* Preguntas frecuentes */}
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

      {/* Guías y Chat */}
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
          <button>💬 Abrir Chat de Soporte</button>
          <small>Tiempo medio de respuesta: 5 minutos</small>
        </div>
      </div>
    </div>
  );
}
