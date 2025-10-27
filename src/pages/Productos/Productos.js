import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importa useNavigate
import "./Productos.css";

export default function Productos() {
  const navigate = useNavigate(); // ✅ Inicializa useNavigate

  

 
  const [carrito, setCarrito] = useState([]); 
     

  const descuento = 0.05; // 5% de descuento POR mayoria
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
        <p>Descuento (5%): -${(calcularSubtotal() * descuento).toLocaleString()}</p>
        
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
