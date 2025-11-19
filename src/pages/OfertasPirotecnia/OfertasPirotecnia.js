import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ajusta la ruta según tu proyecto

import { useNavigate } from "react-router-dom";
import userDefault from "../../assets/Explosión de color y energía.png";
import Swal from "sweetalert2";
import "./OfertasPirotecnia.css";





const DURATION_HOURS = 3;
const SALE_END_TIMESTAMP = null;

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

  const [cart, setCart] = useState([]);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    alert(`🛒 ${product.nombre || product.title} se agregó al carrito`);
  };
  const buyNow = (product) => {
    setCart((prev) => [...prev, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    navigate("/Carrito");
  };

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

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Traer productos en oferta desde Inventario
  useEffect(() => {
    const q = query(collection(db, "productos"), where("enOferta", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOfertas(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 📝 Copiar mensaje de oferta al portapapeles
  const copiarMensajeOferta = (producto) => {
    const texto = `🔥 ${producto.mensajeOferta || "¡Aprovecha esta oferta!"} ${
      producto.porcentajeOferta
    }% de descuento en ${producto.nombre}. Precio: ${formatCurrency(
      producto.precio - (producto.precio * producto.porcentajeOferta) / 100
    )}`;
    navigator.clipboard
      .writeText(texto)
      .then(() =>
        Swal.fire(
          "📋 Copiado",
          "Texto de la oferta copiado al portapapeles",
          "success"
        )
      )
      .catch(() =>
        Swal.fire("❌ Error", "No se pudo copiar el texto", "error")
      );
  };

  return (
    <div className="ofertas-page">

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
            <button className="btn-primary" onClick={() => buyNow(mainProduct)}>
              Comprar Ahora
            </button>
          </div>
        </div>

        {/* Productos en oferta desde Firebase */}
        {loading ? (
          <div className="text-center mt-4">
            <p className="text-muted mt-2">Cargando ofertas...</p>
          </div>
        ) : ofertas.length === 0 ? (
          <p className="text-center text-muted mt-4">
            No hay productos en oferta actualmente.
          </p>
        ) : (
          <div className="cards-grid">
            {ofertas.map((p) => {
              const precioFinal =
                p.precio - (p.precio * p.porcentajeOferta) / 100;

              return (
                <article key={p.id} className="product-card">
                  <div className="card-media">
                    <img src={p.imagen || ""} alt={p.nombre} />
                    <div className="badge-left">Oferta</div>
                    <div className="badge-right">-{p.porcentajeOferta}%</div>
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{p.nombre}</h3>
                    <p className="card-sub">{p.descripcion || ""}</p>

                    <div className="price-row">
                      <div className="price-block">
                        <div className="current">
                          {formatCurrency(precioFinal)}
                        </div>
                        <div className="old">{formatCurrency(p.precio)}</div>
                      </div>
                      <div className="meta">
                        <small>Stock: {p.stock || 0}</small>
                      </div>
                    </div>

                    {/* Mostrar mensaje de oferta */}
                    {p.mensajeOferta && (
                      <div className="offer-message">
                        <textarea
                          readOnly
                          value={`${p.mensajeOferta} (${p.porcentajeOferta}% OFF)`}
                          onFocus={(e) => e.target.select()}
                        />
                       
                      </div>
                    )}

                    

                    <button className="btn-add" onClick={() => addToCart(p)}>
      
                      Añadir al Carrito
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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
