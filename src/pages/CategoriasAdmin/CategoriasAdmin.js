import React, { useEffect, useState,  } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import "./CategoriasAdmin.css";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/Explosión de color y energía.png";

export default function CategoriasAdmin() {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [user, setUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState("");
  const [carrito, setCarrito] = useState([]);

  const navigate = useNavigate();

  // 🔹 Cargar productos desde Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snap) => {
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

  // 🔹 Actualizar el contador de carrito cuando se agrega algo nuevo
  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const categorias = [...new Set(productos.map((p) => p.categoria))].filter(Boolean);

  const productosFiltrados = productos.filter(
    (p) =>
      (!filtroCategoria || p.categoria === filtroCategoria) &&
      (!filtroBusqueda ||
        p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  const productosPorCategoria = categorias.map((cat) => ({
    nombre: cat,
    productos: productosFiltrados.filter((p) => p.categoria === cat),
  }));

  // 🛒 Agregar producto al carrito
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

    // 🔔 Notificación visual elegante
    const notificacion = document.createElement("div");
    notificacion.className = "toast-notificacion";
    notificacion.innerText = `🛒 ${producto.nombre} agregado al carrito`;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 2500);
  };

  const handleLogout = () => {
    setUser(null);
    alert("Sesión cerrada correctamente.");
  };

  return (
    <div className="catalogo-root">
      {/* 🔹 NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            className="brand-logo"
          >
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => navigate("/Dashboard")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/Categorias")}>
                Categorías
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>
                Ofertas
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/Seguridad")}>
                Seguridad
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>

              <Nav.Link
                onClick={() => navigate("/Admin")}
                className="text-warning"
              >
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>

              {user ? (
                <Nav.Item onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img
                      src={userPhoto}
                      alt="Foto de usuario"
                      className="user-photo-nav"
                    />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link
                  onClick={() => navigate("/login")}
                  className="d-flex align-items-center gap-2 fw-bold text-light"
                >
                  <FaUser /> Acceder
                </Nav.Link>
              )}

              {/* 🛒 Carrito con contador */}
              <Nav.Link
                onClick={() => navigate("/Carrito")}
                className="position-relative text-light"
              >
                <FaShoppingCart size={22} />
                {carrito.length > 0 && (
                  <Badge bg="warning" className="cart-badge">
                    {carrito.reduce((acc, p) => acc + p.cantidad, 0)}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔹 CATÁLOGO */}
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
                          <img src={p.imagenUrl} alt={p.nombre} />
                        ) : (
                          <div className="no-imagen">Sin imagen</div>
                        )}
                      </div>
                      <div className="producto-info">
                        <h3>{p.nombre}</h3>
                        <p className="precio">
                          💰 ${p.precio?.toLocaleString()}
                        </p>
                        <p className="stock">📦 Stock: {p.stock}</p>
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
