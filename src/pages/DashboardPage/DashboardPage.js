import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import logo from "../../assets/Explosión de color y energía.png";
import userDefault from "../../assets/Explosión de color y energía.png";
import "./DashboardPage.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Badge, Container } from "react-bootstrap";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";

import "react-bootstrap";

function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const userPhoto = user?.photoURL || userDefault;
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);
  // 🛒 Añadir producto al carrito
  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const productoExistente = carritoActual.find(
      (item) => item.id === producto.id
    );

    let nuevoCarrito;
    if (productoExistente) {
      nuevoCarrito = carritoActual.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }];
    }

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${producto.nombre} añadido al carrito 🛒`,
      showConfirmButton: false,
      timer: 0,
      background: "#111",
      color: "#fff",
    });
  };

  // ✅ Estado para productos destacados
  const [destacados, setDestacados] = useState([]);

  // ✅ Cargar productos destacados
  useEffect(() => {
    const q = query(
      collection(db, "productos"),
      where("destacado", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDestacados(productos);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Cargar productos destacados desde Firebase
  useEffect(() => {
    const q = query(
      collection(db, "productos"),
      where("destacado", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDestacados(productos);
    });
    return () => unsubscribe();
  }, []);
  // ✅ Cargar todos los productos desde Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(productos);
    });
    return () => unsubscribe();
  }, []);
  // ✅ Filtrar productos por categoría
  const productosFiltrados = filtroCategoria
    ? productos.filter((p) => p.categoria === filtroCategoria)
    : productos;
  // ✅ Obtener lista única de categorías
  const categorias = [
    ...new Set(productos.map((p) => p.categoria).filter((c) => c)),
  ];

  // ✅ Mostrar alerta +18 solo una vez por sesión
  useEffect(() => {
    const hasConfirmed = sessionStorage.getItem("ageConfirmed");
    if (hasConfirmed) return;

    Swal.fire({
      title: "⚠️ Verificación de Edad",
      html: `
        <div style="text-align: left; font-size: 15px; color: #ddd;">
          <p>La venta de pirotecnia está regulada por ley. Confirme que es mayor de edad y acepta cumplir con las normativas de seguridad.</p>
          <p>Está prohibida la venta de pirotecnia a menores de edad.</p>
          <p>Para acceder a este sitio web, debe confirmar que tiene al menos 18 años y acepta cumplir con todas las normas de seguridad y uso responsable.</p>
          <p><strong style="color: #f87171;">Importante:</strong> El uso inadecuado de productos pirotécnicos puede causar lesiones graves. Lea siempre las instrucciones de seguridad antes de usar.</p>
          <div style="margin-top: 15px;">
            <input type="checkbox" id="ageCheck">
            <label for="ageCheck"> Confirmo que tengo 18 años o más y acepto la 
              <a href="#" style="color: #f97316;"> Política de Venta Responsable</a> 
              y las <a href="#" style="color: #f97316;">Condiciones de Uso</a>.
            </label>
          </div>
        </div>
      `,
      confirmButtonText: "Acceder al Sitio",
      background: "#1e1e1e",
      color: "#fff",
      confirmButtonColor: "#f97316",
      allowOutsideClick: false,
      preConfirm: () => {
        const checkbox = Swal.getPopup().querySelector("#ageCheck");
        if (!checkbox.checked) {
          Swal.showValidationMessage(
            "Debes confirmar que eres mayor de 18 años para continuar."
          );
          return false;
        } else {
          sessionStorage.setItem("ageConfirmed", "true");
        }
      },
    });
  }, []);

  // ✅ Cerrar sesión con confirmación
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a cerrar sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "No, quedarme",
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        sessionStorage.removeItem("ageConfirmed");
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "¡Has cerrado sesión exitosamente!",
          timer: 0,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cerrar sesión.",
        });
      }
    }
  };

  return (
    <>
      {/* NAVBAR */}
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
              <Nav.Link
                onClick={() => navigate("/Dashboard")}
                className="active-link"
              >
                Inicio
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/categorias")}>
                Categorias
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
                <Nav.Item className="logout-container" onClick={handleLogout}>
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

              {/* 🛒 CARRITO CON CONTADOR */}
              <Nav.Link
                onClick={() => navigate("/Carrito")}
                className="position-relative"
              >
                <FaShoppingCart size={20} />
                {carrito.length > 0 && (
                  <Badge
                    bg="warning"
                    text="dark"
                    pill
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                      fontSize: "0.7rem",
                    }}
                  >
                    {carrito.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* contenido principal*/}
      <main
        className="main-content"
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <section
          className="relative flex items-center justify-start bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1595567818311-57a0736507d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJld29ya3MlMjBuaWdodCUyMHNreSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc1OTk3MTA4N3ww&ixlib=rb-4.1.0&q=80&w=1080')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100vw",
            height: "70vh",
            marginLeft: "calc(-50vw + 50%)",
            position: "relative",
          }}
        >
          {/* Capa oscura */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Contenido */}
          <div
            className="relative z-10 flex flex-col justify-center h-full text-left"
            style={{
              paddingLeft: "3vw", // margen desde la izquierda
              maxWidth: "800px", // ancho del bloque
            }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-6 w-fit">
              <span className="text-sm">Ofertas especiales de temporada</span>
            </div>

            <h1 className="text-5xl text-white mb-4 leading-tight">
              PyroShop - Ilumina Tus Celebraciones
            </h1>

            <p className="text-xl text-white/90 mb-8">
              Pirotecnia legal y certificada. Calidad profesional, uso
              responsable. Todo lo que necesitas para crear momentos
              inolvidables.
            </p>

            {/* Botones */}
            <div className="button-group">
              <button
                className="btn btn-orange"
                onClick={() => (window.location.href = "/Categorias")}
              >
                Explorar catálogo
              </button>

              <button
                className="btn-black"
                onClick={() => (window.location.href = "/Seguridad")}
              >
                Guía de Seguridad
              </button>
            </div>

            <div class="contenedor"></div>
            <div className="contenedor">
              <div>
                <div className="numero">500+</div>
                <div className="etiqueta">Productos</div>
              </div>

              <div>
                <div className="numero">100%</div>
                <div className="etiqueta">Certificados</div>
              </div>

              <div>
                <div className="numero">24/7</div>
                <div className="etiqueta">Soporte</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 🔥 PRODUCTOS DESTACADOS */}
      <section
        className="productos-destacados px-5 py-20"
        style={{ backgroundColor: "#111", color: "#fff" }}
      >
        <h2
          className="text-3xl fw-bold mb-5 pb-2 border-bottom border-warning"
          style={{ borderColor: "#f97316" }}
        >
          Productos Destacados
        </h2>

        {destacados.length === 0 ? (
          <p className="text-center text-muted">
            Cargando productos destacados...
          </p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {destacados.map((p) => (
              <div key={p.id} className="col">
                <div className="card h-100 bg-dark text-light border-0 shadow-lg">
                  {/* Imagen del producto */}
                  <img
                    src={p.imagen} // 👈 si no hay imagen en Firestore, usa la importada
                    className="card-img-top"
                    alt={p.nombre}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <span className="badge bg-warning text-dark mb-2">
                      {p.categoria || "Pirotecnia"}
                    </span>
                    <h5 className="card-title">{p.nombre}</h5>

                    {p.mensajeDestacado && (
                      <div
                        className="mensaje-destacado my-2 p-2 rounded"
                        style={{
                          backgroundColor: "#fff8dc",
                          color: "#b8860b",
                          fontStyle: "italic",
                          fontWeight: "500",
                          border: "1px solid gold",
                          boxShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
                        }}
                      >
                        💫 {p.mensajeDestacado}
                      </div>
                    )}

                    <p className="card-text text-muted">{p.descripcion}</p>
                    <p className="fw-bold text-warning">
                      💰 ${Number(p.precio).toLocaleString()}
                    </p>
                    <p
                      className="text-light mb-3"
                      style={{ fontSize: "0.9rem", opacity: 0.8 }}
                    >
                      📦 Stock: <span className="fw-bold">{p.stock || 0}</span>
                    </p>
                    <button
                      className="btn btn-warning w-100 fw-semibold"
                      onClick={() => agregarAlCarrito(p)}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🔥 CATÁLOGO COMPLETO */}
      <section
        className="catalogo-completo px-5 py-20"
        style={{ backgroundColor: "#0d0d0d", color: "#fff" }}
      >
        <h2
          className="text-3xl fw-bold mb-5 pb-2 border-bottom border-warning"
          style={{ borderColor: "#f97316" }}
        >
          Catálogo Completo
        </h2>

        {/* 🔹 Filtros */}
        <div
          className="filtros-catalogo d-flex gap-3 mb-4"
          style={{ justifyContent: "center" }}
        >
          <button
            className={`btn ${
              filtroCategoria === "" ? "btn-warning" : "btn-outline-warning"
            }`}
            onClick={() => setFiltroCategoria("")}
          >
            Todos
          </button>
          {categorias.map((c, i) => (
            <button
              key={i}
              className={`btn ${
                filtroCategoria === c ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => setFiltroCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {productosFiltrados.length === 0 ? (
          <p className="text-center text-muted">
            No se encontraron productos en esta categoría.
          </p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="col">
                <div className="card h-100 bg-dark text-light border-0 shadow-lg">
                  {p.imagenUrl ? (
                    <img
                      src={p.imagenUrl}
                      className="card-img-top"
                      alt={p.nombre}
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-secondary text-light"
                      style={{ height: "220px" }}
                    >
                      Sin imagen
                    </div>
                  )}
                  <div className="card-body text-center">
                    <h5 className="fw-bold text-uppercase">{p.nombre}</h5>
                    <p className="fw-bold text-success mb-1">
                      💰 ${Number(p.precio).toLocaleString()}
                    </p>
                    <p
                      className="text-light mb-3"
                      style={{ fontSize: "0.9rem", opacity: 0.8 }}
                    >
                      📦 Stock: <span className="fw-bold">{p.stock || 0}</span>
                    </p>
                    <button
                      className="btn btn-warning w-100 fw-semibold"
                      onClick={() => agregarAlCarrito(p)}
                    >
                      Añadir al carrito 🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="footer mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-warm)] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🎆</span>
                </div>
                <div>
                  <h3 className="m-0">PyroShop</h3>
                  <p className="text-sm text-white/70 m-0">Pirotecnia Legal</p>
                </div>
              </div>
              <p className="text-sm text-white/80">
                Venta legal y responsable de pirotecnia certificada.
              </p>
            </div>

            <div>
              <h4 className="mb-4">Legal y Seguridad</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <a
                    href="/politicasventa"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Política de Venta Responsable
                  </a>
                </li>
                <li>
                  <a
                    href="/terminoscondiciones"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a
                    href="/PoliticasPrivacidad"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="/normativaregulacion"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline"
                  >
                    Normativa y Regulación
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <a
                    href="/Seguridad"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline"
                  >
                    Guía de Seguridad
                  </a>
                </li>
                <li>
                  <a
                    href="/HelpCenter"
                    className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline"
                  >
                    Ayuda al Usuario
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Contacto</h4>
              <ul className="space-y-3 list-none p-0 m-0">
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>+573213148729</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>info@pyroshop.co</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <span>
                    Calle 12 # 45-67
                    <br />
                    Ocaña, Norte de Santander
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-white/90 m-0">
              <strong>Aviso Legal:</strong> La venta de artículos pirotécnicos
              está sujeta a la normativa vigente. Está prohibida la venta a
              menores de 18 años. El comprador se compromete a usar los
              productos de forma responsable y siguiendo todas las instrucciones
              de seguridad. PyroShop no se hace responsable del uso inadecuado
              de los productos.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p className="m-0">
              © 2025 PyroShop. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default DashboardPage;
