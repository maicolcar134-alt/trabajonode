import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CategoriasAdmin.css";
import logo from "../../assets/Explosión de color y energía.png"; 

export default function CategoriasAdmin({ user, handleLogout }) {
  const navigate = useNavigate();

  // 📦 Datos de categorías
  const categoriasData = [
    {
      nombre: "Tortas",
      descripcion: "Tortas de tiros variados con diferentes efectos y tamaños.",
      productos: [
        { id: 1, nombre: "Torta 16 tiros Tsunami", precio: 50000, stock: 36 },
        { id: 3, nombre: "Torta 16 tiros Tornado", precio: 50000, stock: 36 },
        { id: 4, nombre: "Torta 15 tiros Fin del Mundo", precio: 100000, stock: 16 },
        { id: 5, nombre: "Torta 15 tiros Tormenta de Plata", precio: 100000, stock: 16 },
        { id: 6, nombre: "Torta 19 tiros Cazador de la Noche", precio: 75000, stock: 24 },
        { id: 7, nombre: "Torta 19 tiros Coyote", precio: 75000, stock: 24 },
        { id: 8, nombre: "Torta 19 tiros La Traviesa", precio: 75000, stock: 24 },
        { id: 9, nombre: "Torta 19 tiros Cuarentena", precio: 75000, stock: 12 },
        { id: 10, nombre: "Torta 19 tiros La Purga", precio: 75000, stock: 12 },
        { id: 11, nombre: "Torta 25 tiros Dios Egipcio", precio: 95000, stock: 24 },
        { id: 12, nombre: "Torta 25 tiros Poderoso Ra", precio: 95000, stock: 24 },
        { id: 13, nombre: "Torta 25 tiros Abanico Sirena", precio: 95000, stock: 12 },
        { id: 14, nombre: "Torta 25 tiros Reina Egipcia", precio: 95000, stock: 24 },
        { id: 15, nombre: "Torta 25 tiros Abanico Dulce Sorpresa", precio: 95000, stock: 8 },
        { id: 16, nombre: "Torta 30 tiros Cinturón de Fuego", precio: 155000, stock: 12 },
        { id: 17, nombre: "Torta 36 tiros Isla Misteriosa", precio: 155000, stock: 12 },
        { id: 18, nombre: "Torta 36 tiros Abanico Megalodon", precio: 155000, stock: 12 },
        { id: 19, nombre: "Torta 36 tiros Paraíso Fantástico", precio: 155000, stock: 12 },
        { id: 20, nombre: "Torta 42 tiros La Tremenda", precio: 165000, stock: 16 },
        { id: 21, nombre: "Torta 48 tiros Perlitas del Mar", precio: 170000, stock: 80 },
        { id: 22, nombre: "Torta 49 tiros Gladiador", precio: 195000, stock: 8 },
        { id: 23, nombre: "Torta 49 tiros Spartacus", precio: 195000, stock: 8 },
        { id: 24, nombre: "Torta 49 tiros Abanico Kraken", precio: 195000, stock: 8 },
        { id: 25, nombre: "Torta 100 tiros Tanque de Guerra", precio: 500000, stock: 4 },
        { id: 26, nombre: "Torta 100 tiros Warzone", precio: 500000, stock: 4 },
        { id: 27, nombre: "Torta 100 tiros Combate Aéreo", precio: 500000, stock: 4 },
        { id: 28, nombre: "Torta 100 tiros Apache", precio: 500000, stock: 4 },
        { id: 29, nombre: "Torta 200 tiros Explosión Lunar", precio: 850000, stock: 2 },
        { id: 30, nombre: "Torta 200 tiros Cometa Halley", precio: 850000, stock: 2 },
        { id: 31, nombre: "Torta 600 tiros Supernova", precio: 2000000, stock: 2 },
      ],
    },
    {
      nombre: "Juguetería",
      descripcion: "Pirotecnia recreativa: bengalas, misiles, volcancitos y más.",
      productos: [
        { id: 32, nombre: "Vela Pirocracker 10 tiros", precio: 40000, stock: 24 },
        { id: 33, nombre: "Vela Pirocracker 15 tiros", precio: 50000, stock: 24 },
        { id: 34, nombre: "Vela Pirocracker 30 tiros", precio: 60000, stock: 30 },
        { id: 35, nombre: "Bazuca Fest", precio: 175000, stock: 12 },
        { id: 36, nombre: "Barril Cracker por x6", precio: 20000, stock: 40 },
        { id: 37, nombre: "Pajaro Loco x12", precio: 35000, stock: 40 },
        { id: 38, nombre: "Volcán 7\"", precio: 69000, stock: 8 },
        { id: 39, nombre: "Fuente Triangular El Anillo", precio: 60000, stock: 100 },
        { id: 40, nombre: "Match Cracker Metralleta", precio: 50000, stock: 24 },
        { id: 41, nombre: "Misil 100 tiros", precio: 65000, stock: 20 },
        { id: 42, nombre: "Volcancito de Colombia", precio: 10000, stock: 200 },
        { id: 43, nombre: "Martillos", precio: 50000, stock: 200 },
        { id: 44, nombre: "Zeus", precio: 70000, stock: 16 },
      ],
    },
    {
      nombre: "Pirotecnia de Escenario",
      descripcion: "Efectos visuales para eventos, shows y presentaciones.",
      productos: [
        { id: 45, nombre: "Candela Cometa Verde", precio: 80000, stock: 24 },
        { id: 46, nombre: "Candela Cometa Roja", precio: 80000, stock: 24 },
        { id: 47, nombre: "Fuente Indoor Plata 3mts x 30s", precio: 150000, stock: 20 },
      ],
    },
    {
      nombre: "Uso Profesional",
      descripcion: "Carcasas y fuentes de alto impacto para expertos certificados.",
      productos: [
        { id: 48, nombre: "Carcasa 2.5\"", precio: 55000, stock: 96 },
        { id: 49, nombre: "Carcasa 3\"", precio: 80000, stock: 9 },
        { id: 50, nombre: "Carcasa 4\"", precio: 120000, stock: 9 },
        { id: 51, nombre: "Carcasa 5\"", precio: 150000, stock: 9 },
        { id: 52, nombre: "Carcasa 6\"", precio: 180000, stock: 9 },
        { id: 53, nombre: "Carcasa 8\"", precio: 200000, stock: 9 },
      ],
    }
  ];

  // 🛒 Estado del carrito
  const [carrito, setCarrito] = useState([]);
  const [imagenesProductos, setImagenesProductos] = useState({});
  const descuento = 0.05; // 5%

  // Cargar carrito desde localStorage
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(guardado);
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // --- Funciones del carrito ---
  const agregarAlCarrito = (producto) => {
    const productoConImagen = {
      ...producto,
      imagen: imagenesProductos[producto.id] || producto.imagen || "",
    };
    const existe = carrito.find((p) => p.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...productoConImagen, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id) =>
    setCarrito(carrito.filter((p) => p.id !== id));

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) eliminarDelCarrito(id);
    else setCarrito(carrito.map((p) => (p.id === id ? { ...p, cantidad } : p)));
  };

  const calcularSubtotal = () =>
    carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const calcularIVA = (subtotal) => subtotal * 0.19;
  const calcularEnvio = (subtotal) => (subtotal > 100000 ? 0 : 15000);
  const calcularDescuento = (subtotal) => subtotal * descuento;

  const calcularTotal = () => {
    const sub = calcularSubtotal();
    return sub + calcularIVA(sub) + calcularEnvio(sub) - calcularDescuento(sub);
  };

  const vaciarCarrito = () => setCarrito([]);
  const finalizarCompra = () => {
    if (!carrito.length) return alert("Tu carrito está vacío 🛒");
    alert("✅ Compra finalizada con éxito");
    vaciarCarrito();
  };

  const handleImagenChange = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenesProductos(prev => ({
        ...prev,
        [id]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="categorias-admin-page">
      {/* NAVBAR */}
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand onClick={() => navigate("/dashboard")} className="brand-logo">
            <img src={logo} alt="logo" height="40" />
            <span className="ms-2 fw-bold text-warning">PyroShop</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link onClick={() => navigate("/Dashboard")} className="active-link">Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/Categorias")}>Categorias</Nav.Link>
              <Nav.Link onClick={() => navigate("/ofertaspirotecnia")}>Ofertas</Nav.Link>
              <Nav.Link onClick={() => navigate("/Seguridad")}>seguridad</Nav.Link>
              <Nav.Link onClick={() => navigate("/events")}>Eventos</Nav.Link>
              <Nav.Link onClick={() => navigate("/helpcenter")}>Ayuda</Nav.Link>
              <Nav.Link onClick={() => navigate("/Admin")} className="text-warning">
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>

              {user ? (
                <Nav.Item className="logout-container" onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img src={user} alt="Foto de usuario" className="user-photo-nav" />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link onClick={() => navigate("/login")} className="d-flex align-items-center gap-2 fw-bold text-light">
                  <FaUser /> Acceder
                </Nav.Link>
              )}

              <Nav.Link onClick={() => navigate("/productos")} className="cart-icon">
                <FaShoppingCart />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🧨 CATÁLOGO */}
      <div className="categorias-container">
        <h1>Catálogo de Productos</h1>
        <p className="subtitulo">
          Explora todas las categorías de nuestro catálogo oficial
        </p>

        {categoriasData.map((cat, i) => (
          <section key={i} className="seccion-categoria">
            <div className="seccion-header">
              <h2>{cat.nombre}</h2>
              <p className="categoria-desc">{cat.descripcion}</p>
            </div>

            <div className="productos-grid">
              {cat.productos.map((p) => (
                <div key={p.id} className="producto-card">
                  {p.imagen || imagenesProductos[p.id] ? (
                    <img 
                      src={imagenesProductos[p.id] || p.imagen} 
                      alt={p.nombre} 
                      className="producto-imagen"
                    />
                  ) : null}

                  <div className="producto-body">
                    <h3>{p.nombre}</h3>
                    <p className="precio">Precio: ${p.precio.toLocaleString()}</p>
                    <p className="stock">Stock: {p.stock}</p>
                    <p className="producto-id">ID: {p.id}</p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImagenChange(p.id, e)}
                    />

                    <button
                      className="btn-agregar"
                      onClick={() => agregarAlCarrito(p)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* 🧾 RESUMEN DEL CARRITO */}
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
                      <td>
                        {item.imagen && <img src={item.imagen} alt={item.nombre} style={{ width: "50px", marginRight: "10px" }} />}
                        {item.nombre}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            actualizarCantidad(
                              item.id,
                              parseInt(e.target.value || "0")
                            )
                          }
                        />
                      </td>
                      <td>${item.precio.toLocaleString()}</td>
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

              <div className="totales">
                <p>Subtotal: ${calcularSubtotal().toLocaleString()}</p>
                <p>IVA (19%): ${calcularIVA(calcularSubtotal()).toLocaleString()}</p>
                <p>Envío: ${calcularEnvio(calcularSubtotal()).toLocaleString()}</p>
                <p>Descuento (5%): -${calcularDescuento(calcularSubtotal()).toLocaleString()}</p>
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
    </div>
  );
}
