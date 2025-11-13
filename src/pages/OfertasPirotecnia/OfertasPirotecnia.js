import React, { useEffect, useState } from "react";
import { Navbar, Nav,Badge, Container, Spinner } from "react-bootstrap";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import logo from "../../assets/Explosión de color y energía.png";
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
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            className="brand-logo"
          >
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => navigate("/Dashboard")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/Categorias")}>
                Categorías
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>
                Ofertas
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/Seguridad")}>
                Seguridad
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>
              <Nav.Link
                onClick={() => navigate("/Admin")}
                className="text-warning"
              >
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>

              {user ? (
                <Nav.Item className="logout-container" onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img
                      src={userPhoto}
                      alt="Foto de usuario"
                      className="user-photo-nav"
                    />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link
                  onClick={() => navigate("/login")}
                  className="d-flex align-items-center gap-2 fw-bold text-light"
                >
                  <FaUser /> Acceder
                </Nav.Link>
              )}

              <Nav.Link
                onClick={() => navigate("/Carrito")}
                className="cart-icon position-relative"
              >
                <FaShoppingCart />
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
            <Spinner animation="border" />
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
    </div>
  );
}
