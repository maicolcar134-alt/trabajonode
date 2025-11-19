// src/components/CategoriasAdmin.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./CategoriasAdmin.css";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/Explosión de color y energía.png";
import userPhoto from "../../assets/Explosión de color y energía.png";

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
      (!filtroBusqueda ||
        p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
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
    <>
      {/* 🌑 NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            className="brand-logo d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="logo" height="45" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto align-items-center">
              <Nav.Link onClick={() => navigate("/dashboard")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/categorias")}>
                Categorías
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>
                Ofertas
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/seguridad")}>
                Seguridad
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>
            </Nav>

            <Nav className="align-items-center gap-3">
              {user ? (
                <Nav.Item
                  className="logout-container"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <Nav.Link className="logout-link d-flex align-items-center gap-2">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img
                      src={userPhoto}
                      alt="user"
                      className="user-photo-nav"
                    />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link onClick={() => navigate("/login")}>
                  <FaUser size={18} className="me-2" />
                  Iniciar Sesión
                </Nav.Link>
              )}

              {/* 🛒 CARRITO */}
              <Nav.Link
                onClick={() => navigate("/carrito")}
                className="position-relative"
              >
                <FaShoppingCart size={20} />
                {carrito.length > 0 && (
                  <Badge bg="warning" text="dark" pill className="cart-badge">
                    {carrito.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
    </>
  );
}
