import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import "./Carrito.css";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    actualizarCarrito(nuevoCarrito);
  };

  const cambiarCantidad = (id, cantidad) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id) {
        const nuevaCantidad = Math.max(1, item.cantidad + cantidad);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });
    actualizarCarrito(nuevoCarrito);
  };

  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setCarrito([]);
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="carrito-container">
      <button onClick={() => navigate(-1)} className="btn-volver">
        <FaArrowLeft /> Volver
      </button>

      <h1>🛒 Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío 😢</p>
      ) : (
        <>
          <table className="carrito-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cant</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>${item.precio.toLocaleString()}</td>

                  {/* Controles de cantidad */}
                  <td>
                    <button
                      className="btn-cantidad"
                      onClick={() => cambiarCantidad(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="cantidad-num">{item.cantidad}</span>
                    <button
                      className="btn-cantidad"
                      onClick={() => cambiarCantidad(item.id, 1)}
                    >
                      +
                    </button>
                  </td>

                  <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarProducto(item.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="carrito-footer">
            <h2>Total a pagar: ${total.toLocaleString()}</h2>
            <button className="btn-vaciar" onClick={vaciarCarrito}>
              Vaciar carrito
            </button>
            <button className="btn-pagar" onClick={() => navigate("/checkout")}>
              Pagar ✅
            </button>
          </div>
        </>
      )}
    </div>
  );
}
