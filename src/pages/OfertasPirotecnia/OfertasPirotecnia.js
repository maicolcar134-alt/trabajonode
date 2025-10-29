import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Explosión de color y energía.png"; 
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

  // Función para añadir producto al carrito
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    alert(`🛒 ${product.title} se agregó al carrito`);
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
              {/* NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand onClick={() => navigate("/dashboard")} className="brand-logo">
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>
          

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => navigate("/Dashboard")} className="active-link">Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/Categorias")}>Categorias</Nav.Link>

              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>Ofertas</Nav.Link>
              <Nav.Link onClick={() => navigate("/Seguridad")}>seguridad</Nav.Link>
              
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link> 
              <Nav.Link onClick={() => navigate("/Admin")} className="text-warning">
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>
           

              {/* Botón de usuario o iniciar sesión */}
              {user ? (
                <Nav.Item className="logout-container" onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img src={user } alt="Foto de usuario" className="user-photo-nav" />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link onClick={() => navigate("/login")} className="d-flex align-items-center gap-2 fw-bold text-light">
                  <FaUser /> Acceder
                </Nav.Link>
              )}

              {/* Ícono carrito */}
              <Nav.Link onClick={() => navigate("/Carrito")} className="cart-icon">
                <FaShoppingCart />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
            <button
              className="btn-primary"
              onClick={() => addToCart(mainProduct)}
            >
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
    </div>
  );
}
