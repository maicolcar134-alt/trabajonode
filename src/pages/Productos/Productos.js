import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importa useNavigate
import "./Productos.css";

export default function Productos() {
  const navigate = useNavigate(); // ✅ Inicializa useNavigate

  
const [productos, setProductos] = useState([
 // --- TORTAS ---
{ id: 1, nombre: "Torta 16 tiros Tsunami", precio: 750000, stock: 36, imagen: "/imagenes/torta_tsunami.jpg" },
{ id: 2, nombre: "Torta 16 tiros Ciclón", precio: 750000, stock: 36, imagen: "/imagenes/torta_ciclon.jpg" },
{ id: 3, nombre: "Torta 16 tiros Tornado", precio: 750000, stock: 36, imagen: "/imagenes/torta_tornado.jpg" },
{ id: 4, nombre: "Torta 15 tiros Fin del Mundo", precio: 820000, stock: 16, imagen: "/imagenes/torta_fin_del_mundo.jpg" },
{ id: 5, nombre: "Torta 15 tiros Tormenta de Plata", precio: 820000, stock: 16, imagen: "/imagenes/torta_tormenta_de_plata.jpg" },
{ id: 6, nombre: "Torta 19 tiros Cazador de la Noche", precio: 680000, stock: 24, imagen: "/imagenes/torta_cazador_de_la_noche.jpg" },
{ id: 7, nombre: "Torta 19 tiros Coyote", precio: 680000, stock: 24, imagen: "/imagenes/torta_coyote.jpg" },
{ id: 8, nombre: "Torta 19 tiros La Traviesa", precio: 680000, stock: 24, imagen: "/imagenes/torta_la_traviesa.jpg" },
{ id: 9, nombre: "Torta 19 tiros Cuarentena", precio: 570000, stock: 12, imagen: "/imagenes/torta_cuarentena.jpg" },
{ id: 10, nombre: "Torta 19 tiros La Purga", precio: 570000, stock: 12, imagen: "/imagenes/torta_la_purga.jpg" },
{ id: 11, nombre: "Torta 25 tiros Dios Egipcio", precio: 800000, stock: 24, imagen: "/imagenes/torta_dios_egipcio.jpg" },
{ id: 12, nombre: "Torta 25 tiros Poderoso Ra", precio: 860000, stock: 24, imagen: "/imagenes/torta_poderoso_ra.jpg" },
{ id: 13, nombre: "Torta 25 tiros Abanico Sirena", precio: 830000, stock: 12, imagen: "/imagenes/torta_sirena.jpg" },
{ id: 14, nombre: "Torta 25 tiros Reina Egipcia", precio: 860000, stock: 24, imagen: "/imagenes/torta_reina_egipcia.jpg" },
{ id: 15, nombre: "Torta 25 tiros Abanico Dulce Sorpresa", precio: 880000, stock: 8, imagen: "/imagenes/torta_dulce_sorpresa.jpg" },
{ id: 16, nombre: "Torta 30 tiros Cinturón de Fuego", precio: 680000, stock: 12, imagen: "/imagenes/torta_cinturon_de_fuego.jpg" },
{ id: 17, nombre: "Torta 36 tiros Isla Misteriosa", precio: 700000, stock: 12, imagen: "/imagenes/torta_isla_misteriosa.jpg" },
{ id: 18, nombre: "Torta 36 tiros Abanico Megalodon", precio: 680000, stock: 12, imagen: "/imagenes/torta_megalodon.jpg" },
{ id: 19, nombre: "Torta 36 tiros Paraíso Fantástico", precio: 680000, stock: 12, imagen: "/imagenes/torta_paraiso_fantastico.jpg" },
{ id: 20, nombre: "Torta 42 tiros La Tremenda", precio: 640000, stock: 16, imagen: "/imagenes/torta_la_tremenda.jpg" },
{ id: 21, nombre: "Torta 48 tiros Perlitas del Mar", precio: 500000, stock: 80, imagen: "/imagenes/torta_perlitas_del_mar.jpg" },
{ id: 22, nombre: "Torta 49 tiros Gladiador", precio: 650000, stock: 8, imagen: "/imagenes/torta_gladiador.jpg" },
{ id: 23, nombre: "Torta 49 tiros Spartacus", precio: 650000, stock: 8, imagen: "/imagenes/torta_spartacus.jpg" },
{ id: 24, nombre: "Torta 49 tiros Abanico Kraken", precio: 670000, stock: 8, imagen: "/imagenes/torta_kraken.jpg" },
{ id: 25, nombre: "Torta 100 tiros Tanque de Guerra", precio: 700000, stock: 4, imagen: "/imagenes/torta_tanque_de_guerra.jpg" },
{ id: 26, nombre: "Torta 100 tiros Warzone", precio: 700000, stock: 4, imagen: "/imagenes/torta_warzone.jpg" },
{ id: 27, nombre: "Torta 100 tiros Combate Aéreo", precio: 720000, stock: 4, imagen: "/imagenes/torta_combate_aereo.jpg" },
{ id: 28, nombre: "Torta 100 tiros Apache", precio: 720000, stock: 4, imagen: "/imagenes/torta_apache.jpg" },
{ id: 29, nombre: "Torta 200 tiros Explosión Lunar", precio: 720000, stock: 2, imagen: "/imagenes/torta_explosion_lunar.jpg" },
{ id: 30, nombre: "Torta 200 tiros Cometa Halley", precio: 720000, stock: 2, imagen: "/imagenes/torta_cometa_halley.jpg" },

// --- JUGUETERÍA ---
{ id: 31, nombre: "Vela Pirocracker 10 tiros", precio: 650000, stock: 24, imagen: "/imagenes/vela_pirocracker_10.jpg" },
{ id: 32, nombre: "Vela Pirocracker 15 tiros", precio: 720000, stock: 24, imagen: "/imagenes/vela_pirocracker_15.jpg" },
{ id: 33, nombre: "Vela Pirocracker 30 tiros", precio: 750000, stock: 30, imagen: "/imagenes/vela_pirocracker_30.jpg" },
{ id: 34, nombre: "Bazuca Fest", precio: 780000, stock: 12, imagen: "/imagenes/bazuca_fest.jpg" },
{ id: 35, nombre: "Barril Cracker Fuente Pájaro Loco", precio: 550000, stock: 40, imagen: "/imagenes/barril_pajaro_loco.jpg" },
{ id: 36, nombre: "Volcán 7\"", precio: 690000, stock: 8, imagen: "/imagenes/volcan_7.jpg" },
{ id: 37, nombre: "Fuente Triangular El Anillo", precio: 600000, stock: 100, imagen: "/imagenes/fuente_el_anillo.jpg" },
{ id: 38, nombre: "Match Cracker Metralleta", precio: 500000, stock: 24, imagen: "/imagenes/match_cracker_metralleta.jpg" },
{ id: 39, nombre: "Misil 100 tiros", precio: 650000, stock: 20, imagen: "/imagenes/misil_100_tiros.jpg" },
{ id: 40, nombre: "Volcancito de Colombia", precio: 1400000, stock: 200, imagen: "/imagenes/volcancito_colombia.jpg" },

// --- ESCENARIO Y PROFESIONAL ---
{ id: 41, nombre: "Candela Cometa Verde", precio: 800000, stock: 24, imagen: "/imagenes/candela_cometa_verde.jpg" },
{ id: 42, nombre: "Candela Cometa Roja", precio: 800000, stock: 24, imagen: "/imagenes/candela_cometa_roja.jpg" },
{ id: 43, nombre: "Fuente Indoor Plata 3mts x 30s", precio: 1350000, stock: 20, imagen: "/imagenes/fuente_indoor_3mts.jpg" },
{ id: 44, nombre: "Carcasa 2.5\"", precio: 1600000, stock: 96, imagen: "/imagenes/carcasa_25.jpg" },
{ id: 45, nombre: "Carcasa 6\"", precio: 700000, stock: 9, imagen: "/imagenes/carcasa_6.jpg" },
{ id: 46, nombre: "Carcasa 8\"", precio: 850000, stock: 9, imagen: "/imagenes/carcasa_8.jpg" },
]);

  const [carrito, setCarrito] = useState([]);

  const [descuento, setDescuento] = useState(0);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (idProducto) => {
    setCarrito(carrito.filter((item) => item.id !== idProducto));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const actualizarCantidad = (idProducto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(idProducto);
    } else {
      setCarrito(
        carrito.map((item) =>
          item.id === idProducto ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    }
  };

  const calcularSubtotal = () =>
    carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const calcularIVA = (subtotal) => subtotal * 0.19;
  const calcularEnvio = (subtotal) => (subtotal > 100000 ? 0 : 15000);
  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const iva = calcularIVA(subtotal);
    const envio = calcularEnvio(subtotal);
    const totalDescuento = subtotal * descuento;
    return subtotal + iva + envio - totalDescuento;
  };



  const finalizarCompra = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío 🛒");
      return;
    }
    alert("Compra finalizada con éxito 🎉");
    vaciarCarrito();
  };

  return (
    <div className="carrito-container">
      {/* 🔙 Botón Volver a inicio */}
      <button 
        className="btn-volver-admin"
        onClick={() => navigate("/Dashboard")} // Cambia "/admin" a tu ruta real del admin
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
          marginBottom: "20px"
        }}
      >
        ⬅️ Volver al Inicio

      </button>

      <h1>🛍️ Carrito de Compras</h1>

      <h2>Productos disponibles</h2>
      <div className="productos">
        {productos.map((p) => (
          <div key={p.id} className="producto-card">
            <img
              src={p.imagen}
              alt={p.nombre}
              style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
            />
            <h3>{p.nombre}</h3>
            <p>Precio: ${p.precio.toLocaleString()}</p>
            <p>Stock: {p.stock}</p>
            <button onClick={() => agregarAlCarrito(p)}>Agregar al carrito</button>
          </div>
        ))}
      </div>

      <hr />

      <h2>🛒 Tu carrito</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <table className="tabla-carrito">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                  />
                </td>
                <td>{item.nombre}</td>
                <td>${item.precio.toLocaleString()}</td>
                <td>
                  <input
                    type="number"
                    value={item.cantidad}
                    min="1"
                    onChange={(e) =>
                      actualizarCantidad(item.id, parseInt(e.target.value))
                    }
                  />
                </td>
                <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="resumen">
        <h3>Resumen de compra</h3>
        <p>Subtotal: ${calcularSubtotal().toLocaleString()}</p>
        <p>IVA (19%): ${calcularIVA(calcularSubtotal()).toLocaleString()}</p>
        <p>Envío: ${calcularEnvio(calcularSubtotal()).toLocaleString()}</p>
        
        <h2>Total: ${calcularTotal().toLocaleString()}</h2>

        <div className="botones-finales">
          <button onClick={vaciarCarrito} className="btn-vaciar">
            Vaciar carrito
          </button>
          <button onClick={finalizarCompra} className="btn-comprar">
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
