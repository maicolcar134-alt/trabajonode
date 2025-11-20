import React, { useState } from "react";
import { Navbar, Nav, Badge, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./PoliticaPrivacidad.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/Explosión de color y energía.png";
import userPhoto from "../../assets/Explosión de color y energía.png";

function PoliticasPrivacidad() {
  const navigate = useNavigate();

  const [user, setUser] = useState(true);
  const [cart, setCart] = useState([]);

  const handleLogout = () => {
    alert("Sesión cerrada correctamente");
    setUser(false);
    navigate("/dashboard");
  };

  return (
    <div className="seguridad-container">

      {/* 🧨 CONTENIDO PRINCIPAL */}
      <header className="header">
        <h1 className="titulo-principal">Política de Privacidad</h1>

        <section className="politicas-contenido">

          <h2>Pyroshop – Tienda Virtual de Pirotecnia en Colombia</h2>

          <h3>1. Introducción</h3>
          <p>
            En Pyroshop valoramos la privacidad y protección de los datos personales de
            nuestros usuarios, clientes y visitantes. Esta Política explica cómo
            recopilamos, utilizamos, almacenamos y protegemos su información, conforme
            a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
          </p>

          <h3>2. Responsable del Tratamiento de Datos</h3>
          <ul>
            <li><strong>Nombre comercial:</strong> Pyroshop</li>
            <li><strong>Actividad:</strong> Venta virtual de artículos pirotécnicos</li>
            <li><strong>Correo electrónico:</strong> pyroshopmc@gmail.com</li>
            <li><strong>Teléfono:</strong>+57 321 314 8729</li>
          </ul>

          <h3>3. Datos personales que recopilamos</h3>

          <h4>3.1 Datos de identificación</h4>
          <ul>
            <li>Nombres y apellidos</li>
            <li>Número de documento</li>
            <li>Fecha de nacimiento</li>
          </ul>

          <h4>3.2 Datos de contacto</h4>
          <ul>
            <li>Teléfono</li>
            <li>Correo electrónico</li>
          </ul>

          <h4>3.3 Datos transaccionales</h4>
          <ul>
            <li>Dirección de entrega</li>
            <li>Información de facturación</li>
          </ul>

          <h4>3.4 Datos sensibles</h4>
          <p>
            Pyroshop no solicita datos sensibles excepto cuando la ley lo exija, y
            siempre con autorización expresa.
          </p>

          <h3>4. Finalidades del tratamiento</h3>

          <h4>4.1 Finalidades principales</h4>
          <ul>
            <li>Procesar compras</li>
            <li>Verificar mayoría de edad</li>
            <li>Gestionar envíos y pagos</li>
            <li>Notificar sobre el estado de pedidos</li>
          </ul>

          <h4>4.2 Finalidades secundarias</h4>
          <ul>
            <li>Enviar promociones (si el usuario autoriza)</li>
            <li>Actualizar programas de fidelización</li>
          </ul>

          <h4>4.3 Seguridad</h4>
          <ul>
            <li>Prevención de fraudes</li>
            <li>Verificación de identidad</li>
          </ul>

          <h3>5. Derechos del titular</h3>
          <ul>
            <li>Consultar información</li>
            <li>Solicitar corrección o actualización</li>
            <li>Solicitar eliminación</li>
            <li>Revocar autorización</li>
            <li>Presentar quejas</li>
          </ul>

          <h3>6. Legitimación del tratamiento</h3>
          <p>
            Pyroshop solo trata datos con autorización previa o por obligaciones
            contractuales o legales.
          </p>

          <h3>7. Transferencia y transmisión</h3>
          <p>Podemos compartir datos con:</p>
          <ul>
            <li>Pasarelas de pago</li>
            <li>Transportadoras certificadas</li>
            <li>Entidades gubernamentales</li>
            <li>Servicios tecnológicos</li>
          </ul>
          <p><strong>Nunca vendemos información personal.</strong></p>

          <h3>8. Seguridad</h3>
          <ul>
            <li>Protocolos HTTPS</li>
            <li>Cifrado</li>
            <li>Acceso restringido</li>
            <li>Monitoreo y auditorías</li>
          </ul>

          <h3>9. Uso de cookies</h3>
          <p>
            Usamos cookies para navegación, preferencias, carrito y análisis. El usuario
            puede desactivarlas desde su navegador.
          </p>

          <h3>10. Conservación de datos</h3>
          <p>
            Los datos se almacenan solo el tiempo necesario para obligaciones legales,
            seguridad y prestación de servicios.
          </p>

          <h3>11. Modificaciones</h3>
          <p>
            Pyroshop puede actualizar esta política en cualquier momento. Los cambios
            importantes serán notificados al usuario.
          </p>

          <h3>12. Aceptación</h3>
          <p>
            El uso de los servicios de Pyroshop implica la aceptación de esta Política
            de Privacidad.
          </p>

        </section>
      </header>
    </div>
  );
}

export default PoliticasPrivacidad;
