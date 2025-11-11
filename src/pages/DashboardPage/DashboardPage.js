import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from "../../assets/Explosión de color y energía.png";
import userDefault from "../../assets/Explosión de color y energía.png";
import "./DashboardPage.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import "react-bootstrap"
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";





function DashboardPage() {  
  const navigate = useNavigate();
  const [user] = useAuthState(auth);


  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

    const userPhoto = user?.photoURL || userDefault;

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
          Swal.showValidationMessage("Debes confirmar que eres mayor de 18 años para continuar.");
          return false;
        } else {
          sessionStorage.setItem("ageConfirmed", "true");
        }
      },
    });
  }, []);

  // Cerrar sesión con confirmación
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
          timer: 2000,
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

// 🔹 Guardar cambios del carrito
const actualizarCarrito = (nuevoCarrito) => {
  setCarrito(nuevoCarrito);
  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
};

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

  const notificacion = document.createElement("div");
  notificacion.className = "toast-notificacion";
  notificacion.innerText = `🛒 ${producto.nombre} agregado al carrito`;
  document.body.appendChild(notificacion);
  setTimeout(() => notificacion.remove(), 2500);
};

// 🧾 Finalizar compra (guardar pedido en Firestore)
const finalizarCompra = async () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  try {
    await addDoc(collection(db, "pedidos"), {
      cliente: {
        nombre: user.nombre,
        email: user.email,
      },
      items: carrito,
      total,
      estado: "Pendiente",
      fecha: serverTimestamp(),
    });

    // Vaciar carrito
    actualizarCarrito([]);

    alert("✅ ¡Compra realizada con éxito!");
    navigate("/mis-pedidos"); // Redirigir a la página de pedidos del usuario
  } catch (err) {
    console.error(err);
    alert("❌ Error al guardar el pedido");
  }
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




  

  return (
    <>
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
           

              {/* Botón de usuario o iniciar sesión */}
              {user ? (
                <Nav.Item className="logout-container" onClick={handleLogout}>
                  <Nav.Link className="logout-link d-flex align-items-center gap-2 text-danger fw-bold">
                    <FaSignOutAlt /> Cerrar Sesión
                    <img src={userPhoto} alt="Foto de usuario" className="user-photo-nav" />
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Link onClick={() => navigate("/login")} className="d-flex align-items-center gap-2 fw-bold text-light">
                  <FaUser /> Acceder
                </Nav.Link>
              )}

              {/* Ícono carrito */}
              <Nav.Link onClick={() => navigate("/Carrito")} className="cart-icon">

                <FaShoppingCart />
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
        maxWidth: "600px", // ancho del bloque
      }}
    >
      <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-6 w-fit">
        <span className="text-sm">Ofertas especiales de temporada</span>
      </div>

      <h1 className="text-5xl text-white mb-4 leading-tight">
        PyroShop - Ilumina Tus Celebraciones
      </h1>

      <p className="text-xl text-white/90 mb-8">
        Pirotecnia legal y certificada. Calidad profesional, uso responsable.
        Todo lo que necesitas para crear momentos inolvidables.
      </p>


{/* Botones */}
<div className="button-group">
   <button
    className="btn btn-orange"
    onClick={() => window.location.href = "/Categorias"}
  >
    Explorar catálogo
  </button>
  
  <button
  className="btn-black"
  onClick={() => window.location.href = "/Seguridad"}
>
  Guía de Seguridad
</button>
</div>


{/* porcentajes */}

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


{/* PRODUCTOS */}


<section
  className="productos-destacados px-5 py-20"
  style={{
    backgroundColor: "#111",
    color: "#fff",
  }}
>
<h2
  className="text-3xl fw-bold mb-5 pb-2 border-bottom border-warning"
  style={{ borderColor: "#f97316", color: "white" }}
>
  Productos Destacados
</h2>

      {/* 🔹 CATÁLOGO */}
      <div className="catalogo-contenedor">
        <h1 className="titulo-catalogo"></h1>

        <div className="filtros">
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
                <a href="#" className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline">
                  Política de Venta Responsable
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-[var(--brand-warm)] flex items-center gap-2 no-underline">
                  Normativa y Regulación
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Atención al Cliente</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="" className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline">
                  Guía de Seguridad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline">
                  Devoluciones y Cambios
                </a>
              </li>
              <li>
                <a href="" className="text-sm text-white/80 hover:text-[var(--brand-warm)] no-underline">
                  Envíos y Entregas
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
                  Calle 12 # 45-67<br />
                  Ocaña, Norte de Santander
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-white/90 m-0">
            <strong>Aviso Legal:</strong> La venta de artículos pirotécnicos está sujeta a la normativa
            vigente. Está prohibida la venta a menores de 18 años. El comprador se compromete a usar
            los productos de forma responsable y siguiendo todas las instrucciones de seguridad. 
            PyroShop no se hace responsable del uso inadecuado de los productos.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p className="m-0">
            © 2025 PyroShop. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[var(--brand-warm)] no-underline">
              Mapa del sitio
            </a>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}

export default DashboardPage;