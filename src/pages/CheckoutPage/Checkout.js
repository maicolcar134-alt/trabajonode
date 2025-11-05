import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Checkout.css";
import nequiQR from "../image/nequi/WhatsApp Image 2025-10-30 at 8.06.06 PM.jpeg";
import bancolombiaQR from "../image/bancolombia/WhatsApp Image 2025-10-30 at 8.06.06 PM.jpeg";

import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Checkout() {
  const navigate = useNavigate();

  let carritoContext;
  try {
    carritoContext = require("../context/CarritoContext").useCarrito?.();
  } catch {
    carritoContext = null; 
  }

  const [carrito, setCarrito] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [metodoPago, setMetodoPago] = useState("nequi");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  const [mostrarQR, setMostrarQR] = useState(false);
  const [qrImg, setQrImg] = useState(null);
  const [mostrarPayPal, setMostrarPayPal] = useState(false);

  useEffect(() => {
    if (carritoContext && carritoContext.carrito) {
      setCarrito(carritoContext.carrito);
    } else {
      setCarrito(JSON.parse(localStorage.getItem("carrito")) || []);
    }
  }, [carritoContext]);

  const total = useMemo(
    () => carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    [carrito]
  );

  const generarId = () => {
    const t = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PED-${t}-${r}`;
  };

  const limpiarCarrito = () => {
    localStorage.removeItem("carrito");
    carritoContext?.vaciarCarrito?.();
    setCarrito([]);
  };

  const validar = () => {
    if (!nombre.trim() || !telefono.trim() || !direccion.trim()) {
      setError("Completa nombre, teléfono y dirección");
      return false;
    }
    if (carrito.length === 0) {
      setError("Tu carrito está vacío");
      return false;
    }
    setError("");
    return true;
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setProcesando(true);
    const id = generarId();

    const pedido = {
      id,
      cliente: { nombre, telefono, direccion, ciudad },
      items: carrito,
      total,
      metodoPago,
      // ✅ Nuevo campo: estado inicial de pago
      pago:
        metodoPago === "contraentrega" ? "Pendiente pago" : "Pendiente pago",
      // ✅ Guardar estado correcto
      estado:
        metodoPago === "contraentrega" ? "Pendiente entrega" : "Pendiente pago",
      // ✅ Campo correcto para la tabla Pedidos.jsx
      fecha: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "pedidos"), pedido);
      setOrderId(id);
      setProcesando(false);

      // ✅ Mostrar QR o redirigir según método de pago
      if (metodoPago === "nequi") {
        setQrImg(nequiQR);
        setMostrarQR(true);
      } else if (metodoPago === "bancolombia") {
        setQrImg(bancolombiaQR);
        setMostrarQR(true);
      } else if (metodoPago === "paypal") {
        setMostrarPayPal(true);
      } else {
        limpiarCarrito();
        navigate("/gracias", { state: { orderId: id } });
      }
    } catch (err) {
      console.error("Error procesando pedido:", err);
      setError("Error procesando el pedido");
      setProcesando(false);
    }
  };

  const confirmarPagoQR = () => {
    limpiarCarrito();
    setMostrarQR(false);
    navigate("/gracias", { state: { orderId } });
  };

  return (
    <div className="checkout-root">
      <div className="checkout-card">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Seguir comprando
        </button>

        <h1>Finalizar Compra</h1>

        <div className="grid-checkout">
          <form className="checkout-form" onSubmit={handlePagar}>
            <h3>Datos de envío</h3>

            <label>
              Nombre completo *
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>

            <label>
              Teléfono *
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </label>

            <label>
              Dirección *
              <input
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </label>

            <label>
              Ciudad
              <input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              />
            </label>

            <h3>Método de pago</h3>

            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="nequi">Nequi QR</option>
              <option value="bancolombia">Bancolombia QR</option>
              <option value="paypal">PayPal</option>
              <option value="contraentrega">Pago Contra Entrega</option>
            </select>

            {error && <p className="checkout-error">{error}</p>}

            <button type="submit" className="btn-confirm" disabled={procesando}>
              {procesando
                ? "Procesando..."
                : `Pagar $${total.toLocaleString()} ✅`}
            </button>
          </form>

          {/* 🧾 Resumen del carrito */}
          <aside className="checkout-summary">
            <h3>Resumen</h3>
            {carrito.map((p) => (
              <div className="summary-item" key={p.id}>
                <div className="summary-left">
                  <img src={p.imagenUrl || "/noimage.jpg"} alt="" />
                  <div>
                    <b>{p.nombre}</b>
                    <small>
                      {p.cantidad} × ${p.precio.toLocaleString()}
                    </small>
                  </div>
                </div>
                <b>${(p.precio * p.cantidad).toLocaleString()}</b>
              </div>
            ))}
            <hr />
            <h2>Total: ${total.toLocaleString()}</h2>
          </aside>
        </div>
      </div>

      {/* 🟣 Modal QR */}
      {mostrarQR && (
        <div className="qr-modal">
          <div className="qr-card">
            <h3>Escanea para pagar — {orderId}</h3>
            <img
              src={qrImg}
              alt="QR"
              style={{ width: "230px", borderRadius: 10 }}
            />

            <p>
              Monto: <b>${total.toLocaleString()}</b>
            </p>

            <button className="btn-primary" onClick={confirmarPagoQR}>
              ✅ Ya pagué
            </button>
            <button
              className="btn-secondary"
              onClick={() => setMostrarQR(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* 💰 Modal PayPal simulado */}
      {mostrarPayPal && (
        <div className="qr-modal">
          <div className="qr-card">
            <h3>PayPal</h3>
            <p>(Aquí irá el botón oficial PayPal)</p>

            <button
              className="btn-primary"
              onClick={() => {
                limpiarCarrito();
                navigate("/gracias", { state: { orderId } });
              }}
            >
              ✅ Simular pago completado
            </button>

            <button
              className="btn-secondary"
              onClick={() => setMostrarPayPal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
