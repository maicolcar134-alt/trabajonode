import React, { useState, useEffect } from "react";
import "./CategoriasAdmin.css";
import "bootstrap/dist/css/bootstrap.min.css";
/*
📘 Catálogo completo extraído del PDF:
Incluye categorías: Tortas, Juguetería, Pirotecnia de Escenario y Uso Profesional.
Asegúrate de tener las imágenes en: public/imagenes/
Ejemplo: public/imagenes/torta_tsunami.jpg
*/

export default function CategoriasAdmin() {
  const categoriasData = [
    {
         nombre: "Tortas",
      descripcion: "Tortas pirotécnicas de múltiples disparos con efectos visuales.",
      productos: [
        { id: 1, nombre: "Torta 16 tiros Tsunami", precio: 50000, stock: 36, imagen: "" },
        { id: 2, nombre: "Torta 16 tiros Ciclón", precio: 50000, stock: 36 },
        { id: 3, nombre: "Torta 16 tiros Tornado", precio: 50000, stock: 36 },
        { id: 4, nombre: "Torta 15 tiros Fin del Mundo", precio: 82000, stock: 16 },
        { id: 5, nombre: "Torta 15 tiros Tormenta de Plata", precio: 82000, stock: 16 },
        { id: 6, nombre: "Torta 19 tiros Cazador de la Noche", precio: 750000, stock: 24 },
        { id: 7, nombre: "Torta 19 tiros Coyote", precio: 75000, stock: 24 },
        { id: 8, nombre: "Torta 19 tiros La Traviesa", precio: 75000, stock: 24 },
        { id: 9, nombre: "Torta 19 tiros Cuarentena", precio: 75000, stock: 12 },
        { id: 10, nombre: "Torta 19 tiros La Purga", precio: 75000, stock: 12 },
      ],
    },
    {
      nombre: "Juguetería",
      descripcion: "Pirotecnia recreativa: bengalas, misiles, volcancitos y más.",
      productos: [
        { id: 11, nombre: "Vela Pirocracker 10 tiros", precio: 65000, stock: 24 },
        { id: 12, nombre: "Bazuca Fest", precio: 170000, stock: 12 },
        { id: 13, nombre: "Volcán 7\"", precio: 25000, stock: 8 },
        { id: 14, nombre: "Volcancito de Colombia", precio: 10000, stock: 20 },
      ],
    },
    {
      nombre: "Pirotecnia de Escenario",
      descripcion: "Efectos visuales para eventos, shows y presentaciones.",
      productos: [
        { id: 15, nombre: "Candela Cometa Verde", precio: 80000, stock: 24 },
        { id: 16, nombre: "Candela Cometa Roja", precio: 80000, stock: 24 },
        { id: 17, nombre: "Fuente Indoor Plata 3mts x 30s", precio: 135000, stock: 20 },
      ],
    },
    {
      nombre: "Uso Profesional",
      descripcion: "Carcasas y fuentes de alto impacto para expertos certificados.",
      productos: [
        { id: 18, nombre: "Carcasa 2.5\"", precio: 55000, stock: 96 },
        { id: 19, nombre: "Carcasa 3\"", precio: 70000, stock: 9 },
        {id: 20, nombre: "Carcasa 4\"", precio: 90000, stock: 9 },
        {id: 21, nombre: "Carcasa 5\"", precio: 120000, stock: 9 },
        {id: 22, nombre: "Carcasa 6\"", precio: 150000, stock: 9 } , 

  
      ],
    },
  ];

  // 🛒 Estado del carrito
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(guardado);
  }, []);

  // Guardar carrito
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // --- Funciones carrito ---
  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((p) => p.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) => setCarrito(carrito.filter((p) => p.id !== id));

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) eliminarDelCarrito(id);
    else setCarrito(carrito.map((p) => (p.id === id ? { ...p, cantidad } : p)));
  };

  const calcularSubtotal = () => carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const calcularIVA = (subtotal) => subtotal * 0.19;
  const calcularEnvio = (subtotal) => (subtotal > 100000 ? 0 : 15000);
  const calcularTotal = () => {
    const sub = calcularSubtotal();
    return sub + calcularIVA(sub) + calcularEnvio(sub);
  };

  const vaciarCarrito = () => setCarrito([]);
  const finalizarCompra = () => {
    if (!carrito.length) return alert("Tu carrito está vacío 🛒");
    alert("✅ Compra finalizada con éxito");
    vaciarCarrito();
  };

  return (
    <div className="categorias-container">
      <h1>Catálogo de Productos</h1>
      <p className="subtitulo">Explora todas las categorías de nuestro catálogo oficial</p>

      {categoriasData.map((cat, i) => (
        <section key={i} className="seccion-categoria">
          <div className="seccion-header">
            <h2>{cat.nombre}</h2>
            <p className="categoria-desc">{cat.descripcion}</p>
          </div>

          <div className="productos-grid">
            {cat.productos.map((p) => (
              <div key={p.id} className="producto-card">
                <img src={p.imagen} alt={p.nombre} onError={(e) => (e.target.src = "/imagenes/placeholder.jpg")} />
                <div className="producto-body">
                  <h3>{p.nombre}</h3>
                  <p className="precio">Precio: ${p.precio.toLocaleString()}</p>
                  <p className="stock">Stock: {p.stock}</p>
                  <p className="producto-id">ID: {p.id}</p>

            
                  <button className="btn-agregar" onClick={() => agregarAlCarrito(p)}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* 🧾 Resumen del carrito */}
      <div className="carrito-resumen">
        <h2>🛒 Resumen del Carrito</h2>
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <>
            <table className="tabla-resumen">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(item.id, parseInt(e.target.value || "0"))
                        }
                      />
                    </td>
                    <td>${item.precio.toLocaleString()}</td>
                    <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                    <td>
                      <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)}>
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totales">
              <p>Subtotal: ${calcularSubtotal().toLocaleString()}</p>
              <p>IVA (19%): ${calcularIVA(calcularSubtotal()).toLocaleString()}</p>
              <p>Envío:(20.000)${calcularEnvio(calcularSubtotal()).toLocaleString()}</p>

              <h3>Total: ${calcularTotal().toLocaleString()}</h3>
            </div>

            <div className="acciones-carrito">
              <button className="btn-vaciar" onClick={vaciarCarrito}>Vaciar</button>
              <button className="btn-comprar" onClick={finalizarCompra}>Finalizar Compra</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
