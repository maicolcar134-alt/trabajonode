import React, { useEffect, useRef, useState } from "react";
import "./Footer.css";

export default function Footer() {
  const mapRef = useRef(null);
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadMap(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer mt-auto">
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
                  href="/politicaprivacidad"
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
                <span>+57 3213148729</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <span>pyroshopmc@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mapa con Lazy Loading avanzado */}
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg overflow-hidden map-box"
        >
          {loadMap ? (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.6746084202755!2d-73.3564525241768!3d8.235438400904044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e677bec71bc08dd%3A0x87799706d32a0a53!2sParque%20Principal%20Oca%C3%B1a!5e0!3m2!1ses-419!2sco!4v1764201206994!5m2!1ses-419!2sco"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          ) : (
            <div className="w-full h-full bg-gray-700/30 flex items-center justify-center text-white/60">
              Cargando mapa…
            </div>
          )}
        </div>

        {/* Aviso legal */}
        <div className="bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/30 rounded-lg p-4 mt-10 mb-6">
          <p className="text-sm text-white/90 m-0">
            <strong>Aviso Legal:</strong> La venta de artículos pirotécnicos está sujeta a la normativa vigente. El comprador se compromete a usar los productos de forma responsable y siguiendo todas las instrucciones de seguridad.
          </p>
        </div>

        {/* Derechos reservados */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60 mt-10">
          <p className="m-0">© 2025 PyroShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
