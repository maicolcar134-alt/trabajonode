import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import userDefault from "../../assets/Explosión de color y energía.png";
import "./DashboardPage.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "react-bootstrap";

function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Productos vienen de la colección "inventario" (lo que usas en Inventario.js)
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [carrito, setCarrito] = useState([]);

  // Categorías fijas solicitadas
  const categoriasDisponibles = ["Tortas", "Juguetería", "Uso Profesional"];

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  // Suscripción en tiempo real a la colección "inventario"
  useEffect(() => {
    const refCol = collection(db, "inventario");
    const unsub = onSnapshot(
      refCol,
      (snapshot) => {
        const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // ordenar opcionalmente por nombre (mantener consistente)
        lista.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
        setProductos(lista);
      },
      (err) => {
        console.error("Error onSnapshot inventario:", err);
        Swal.fire(
          "Error",
          "No se pudo cargar el inventario en tiempo real.",
          "error"
        );
      }
    );

    return () => unsub();
  }, []);

  // Productos destacados (también en tiempo real)
  const [destacados, setDestacados] = useState([]);
  useEffect(() => {
    try {
      const q = query(
        collection(db, "inventario"),
        where("destacado", "==", true)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const arr = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDestacados(arr);
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Añadir producto al carrito (sin duplicados -> suma cantidad)
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
      timer: 1500,
      background: "#111",
      color: "#fff",
    });
  };

  // Filtrado por categoría usando las categorías fijas
  const productosFiltrados = filtroCategoria
    ? productos.filter((p) => p.categoria === filtroCategoria)
    : productos;

  // Alerta +18 (una vez por sesión)
  useEffect(() => {
    const hasConfirmed = sessionStorage.getItem("ageConfirmed");
    if (hasConfirmed) return;

    Swal.fire({
      title: "⚠️ Verificación de Edad",
      html: `
        <div style="text-align: left; font-size: 15px; color: #ddd;">
          <p>La venta de pirotecnia está regulada por ley. Confirme que es mayor de edad y acepta cumplir con las normativas de seguridad.</p>
          <p>Está prohibida la venta de pirotecnia a menores de edad.</p>
          <p>Debe confirmar que tiene al menos 18 años.</p>
          <div style="margin-top: 15px;">
            <input type="checkbox" id="ageCheck">
            <label for="ageCheck"> Confirmo que tengo 18 años o más.</label>
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
          Swal.showValidationMessage("Debes confirmar tu edad para continuar.");
          return false;
        } else {
          sessionStorage.setItem("ageConfirmed", "true");
        }
      },
    });
  }, []);

  // Cerrar sesión
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
          timer: 1000,
          showConfirmButton: false,
        });
        navigate("/");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cerrar sesión", "error");
      }
    }
  };

  return (
    <>
      {/* HERO */}
      <main className="main-content" style={{ margin: 0, padding: 0 }}>
        <section
          className="relative flex items-center justify-start bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1595567818311-57a0736507d8?crop=entropy&fit=max&w=1080')",
            height: "70vh",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            position: "relative",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div
            className="relative z-10 flex flex-col justify-center h-full text-left"
            style={{ paddingLeft: "3vw", maxWidth: "800px" }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-6 w-fit">
              <span className="text-sm">Ofertas especiales de temporada</span>
            </div>

            <h1 className="text-5xl text-white mb-4 leading-tight">
              PyroShop - Ilumina Tus Celebraciones
            </h1>

            <p className="text-xl text-white/90 mb-8">
              Pirotecnia legal y certificada. Calidad profesional para tus
              momentos inolvidables.
            </p>

            <div className="button-group">
              <button
                className="btn btn-orange"
                onClick={() => navigate("/Categorias")}
              >
                Explorar catálogo
              </button>
              <button
                className="btn-black"
                onClick={() => navigate("/Seguridad")}
              >
                Guía de Seguridad
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* DESTACADOS */}
      <section
        className="productos-destacados px-5 py-20"
        style={{ background: "#111", color: "#fff" }}
      >
        <h2
          className="text-3xl fw-bold mb-5 pb-2 border-bottom border-warning"
          style={{ borderColor: "#f97316" }}
        >
          Productos Destacados
        </h2>

        {destacados.length === 0 ? (
          <p className="text-center text-muted">
            No hay productos destacados...
          </p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {destacados.map((p) => (
              <div key={p.id} className="col">
                <div className="card h-100 bg-dark text-light border-0 shadow-lg">
                  {p.imagenUrl ? (
                    <img
                      src={p.imagenUrl}
                      className="card-img-top"
                      style={{ height: "220px", objectFit: "cover" }}
                      alt={p.nombre}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-secondary"
                      style={{ height: "220px" }}
                    >
                      Sin imagen
                    </div>
                  )}

                  <div className="card-body text-center">
                    <span className="badge bg-warning text-dark mb-2">
                      ⭐ Destacado
                    </span>
                    <span className="badge bg-info text-dark mb-2 ms-2">
                      {p.categoria || "—"}
                    </span>

                    <h5 className="fw-bold mt-2 text-uppercase">{p.nombre}</h5>

                    <p className="text-muted" style={{ minHeight: "40px" }}>
                      {p.descripcion || "Sin descripción"}
                    </p>

                    <p className="fw-bold text-warning mb-1">
                      💰 ${Number(p.precio).toLocaleString()}
                    </p>

                    <p
                      className="text-light mb-3"
                      style={{ fontSize: "0.9rem", opacity: 0.8 }}
                    >
                      📦 Stock:{" "}
                      <span className="fw-bold">
                        {p.cantidad ?? p.stock ?? 0}
                      </span>
                    </p>

                    <button
                      className="btn btn-warning w-100"
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

      {/* CATEGORÍAS (Fijas) */}
      <section
        className="catalogo-completo px-5 py-20"
        style={{ background: "#0d0d0d", color: "#fff" }}
      >
        <h2
          className="text-3xl fw-bold mb-5 pb-2 border-bottom border-warning"
          style={{ borderColor: "#f97316" }}
        >
          Categorías
        </h2>

        <div className="d-flex gap-3 mb-4 justify-content-center">
          <button
            className={`btn ${
              filtroCategoria === "" ? "btn-warning" : "btn-outline-warning"
            }`}
            onClick={() => setFiltroCategoria("")}
          >
            Todos
          </button>

          {categoriasDisponibles.map((c) => (
            <button
              key={c}
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
            No hay productos en esta categoría.
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
                      style={{ height: "220px", objectFit: "cover" }}
                      alt={p.nombre}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-secondary"
                      style={{ height: "220px" }}
                    >
                      Sin imagen
                    </div>
                  )}

                  <div className="card-body text-center">
                    <h5 className="fw-bold text-uppercase">{p.nombre}</h5>

                    {p.oferta ? (
                      <>
                        <p className="fw-bold text-danger mb-1">
                          🔥 Oferta {p.ofertaValor ?? "—"}% OFF
                        </p>
                        <p className="fw-bold text-success mb-1">
                          💰 $
                          {(
                            (Number(p.precio) || 0) *
                            (1 - (p.ofertaValor || 0) / 100)
                          ).toLocaleString()}
                        </p>
                        <p
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Antes: ${Number(p.precio || 0).toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="fw-bold text-success mb-1">
                        💰 ${Number(p.precio || 0).toLocaleString()}
                      </p>
                    )}

                    <p
                      className="text-light mb-3"
                      style={{ fontSize: "0.9rem", opacity: 0.8 }}
                    >
                      📦 Stock:{" "}
                      <span className="fw-bold">
                        {p.cantidad ?? p.stock ?? 0}
                      </span>
                    </p>

                    <button
                      className="btn btn-warning w-100"
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
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
              <ul className="space-y-2 p-0">
                <li>
                  <a href="/politicasventa" className="text-sm text-white/80">
                    Política de Venta Responsable
                  </a>
                </li>
                <li>
                  <a
                    href="/terminoscondiciones"
                    className="text-sm text-white/80"
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a
                    href="/PoliticasPrivacidad"
                    className="text-sm text-white/80"
                  >
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="/normativaregulacion"
                    className="text-sm text-white/80"
                  >
                    Normativa y Regulación
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 p-0">
                <li>
                  <a href="/Seguridad" className="text-sm text-white/80">
                    Guía de Seguridad
                  </a>
                </li>
                <li>
                  <a href="/HelpCenter" className="text-sm text-white/80">
                    Ayuda al Usuario
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Contacto</h4>
              <ul className="space-y-2 p-0 text-white/80 text-sm">
                <li>+573213148729</li>
                <li>info@pyroshop.co</li>
                <li>
                  Calle 12 #45-67
                  <br />
                  Ocaña, Norte de Santander
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mt-6">
            <p className="text-sm text-white/90 m-0">
              <strong>Aviso Legal:</strong> La venta de artículos pirotécnicos
              está sujeta a normativa vigente.
            </p>
          </div>

          <div className="flex justify-between items-center text-white/60 text-sm mt-6">
            <p className="m-0">
              © 2025 PyroShop. Todos los derechos reservados.
            </p>
            <div>
              {user ? (
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default DashboardPage;
