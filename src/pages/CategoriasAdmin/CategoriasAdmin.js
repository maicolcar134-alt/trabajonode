// src/components/CategoriasAdmin.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { buscarConNormalizacion } from "../../utils/normalizarBusqueda";
import "./CategoriasAdmin.css";

import { useNavigate } from "react-router-dom";




export default function CategoriasAdmin() {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [user, setUser] = useState({
    nombre: "Invitado",
    email: "invitado@correo.com",
  });
  const [carrito, setCarrito] = useState([]);

  const navigate = useNavigate();

  // 🔹 Cargar productos desde INVENTARIO
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inventario"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(data);
    });
    return () => unsub();
  }, []);

  // 🔹 Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  // 🛒 Agregar al carrito
  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);

    let nuevoCarrito;
    if (existe) {
      nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    actualizarCarrito(nuevoCarrito);

    const notificacion = document.createElement("div");
    notificacion.className = "toast-notificacion";
    notificacion.innerText = `🛒 ${producto.nombre} agregado al carrito`;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 2500);
  };

  // 🔥 Crear lista dinámica de categorías
  const categorias = [...new Set(productos.map((p) => p.categoria))].filter(
    Boolean
  );

  // 🔥 Filtro general
  const productosFiltrados = productos.filter(
    (p) =>
      (!filtroCategoria || p.categoria === filtroCategoria) &&
      (!filtroBusqueda || buscarConNormalizacion(p.nombre || "", filtroBusqueda))
  );

  // 🔥 Ordenar productos por categoría
  const productosPorCategoria = categorias.map((cat) => ({
    nombre: cat,
    productos: productosFiltrados.filter((p) => p.categoria === cat),
  }));

  const handleLogout = () => {
    setUser(null);
    alert("Sesión cerrada correctamente.");
  };

  return (
    <div className="catalogo-root">



      {/* 🎇 CATÁLOGO */}
      <div className="catalogo-contenedor">
        <h1 className="titulo-catalogo">🎆 Catálogo de Productos</h1>

        <div className="filtros">
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
            className="input-busqueda"
          />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="select-categoria"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {productosPorCategoria.map(
          (cat) =>
            cat.productos.length > 0 && (
              <section key={cat.nombre} className="seccion-categoria">
                <h2 className="categoria-titulo">{cat.nombre}</h2>

                <div className="productos-grid">
                  {cat.productos.map((p) => (
                    <div key={p.id} className="producto-card">
                      <div className="producto-imagen-wrapper">
                        {p.imagenUrl ? (
                          <img
                            src={p.imagenUrl}
                            alt={p.nombre}
                            className="producto-imagen"
                          />
                        ) : (
                          <div className="no-imagen">Sin imagen</div>
                        )}
                      </div>

                      <div className="producto-info">
                        <h3>{p.nombre}</h3>

                        <p className="precio">
                          💰 ${Number(p.precio)?.toLocaleString()}
                        </p>

                        {p.oferta && (
                          <p className="oferta-tag">🔥 Producto en oferta</p>
                        )}

                        {p.destacado && (
                          <p className="destacado-tag">⭐ Destacado</p>
                        )}

                        <button
                          onClick={() => agregarAlCarrito(p)}
                          className="btn-agregar"
                        >
                          🛒 Añadir al carrito
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
        )}
      </div>
    
    </div>
  );
}
