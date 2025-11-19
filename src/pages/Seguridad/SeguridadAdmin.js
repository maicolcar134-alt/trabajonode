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

      {/* 📄 FOOTER REGLAMENTO */}
      <footer className="footer">
        <h3>📄 Documentación y Recursos</h3>
        <p>
          Descarga el reglamento completo y materiales educativos oficiales.
        </p>
        <button className="btn-descarga">Descargar PDF</button>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warm)] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🎆</span>
                </div>
                <div>
                  <h3 className="m-0">PyroShop</h3>
                  <p className="text-sm text-white/70 m-0">Pirotecnia Legal</p>
                </div>
              </div>
              <p className="text-sm text-white/80">
                Venta legal y responsable de pirotecnia certificada.
              </p>
            </div>

            <div>
              <h4 className="mb-4">Legal y Seguridad</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <a
                    href="/politicasventa"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Política de Venta Responsable
                  </a>
                </li>
                <li>
                  <a
                    href="/terminoscondiciones"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a
                    href="/PoliticasPrivacidad"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="/normativaregulacion"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Normativa y Regulación
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <a
                    href="/Seguridad"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline"
                  >
                    Guía de Seguridad
                  </a>
                </li>
                <li>
                  <a
                    href="/HelpCenter"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline"
                  >
                    Ayuda al Usuario
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Contacto</h4>
              <ul className="space-y-3 list-none p-0 m-0">
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>+573213148729</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>info@pyroshop.co</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>
                    Calle 12 # 45-67
                    <br />
                    Ocaña, Norte de Santander
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-white/90 m-0">
              <strong>Aviso Legal:</strong> La venta de artículos pirotécnicos
              está sujeta a la normativa vigente. El comprador se compromete a usar los
              productos de forma responsable y siguiendo todas las instrucciones
              de seguridad. 
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p className="m-0">
              © 2025 PyroShop. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SeguridadAdmin;
