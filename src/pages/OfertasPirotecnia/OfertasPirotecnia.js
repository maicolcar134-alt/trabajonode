import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import userDefault from "../../assets/Explosión de color y energía.png";
import "./OfertasPirotecnia.css";



const DURATION_HOURS = 3;
const SALE_END_TIMESTAMP = null;

const sampleProducts = [
  {
    id: 1,
    title: "Pack Celebración Familiar",
    subtitle: "10 bengalas + 3 fuentes + 5 voladores",
    image: "",
    price: 291000,
    oldPrice: 404000,
    discountPercent: 28,
    stock: 15,
    endsInDays: 2,
  },
  {
    id: 2,
    title: "Combo Nochevieja 2025",
    subtitle: "Pack especial para fin de año",
    image: "",
    price: 538000,
    oldPrice: 673000,
    discountPercent: 20,
    stock: 8,
    endsInDays: 5,
  },
  {
    id: 3,
    title: "Bengalas Premium x20",
    subtitle: "Pack especial de bengalas doradas",
    image: "",
    price: 85000,
    oldPrice: 112000,
    discountPercent: 24,
    stock: 35,
    endsInDays: 7,
  },
  {
    id: 4,
    title: "Kit Inicio Pirotecnia",
    subtitle: "Productos básicos + guía de seguridad",
    image: "",
    price: 134000,
    oldPrice: 206000,
    discountPercent: 35,
    stock: 22,
    endsInDays: 3,
  },
];

function formatCurrency(num) {
  return "$" + new Intl.NumberFormat("es-CO").format(Math.round(num));
}
function pad(n) {
  return n.toString().padStart(2, "0");
}

export default function OfertasPirotecnia() {
  const navigate = useNavigate();
  const user = true;
  const userPhoto = user ? userDefault : null;

  const handleLogout = () => {
    alert("Sesión cerrada correctamente");
    navigate("/dashboard");
  };

  // 🛒 Estado del carrito
  const [cart, setCart] = useState([]);

  // 🔥 Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // ✅ Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Función para añadir producto al carrito
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    alert(`🛒 ${product.title} se agregó al carrito`);
  };

  // ✅ Función para realizar compra directa (banner)
  const buyNow = (product) => {
    setCart((prev) => [...prev, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    navigate("/Carrito"); // 🔥 redirige al carrito
  };

  // Tiempo restante venta flash
  const [targetTime] = useState(() => {
    if (SALE_END_TIMESTAMP) return SALE_END_TIMESTAMP;
    const now = Date.now();
    return now + DURATION_HOURS * 60 * 60 * 1000;
  });

  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, targetTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mainProduct = {
    id: 100,
    title: "Venta Flash - Batería 50 Disparos",
    price: 224000,
    oldPrice: 359000,
    discountPercent: 38,
    stockLeft: 5,
    progressPercent: 50,
  };

  return (
    <div className="ofertas-page">

      {/* CONTENIDO DE OFERTAS */}
      <div className="ofertas-wrap">
        {/* Banner Venta Flash */}
        <div className="flash-banner">
          <div className="flash-left">
            <div className="flash-badge">¡Venta Flash!</div>
            <h2 className="flash-title">{mainProduct.title}</h2>
            <div className="flash-prices">
              <span className="price-now">
                {formatCurrency(mainProduct.price)}
              </span>
              <span className="price-old">
                {formatCurrency(mainProduct.oldPrice)}
              </span>
              <span className="discount-pill">
                -{mainProduct.discountPercent}%
              </span>
            </div>
            <div className="stock-line">
              <small>Quedan {mainProduct.stockLeft} unidades</small>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${mainProduct.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flash-right">
            <div className="timer-label">Termina en:</div>
            <div className="timer">
              <div className="timer-block">
                {pad(hours)}
                <span className="timer-sub">h</span>
              </div>
              <div className="timer-sep">:</div>
              <div className="timer-block">
                {pad(minutes)}
                <span className="timer-sub">m</span>
              </div>
              <div className="timer-sep">:</div>
              <div className="timer-block">
                {pad(seconds)}
                <span className="timer-sub">s</span>
              </div>
            </div>

            {/* ✅ Botón funcional del banner */}
            <button className="btn-primary" onClick={() => buyNow(mainProduct)}>
              Comprar Ahora
            </button>
          </div>
        </div>

        {/* Tarjetas de productos */}
        <div className="cards-grid">
          {sampleProducts.map((p) => (
            <article key={p.id} className="product-card">
              <div className="card-media">
                <img src={p.image} alt={p.title} />
                <div className="badge-left">Destacado</div>
                <div className="badge-right">-{p.discountPercent}%</div>
              </div>

              <div className="card-body">
                <h3 className="card-title">{p.title}</h3>
                <p className="card-sub">{p.subtitle}</p>

                <div className="price-row">
                  <div className="price-block">
                    <div className="current">{formatCurrency(p.price)}</div>
                    <div className="old">{formatCurrency(p.oldPrice)}</div>
                  </div>
                  <div className="meta">
                    <small>Stock: {p.stock}</small>
                    <small>Termina en {p.endsInDays} días</small>
                  </div>
                </div>

                <div className="card-progress">
                  <div className="mini-track">
                    <div
                      className="mini-fill"
                      style={{
                        width: `${Math.min(90, Math.max(10, 100 - p.stock))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* ✅ Botón funcional */}
                <button className="btn-add" onClick={() => addToCart(p)}>
                  Añadir al Carrito
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Beneficios */}
        <div className="benefits-grid">
          <div className="benefit">
            <div className="benefit-icon">🏷️</div>
            <h4>Mejor Precio Garantizado</h4>
            <p>Si encuentras un precio mejor, lo igualamos</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">✨</div>
            <h4>Ofertas Exclusivas</h4>
            <p>Suscríbete para recibir ofertas especiales</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">⏳</div>
            <h4>Ofertas Limitadas</h4>
            <p>Nuevas promociones cada semana</p>
          </div>
        </div>
      </div>
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
