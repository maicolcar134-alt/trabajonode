import React from "react";
import "./Footer.css";

export default function Footer() {
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
            <strong>Aviso Legal:</strong> La venta de artículos pirotécnicos está sujeta a la normativa vigente. El comprador se compromete a usar los productos de forma responsable y siguiendo todas las instrucciones de seguridad.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p className="m-0">© 2025 PyroShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
  
}
