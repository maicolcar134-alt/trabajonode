import React from "react";
import { useCarrito } from "../context/CarritoContext";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import "./Carrito.css";

export default function Carrito() {
  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    actualizarCantidad,
    total,
  } = useCarrito();

  const navigate = useNavigate();

  return (
    <div className="carrito-container">
      <header className="carrito-header">
        <button className="btn-volver" onClick={() => navigate("/Categorias")}>
          <FaArrowLeft /> Volver al catálogo
        </button>
        <h1>🛒 Tu Carrito de Compras</h1>
        {carrito.length > 0 && (
          <button className="btn-vaciar" onClick={vaciarCarrito}>
            Vaciar carrito 🧹
          </button>
        )}
      </header>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está vacío 😢</p>
          <button onClick={() => navigate("/Categorias")} className="btn-ir-catalogo">
            Ir al catálogo
          </button>
        </div>
      ) : (
        <>
          <div className="carrito-lista">
            {carrito.map((item) => (
              <div key={item.id} className="carrito-item">
                <img
                  src={item.imagenUrl || "/placeholder.png"}
                  alt={item.nombre}
                  className="carrito-img"
                />
                <div className="carrito-info">
                  <h3>{item.nombre}</h3>
                  <p>💰 Precio: ${item.precio.toLocaleString()}</p>
                  <div className="cantidad-control">
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(item.id, parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="carrito-acciones">
                  <p>
                    <strong>
                      Total: ${(item.precio * item.cantidad).toLocaleString()}
                    </strong>
                  </p>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarProducto(item.id, item.nombre)}
                  >
                    <FaTrashAlt /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <footer className="carrito-footer">
            <h2>Total general: ${total.toLocaleString()}</h2>
            <button className="btn-pagar">Proceder al pago 💳</button>
          </footer>
        </>
      )}
    </div>
  );
}
