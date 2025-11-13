import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Checkout.css";
import nequiQR from "../../assets/WhatsApp Image 2025-10-30 at 8.06.06 PM.jpeg";


import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc as firestoreDoc,
} from "firebase/firestore";

export default function Checkout() {
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [metodoPago, setMetodoPago] = useState("nequi");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [pedidoDocId, setPedidoDocId] = useState(null);

  const [mostrarQR, setMostrarQR] = useState(false);
  const [qrImg, setQrImg] = useState(null);
  const [mostrarPayPal, setMostrarPayPal] = useState(false);
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);

  // Campos para pago con tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [expMes, setExpMes] = useState("");
  const [expAno, setExpAno] = useState("");
  const [cvc, setCvc] = useState("");
  const [errorTarjeta, setErrorTarjeta] = useState("");

  // 🔄 Cargar carrito automáticamente
  useEffect(() => {
    const storedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(storedCarrito);
  }, []);

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

  // --- Utilidades de tarjeta ---
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const luhnCheck = (num) => {
    const arr = num
      .split("")
      .reverse()
      .map((x) => parseInt(x, 10));
    const sum = arr.reduce((acc, d, i) => {
      if (i % 2 === 1) {
        let v = d * 2;
        if (v > 9) v -= 9;
        return acc + v;
      }
      return acc + d;
    }, 0);
    return sum % 10 === 0;
  };

  const detectCardBrand = (num) => {
    if (/^4/.test(num)) return "Visa";
    if (/^3[47]/.test(num)) return "American Express";
    if (/^(5[1-5]|2[2-7])/.test(num)) return "Mastercard";
    if (/^6(?:011|5)/.test(num)) return "Discover";
    return "Desconocida";
  };

  const handleCardChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setNumeroTarjeta(formatted);
    setErrorTarjeta("");
  };

  const validateCardFields = () => {
    const raw = numeroTarjeta.replace(/\s/g, "");
    if (raw.length < 13 || raw.length > 19 || !luhnCheck(raw)) {
      setErrorTarjeta("Número de tarjeta inválido.");
      return false;
    }
    if (!nombreTitular.trim()) {
      setErrorTarjeta("Ingresa el nombre del titular.");
      return false;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setErrorTarjeta("CVC inválido.");
      return false;
    }
    setErrorTarjeta("");
    return true;
  };

  // --- FLUJO DE PAGO PRINCIPAL ---
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
      pago: "Pendiente",
      estado: "Pendiente pago",
      fecha: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "pedidos"), pedido);
      setPedidoDocId(docRef.id);
      setOrderId(id);
      setProcesando(false);

      // Mostrar método según selección
      if (metodoPago === "nequi") {
        setQrImg(nequiQR);
        setMostrarQR(true);
      } else if (metodoPago === "bancolombia") {
        setMostrarTarjeta(true);
      } else if (metodoPago === "paypal") {
        setMostrarPayPal(true);
      } else {
        limpiarCarrito();
        navigate("/gracias", { state: { orderId: id } });
      }
    } catch (err) {
      console.error("Error al procesar pedido:", err);
      setError("Error procesando el pedido");
      setProcesando(false);
    }
  };

  // --- ACTUALIZAR AL CONFIRMAR PAGO ---
  const confirmarPagoQR = async () => {
    try {
      if (pedidoDocId) {
        await updateDoc(firestoreDoc(db, "pedidos", pedidoDocId), {
          pago: "Completado (QR)",
          estado: "Enviado",
          metodoPago,
          pagoConfirmadoEn: serverTimestamp(),
        });
      }
      limpiarCarrito();
      setMostrarQR(false);
      navigate("/gracias", { state: { orderId } });
    } catch (err) {
      console.error("Error al confirmar pago QR:", err);
    }
  };

  const confirmarPagoTarjeta = async () => {
    if (!validateCardFields()) return;
    const raw = numeroTarjeta.replace(/\s/g, "");
    const brand = detectCardBrand(raw);
    const last4 = raw.slice(-4);

    try {
      if (pedidoDocId) {
        await updateDoc(firestoreDoc(db, "pedidos", pedidoDocId), {
          pago: "Completado (Tarjeta)",
          estado: "Enviado",
          pagoConfirmadoEn: serverTimestamp(),
          pagoDetalles: { marca: brand, ultimos4: last4 },
        });
      }
      limpiarCarrito();
      setMostrarTarjeta(false);
      navigate("/gracias", { state: { orderId } });
    } catch (err) {
      console.error("Error confirmando pago tarjeta:", err);
      setErrorTarjeta("Error confirmando el pago.");
    }
  };

  const confirmarPagoPayPal = async () => {
    try {
      if (pedidoDocId) {
        await updateDoc(firestoreDoc(db, "pedidos", pedidoDocId), {
          pago: "Completado (PayPal)",
          estado: "Enviado",
          pagoConfirmadoEn: serverTimestamp(),
        });
      }
      limpiarCarrito();
      setMostrarPayPal(false);
      navigate("/gracias", { state: { orderId } });
    } catch (err) {
      console.error("Error confirmando pago PayPal:", err);
    }
  };

  // --- Render principal ---
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
              <option value="bancolombia">Bancolombia (tarjeta)</option>
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

          {/* Resumen */}
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

      {/* MODAL QR */}
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

      {/* MODAL TARJETA */}
      {mostrarTarjeta && (
        <div className="qr-modal">
          <div className="qr-card">
            <h3>Pagar con tarjeta Bancolombia</h3>
            <label>
              Nombre del titular
              <input
                value={nombreTitular}
                onChange={(e) => setNombreTitular(e.target.value)}
              />
            </label>
            <label>
              Número de tarjeta
              <input
                value={numeroTarjeta}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
              />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="MM"
                value={expMes}
                onChange={(e) => setExpMes(e.target.value)}
              />
              <input
                placeholder="YY"
                value={expAno}
                onChange={(e) => setExpAno(e.target.value)}
              />
              <input
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
            {errorTarjeta && <p className="checkout-error">{errorTarjeta}</p>}
            <button className="btn-primary" onClick={confirmarPagoTarjeta}>
              ✅ Confirmar pago
            </button>
            <button
              className="btn-secondary"
              onClick={() => setMostrarTarjeta(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL PAYPAL */}
      {mostrarPayPal && (
        <div className="qr-modal">
          <div className="qr-card">
            <h3>Pago con PayPal</h3>
            <p>(Simulación de pago con PayPal)</p>
            <button className="btn-primary" onClick={confirmarPagoPayPal}>
              ✅ Confirmar pago
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
