import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { db } from "../../firebaseConfig"; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import "./Carrito.css";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [inventario, setInventario] = useState({}); // { id: stockActual }
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  // Cargar inventario real desde Firestore y validar carrito
  useEffect(() => {
    const cargarInventarioYValidar = async () => {
      try {
        const snapshot = await getDocs(collection(db, "inventario"));
        const mapaInventario = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const stock = data.cantidad ?? data.stock ?? 0;
          mapaInventario[doc.id] = stock;
        });

        setInventario(mapaInventario);

        // Validar carrito contra stock real
        const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
        let carritoActualizado = [...carritoActual];
        let huboCambios = false;

        carritoActualizado = carritoActualizado.filter((item) => {
          const stockDisponible = mapaInventario[item.id] ?? 0;
          if (stockDisponible <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Producto agotado",
              text: `${item.nombre} ya no tiene stock y fue removido del carrito.`,
              timer: 3000,
              toast: true,
              position: "top-end",
              background: "#1e1e1e",
              color: "#fff",
            });
            huboCambios = true;
            return false;
          }
          // Ajustar cantidad si excede el stock
          if (item.cantidad > stockDisponible) {
            Swal.fire({
              icon: "info",
              title: "Stock ajustado",
              text: `Solo hay ${stockDisponible} unidad(es) de ${item.nombre}. Se ajustó la cantidad.`,
              timer: 3500,
              toast: true,
              position: "top-end",
              background: "#1e1e1e",
              color: "#fff",
            });
            item.cantidad = stockDisponible;
            huboCambios = true;
          }
          return true;
        });

        if (huboCambios) {
          localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
          setCarrito(carritoActualizado);
        }
      } catch (error) {
        console.error("Error cargando inventario:", error);
        Swal.fire("Error", "No se pudo verificar el stock. Intenta más tarde.", "error");
      } finally {
        setCargando(false);
      }
    };

    cargarInventarioYValidar();
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    actualizarCarrito(nuevoCarrito);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Producto eliminado",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const cambiarCantidad = (id, cambio) => {
    const stockDisponible = inventario[id] ?? 0;

    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + cambio;

        // No permitir bajar de 1
        if (nuevaCantidad < 1) return item;

        // No permitir superar el stock disponible
        if (nuevaCantidad > stockDisponible) {
          Swal.fire({
            icon: "warning",
            title: "Stock insuficiente",
            text: `Solo hay ${stockDisponible} unidad(es) disponible(s) de ${item.nombre}.`,
            background: "#1e1e1e",
            color: "#fff",
            confirmButtonColor: "#f97316",
          });
          return item; // No cambia
        }

        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });

    actualizarCarrito(nuevoCarrito);
  };

  const vaciarCarrito = () => {
    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
      background: "#1e1e1e",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("carrito");
        setCarrito([]);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Carrito vaciado",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  if (cargando) {
    return (
      <div className="carrito-container">
        <p>Cargando carrito y verificando stock...</p>
      </div>
    );
  }

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