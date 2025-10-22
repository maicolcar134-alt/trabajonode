import React, { useEffect, useState } from "react";
import "./OfertasPirotecnia.css";

/**
 * Configuración:
 * - DURATION_HOURS: duración por defecto del flash sale (3 horas por defecto)
 * - Puedes cambiar DURATION_HOURS o pasar un timestamp objetivo si lo deseas.
 */
const DURATION_HOURS = 3; // por defecto 3 horas; cambia aquí si quieres
const SALE_END_TIMESTAMP = null; // si prefieres fecha fija, pon new Date("2025-10-21T23:59:59").getTime()

const sampleProducts = [
  {
    id: 1,
    title: "Pack Celebración Familiar",
    subtitle: "10 bengalas + 3 fuentes + 5 voladores",
    image: "https://images.unsplash.com/photo-1541532703592-79a0317b6c2a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5b5e9f6b3c2b7d9d1a7b",
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
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a1de8e1a3b94a2c3d1b",
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
    image: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=d887d7c4a1c7b8c0e4ef",
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
    image: "https://images.unsplash.com/photo-1504457048433-94b01b6a6b8b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=cb5b3b4d2f7be023d0aa",
    price: 134000,
    oldPrice: 206000,
    discountPercent: 35,
    stock: 22,
    endsInDays: 3,
  },
];

function formatCurrency(num) {
  // Formato sin decimales, separador de miles, estilo similar a $224.000
  return "$" + new Intl.NumberFormat("es-CO").format(Math.round(num));
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

export default function OfertasPirotecnia() {
  // Calcula la fecha final (configurable)
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

  // derive HH:MM:SS
  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Example: main flash product info (could be first product)
  const mainProduct = {
    title: "Venta Flash - Batería 50 Disparos",
    price: 224000,
    oldPrice: 359000,
    discountPercent: 38,
    stockLeft: 5,
    progressPercent: 50,
  };

  return (
    <div className="ofertas-wrap">
      {/* Banner Venta Flash */}
      <div className="flash-banner">
        <div className="flash-left">
          <div className="flash-badge">¡Venta Flash!</div>
          <h2 className="flash-title">{mainProduct.title}</h2>
          <div className="flash-prices">
            <span className="price-now">{formatCurrency(mainProduct.price)}</span>
            <span className="price-old">{formatCurrency(mainProduct.oldPrice)}</span>
            <span className="discount-pill">-{mainProduct.discountPercent}%</span>
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
          <button className="btn-primary">Comprar Ahora</button>
        </div>
      </div>

      {/* Product cards */}
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
                  {/* ejemplo de progreso aleatorio visual */}
                  <div
                    className="mini-fill"
                    style={{ width: `${Math.min(90, Math.max(10, 100 - p.stock))}%` }}
                  />
                </div>
              </div>

              <button className="btn-add">Añadir al Carrito</button>
            </div>
          </article>
        ))}
      </div>

      {/* Benefits / Features */}
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
  );
}
