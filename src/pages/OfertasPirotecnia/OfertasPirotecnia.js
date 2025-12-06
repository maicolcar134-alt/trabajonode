// OfertasPirotecnia.js (modificado para usar precioOferta, modal de edición y lazy loading)
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

import { useNavigate } from "react-router-dom";
import userDefault from "../../assets/Explosión de color y energía.webp";
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
    setCart((prev) => {
      const nuevo = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(nuevo));
      return nuevo;
    });
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${product.nombre || product.title} agregado al carrito`,
      showConfirmButton: false,
      timer: 1400,
      background: "#111",
      color: "#fff",
    });
  };
  const buyNow = (product) => {
    const nuevo = [...cart, product];
    setCart(nuevo);
    localStorage.setItem("cart", JSON.stringify(nuevo));
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

  // Ejemplo principal
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

  // Firestore - traer productos en oferta
  useEffect(() => {
    const q = query(collection(db, "inventario"), where("oferta", "==", true));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOfertas(lista);
        setLoading(false);
      },
      (err) => {
        console.error("Error cargando ofertas:", err);
        Swal.fire("Error", "No se pudieron cargar las ofertas.", "error");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Copiar mensaje
  const copiarMensajeOferta = (producto) => {
    const nombre = producto.nombre ?? producto.title ?? "producto";
    const porcentaje = producto.ofertaValor ?? producto.porcentajeOferta ?? 0;
    const precio = Number(producto.precio ?? producto.price ?? 0);
    const precioFinal = producto.precioOferta
      ? Number(producto.precioOferta)
      : Math.max(0, precio - (precio * porcentaje) / 100);

    const texto = `🔥 ${
      producto.mensajeOferta ?? "¡Aprovecha esta oferta!"
    } ${porcentaje}% de descuento en ${nombre}. Precio: ${formatCurrency(
      precioFinal
    )}`;

    navigator.clipboard
      .writeText(texto)
      .then(() =>
        Swal.fire("📋 Copiado", "Texto de la oferta copiado", "success")
      )
      .catch(() =>
        Swal.fire("❌ Error", "No se pudo copiar el texto", "error")
      );
  };

  // Modal editar oferta
  const [modalOfertaVisible, setModalOfertaVisible] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [campoPrecioOferta, setCampoPrecioOferta] = useState("");
  const [campoPorcentaje, setCampoPorcentaje] = useState("");
  const [campoMensaje, setCampoMensaje] = useState("");
  const [campoOfertaActiva, setCampoOfertaActiva] = useState(true);

  const abrirModalEditarOferta = (p) => {
    setProductoEditando(p);
    setCampoPrecioOferta(p.precioOferta ? String(p.precioOferta) : "");
    setCampoPorcentaje(
      p.ofertaValor ?? p.porcentajeOferta
        ? String(p.ofertaValor ?? p.porcentajeOferta)
        : ""
    );
    setCampoMensaje(p.mensajeOferta ?? "");
    setCampoOfertaActiva(Boolean(p.oferta));
    setModalOfertaVisible(true);
  };

  const cerrarModal = () => {
    setModalOfertaVisible(false);
    setProductoEditando(null);
    setCampoPrecioOferta("");
    setCampoPorcentaje("");
    setCampoMensaje("");
    setCampoOfertaActiva(true);
  };

  const guardarOfertaFirestore = async () => {
    if (!productoEditando) return;

    let precioOfertaNum = campoPrecioOferta ? Number(campoPrecioOferta) : null;
    let porcentajeNum = campoPorcentaje ? Number(campoPorcentaje) : null;

    if (campoPrecioOferta && (isNaN(precioOfertaNum) || precioOfertaNum < 0)) {
      return Swal.fire("Precio inválido", "Introduce un precio válido.", "warning");
    }

    if (
      campoPorcentaje &&
      (isNaN(porcentajeNum) || porcentajeNum < 0 || porcentajeNum > 100)
    ) {
      return Swal.fire("Porcentaje inválido", "Debe estar entre 0 y 100.", "warning");
    }

    const precioOriginal = Number(
      productoEditando.precio ?? productoEditando.price ?? 0
    );

    if (!campoPrecioOferta && porcentajeNum != null) {
      precioOfertaNum = Math.round(
        precioOriginal - (precioOriginal * porcentajeNum) / 100
      );
    }

    const updates = {
      oferta: campoOfertaActiva,
      fechaActualizacion: serverTimestamp(),
    };

    if (precioOfertaNum != null) updates.precioOferta = precioOfertaNum;
    if (porcentajeNum != null) updates.ofertaValor = porcentajeNum;
    if (campoMensaje !== undefined) updates.mensajeOferta = campoMensaje;

    try {
      await updateDoc(doc(db, "inventario", productoEditando.id), updates);
      Swal.fire("Éxito", "Oferta actualizada correctamente.", "success");
      cerrarModal();
    } catch (err) {
      console.error("Error guardando oferta:", err);
      Swal.fire("Error", "No se pudo guardar la oferta.", "error");
    }
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
              const precioRaw = Number(p.precio ?? p.price ?? 0);

              let precioFinal;
              let porcentaje;
              if (p.precioOferta != null && p.precioOferta !== "") {
                precioFinal = Number(p.precioOferta);
                porcentaje =
                  precioRaw > 0
                    ? Math.round((1 - precioFinal / precioRaw) * 100)
                    : p.ofertaValor ?? p.porcentajeOferta ?? 0;
              } else if (p.ofertaValor != null || p.porcentajeOferta != null) {
                porcentaje = p.ofertaValor ?? p.porcentajeOferta ?? 0;
                precioFinal = Math.max(
                  0,
                  Math.round(precioRaw - (precioRaw * porcentaje) / 100)
                );
              } else {
                porcentaje = 0;
                precioFinal = precioRaw;
              }

              const imagen = p.imagenUrl ?? p.imagen ?? "";
              const nombre = p.nombre ?? p.title ?? "Producto";

              return (
                <article key={p.id} className="product-card">
                  <div className="card-media">
                    {/* 🔥 LAZY LOADING APLICADO AQUÍ */}
                    <img
                      src={imagen || ""}
                      alt={nombre}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = userPhoto)}
                    />
                    <div className="badge-left">Oferta</div>
                    <div className="badge-right">-{porcentaje}%</div>
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{nombre}</h3>
                    <p className="card-sub">{p.descripcion || ""}</p>

                    <div className="price-row">
                      <div className="price-block">
                        <div className="current">
                          {formatCurrency(precioFinal)}
                        </div>
                        <div className="old">{formatCurrency(precioRaw)}</div>
                      </div>
                      <div className="meta">
                        <small>Stock: {p.cantidad ?? p.stock ?? 0}</small>
                      </div>
                    </div>

                    {p.mensajeOferta && (
                      <div className="offer-message">
                        <textarea
                          readOnly
                          value={`${p.mensajeOferta} (${porcentaje}% OFF)`}
                          onFocus={(e) => e.target.select()}
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button
                            className="btn-small"
                            onClick={() => copiarMensajeOferta(p)}
                          >
                            Copiar mensaje
                          </button>
                          <button
                            className="btn-small btn-outline"
                            onClick={() =>
                              Swal.fire({
                                title: "Mensaje de oferta",
                                html: `<pre style="text-align:left">${
                                  (p.mensajeOferta ?? "") +
                                  ` (${porcentaje}% OFF)`
                                }</pre>`,
                                icon: "info",
                              })
                            }
                          >
                            Ver
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="btn-add" onClick={() => addToCart(p)}>
                        Añadir al Carrito
                      </button>
                      <button
                        className="btn-primary-outline"
                        onClick={() => buyNow(p)}
                      >
                        Comprar ahora
                      </button>
                    </div>
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
