import React, { useState } from "react";
import { Navbar, Nav, Badge, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "./NormativaRegulacion.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/Explosión de color y energía.webp";
import userPhoto from "../../assets/Explosión de color y energía.webp";

function NormativaRegulacion() {
  const navigate = useNavigate();

  // Estado temporal. En producción esto viene desde Firebase o Context.
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
        <h1 className="titulo-principal">Normativa y Regulación</h1>

        <section className="politicas-contenido">
          <p><strong>Pyroshop – Ocaña, Norte de Santander</strong></p>

          <p>
            La comercialización, almacenamiento, distribución y uso de artículos
            pirotécnicos en Colombia está estrictamente regulada por leyes nacionales,
            decretos y ordenanzas municipales. Pyroshop cumple plenamente con estas
            normativas, especialmente las vigentes en Ocaña, Norte de Santander.
          </p>

          <h2>1. Normativa Nacional en Colombia</h2>
          <p>Pyroshop se acoge a las siguientes leyes:</p>

          <h3>1.1 Ley 670 de 2001</h3>
          <ul>
            <li>Prohibición de venta de pirotecnia a menores de edad.</li>
            <li>Responsabilidad del comercio en la distribución segura.</li>
            <li>Campañas de prevención.</li>
          </ul>

          <h3>1.2 Ley 1801 de 2016 – Código Nacional de Seguridad y Convivencia</h3>
          <ul>
            <li>Art. 30-31: Prohibición de fabricación y distribución sin permiso.</li>
            <li>Art. 33: Venta restringida a menores.</li>
            <li>Art. 34: Regula espectáculos con pólvora.</li>
          </ul>

          <h3>1.3 Decreto 4481 de 2006</h3>
          <p>Requisitos técnicos y de seguridad para la comercialización.</p>

          <h3>1.4 Decreto 2157 de 2017</h3>
          <p>Normas para prevenir riesgos con materiales peligrosos.</p>

          <h3>1.5 Resoluciones del Ministerio de Salud</h3>
          <ul>
            <li>Clasificación oficial de artículos permitidos.</li>
            <li>Normas de manipulación segura.</li>
            <li>Protocolos de reporte de incidentes.</li>
          </ul>

          <h2>2. Normativa Departamental – Norte de Santander</h2>
          <ul>
            <li>Restricciones horarios.</li>
            <li>Permisos para espectáculos.</li>
            <li>Campañas de prevención.</li>
          </ul>

          <h2>3. Normativa Municipal – Ocaña</h2>
          <h3>✔ Venta a menores prohibida</h3>
          <p>Obligatorio verificar identificación.</p>

          <h3>✔ Solo productos permitidos</h3>
          <ul>
            <li>Voladores</li>
            <li>Totes</li>
            <li>Rascapiedras</li>
            <li>Detonantes</li>
            <li>Pólvora negra</li>
            <li>Artefactos no certificados</li>
          </ul>

          <h3>✔ Requisitos para eventos</h3>
          <ul>
            <li>Permiso Alcaldía</li>
            <li>Bomberos</li>
            <li>Plan de emergencias</li>
            <li>Personal autorizado</li>
          </ul>

          <h3>✔ Sanciones</h3>
          <ul>
            <li>Decomiso</li>
            <li>Multas</li>
            <li>Sellamiento</li>
          </ul>

          <h3>✔ Almacenamiento</h3>
          <ul>
            <li>Ventilación adecuada</li>
            <li>Señalización</li>
            <li>Extintores</li>
            <li>Inventario actualizado</li>
          </ul>

          <h2>4. Responsabilidades de Pyroshop</h2>
          <ul>
            <li>Verificación de mayoría de edad.</li>
            <li>Venta de artículos permitidos.</li>
            <li>Proveedores certificados.</li>
            <li>Cumplimiento de normas de seguridad.</li>
            <li>Reporte de incidentes.</li>
          </ul>

          <h2>5. Recomendaciones al comprador</h2>
          <ul>
            <li>Ser mayor de 18 años.</li>
            <li>Usar pirotecnia en espacios seguros.</li>
            <li>Evitar alcohol.</li>
            <li>Prohibido acceso a menores.</li>
            <li>Leer instrucciones.</li>
          </ul>

          <h2>6. Actualizaciones</h2>
          <p>
            Pyroshop actualizará esta sección cuando haya nuevas disposiciones
            nacionales o municipales.
          </p>
        </section>
      </header>
    </div>
  );
}

export default NormativaRegulacion;
