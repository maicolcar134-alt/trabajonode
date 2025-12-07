import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "./DashboardPage.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "react-bootstrap";

// Imagen por defecto (usar logo o placeholder seguro)
const userDefault = "/Logo.png";

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
          className="relative flex items-center justify-start overflow-hidden"
          style={{
            height: "70vh",          // altura fija → sin reflows
            width: "100%",           // evita el ancho 100vw (genera scroll y CLS)
            position: "relative"
          }}
        >
          {/* Imagen LCP con espacio reservado */}
          <img
            src="/assets/hero.webp"
            alt="Pirotecnia PyroShop"
            className="absolute inset-0 object-cover"
            loading="eager"
            fetchpriority="high"
            width="1920"               // RESERVA espacio = sin CLS
            height="1080"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 1
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" style={{ zIndex: 2 }}></div>

          {/* Contenido MÁS LIGERO (sin min-h-screen, sin margin-top dinámico) */}
          <div
            className="relative flex flex-col justify-center items-start px-[4vw]"
            style={{
              paddingLeft: "4vw",
              maxWidth: "800px",
              marginTop: "20vh",
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

            <div className="contenedor mt-6">
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
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/Logo.png";
                      }}
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
    </>
  );
}

export default DashboardPage;
