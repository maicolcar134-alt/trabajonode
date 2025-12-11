// src/pages/Inventario/Inventario.js
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Solo necesitas db ahora
import Swal from "sweetalert2";
import { buscarConNormalizacion } from "../../utils/normalizarBusqueda";
import "./Inventario.css";


// ====================== CONFIGURACIÓN DE CLOUDINARY ======================
const CLOUDINARY_CLOUD_NAME = "dukdktdze";          // ← REEMPLAZA CON TU CLOUD NAME
const CLOUDINARY_UPLOAD_PRESET = "inventario-unsigned";    // ← REEMPLAZA CON TU PRESET UNSIGNED

// ====================== SUBIR IMAGEN A CLOUDINARY ======================
const subirImagenCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    // formData.append("folder", "inventario"); // Opcional

    console.log("📤 Subiendo a Cloudinary...");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json(); // Siempre parsea la respuesta

    if (!response.ok) {
      console.error("❌ Error de Cloudinary:", data); // Aquí verás el mensaje exacto
      throw new Error(data.error?.message || "Error desconocido");
    }

    console.log("✅ Subida exitosa:", data.secure_url);
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error("❌ Error subiendo a Cloudinary:", error);
    return null;
  }
};

// ====================== ELIMINAR IMAGEN DE CLOUDINARY (opcional) ======================
// Requiere backend seguro (API secret). Por ahora solo avisa.
const eliminarImagenCloudinary = async (publicId) => {
  if (!publicId) return;
  console.warn("🗑️ Eliminación de imagen en Cloudinary no implementada (requiere backend). public_id:", publicId);
  // En el futuro: llamar a un endpoint seguro del backend
};

const imagenDefault = "";

const categoriasData = [
  { nombre: "Tortas" },
  { nombre: "Juguetería" },
  { nombre: "Uso Profesional" },
];

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [modoEditar, setModoEditar] = useState(false);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [destacado, setDestacado] = useState(false);
  const [oferta, setOferta] = useState(false);

  const [fileImage, setFileImage] = useState(null);
  const [imagenVista, setImagenVista] = useState(imagenDefault);
  const [imagenUrl, setImagenUrl] = useState(""); // URL anterior en edición
  const [publicIdImage, setPublicIdImage] = useState("");
  const [cargando, setCargando] = useState(false);

  const [filtro, setFiltro] = useState("Todos");
  const [busquedaSKU, setBusquedaSKU] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [mostraSugerencias, setMostraSugerencias] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 20;

  /* Cargar productos en tiempo real */
  useEffect(() => {
    const refCol = collection(db, "inventario");
    const unsub = onSnapshot(refCol, (snap) => {
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Autocomplete búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busquedaSKU.trim() === "") {
        setResultadosBusqueda([]);
        setMostraSugerencias(false);
        return;
      }

      const q = busquedaSKU.trim();
      const resultados = productos.filter(
        (p) =>
          buscarConNormalizacion(p.id || "", q) ||
          buscarConNormalizacion(p.nombre || "", q) ||
          buscarConNormalizacion(p.categoria || "", q)
      );

      setResultadosBusqueda(resultados);
      setMostraSugerencias(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [busquedaSKU, productos]);

  const seleccionarDelBuscador = (producto) => {
    editarProducto(producto);
    setBusquedaSKU(producto.id);
    setMostraSugerencias(false);
  };

  const limpiar = () => {
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setCategoria("");
    setCantidad("");
    setDestacado(false);
    setOferta(false);
    setImagenVista(imagenDefault);
    setImagenUrl("");
    setFileImage(null);
    setPublicIdImage("");
    setModoEditar(false);
    setIdEdit("");
    setBusquedaSKU("");
    setResultadosBusqueda([]);
    setMostraSugerencias(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return Swal.fire("Formato inválido", "Solo JPG, PNG o WEBP.", "warning");
    }

    if (file.size > 8 * 1024 * 1024) {
      return Swal.fire("Muy pesado", "Máximo 8 MB.", "warning");
    }

    setFileImage(file);
    setImagenVista(URL.createObjectURL(file));
  };

  /* Guardar */
  const guardarProducto = async () => {
    if (!nombre || !precio || !descripcion || !categoria || !cantidad) {
      return Swal.fire("Campos incompletos", "Completa todo.", "warning");
    }

    setCargando(true);

    try {
      let idFinal = idEdit;
      let publicId = publicIdImage;
      let imagenFinal = imagenDefault;

      // Subir nueva imagen si hay archivo
      if (fileImage) {
        const subida = await subirImagenCloudinary(fileImage);
        if (!subida || !subida.secure_url) {
          setCargando(false);
          return Swal.fire(
            "Error al subir imagen",
            "No se pudo subir la imagen a Cloudinary. Verifica tu conexión o credenciales.",
            "error"
          );
        }

        imagenFinal = subida.secure_url;
        publicId = subida.public_id || "";

        // Intentar eliminar imagen anterior (solo si tienes backend implementado)
        if (modoEditar && publicIdImage) {
          await eliminarImagenCloudinary(publicIdImage);
        }
      } else if (modoEditar && imagenUrl) {
        imagenFinal = imagenUrl;
        publicId = publicIdImage;
      }

      if (!imagenFinal || imagenFinal.trim() === "") {
        imagenFinal = imagenDefault;
      }

      if (!modoEditar) {
        const refCol = collection(db, "inventario");
        const nuevo = await addDoc(refCol, {
          nombre,
          precio: Number(precio),
          descripcion,
          categoria,
          cantidad: Number(cantidad),
          destacado,
          oferta,
          precioOferta: "",
          porcentajeOferta: "",
          imagenUrl: imagenFinal,
          publicId: publicId || "",
          creado: serverTimestamp(),
        });
        idFinal = nuevo.id;
      } else {
        await updateDoc(doc(db, "inventario", idFinal), {
          nombre,
          precio: Number(precio),
          descripcion,
          categoria,
          cantidad: Number(cantidad),
          destacado,
          oferta,
          imagenUrl: imagenFinal,
          publicId: publicId || "",
        });
      }

      limpiar();
      Swal.fire(
        "Éxito",
        modoEditar ? "Producto actualizado" : "Agregado",
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }

    setCargando(false);
  };

  const editarProducto = (p) => {
    setModoEditar(true);
    setIdEdit(p.id);
    setNombre(p.nombre);
    setPrecio(p.precio);
    setDescripcion(p.descripcion);
    setCategoria(p.categoria);
    setCantidad(p.cantidad);
    setDestacado(Boolean(p.destacado));
    setOferta(Boolean(p.oferta));
    setImagenVista(p.imagenUrl || imagenDefault);
    setImagenUrl(p.imagenUrl || "");
    setPublicIdImage(p.publicId || "");
  };

  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar?",
      text: "No podrás recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const productoDoc = productos.find((p) => p.id === id);
      if (productoDoc?.publicId) {
        await eliminarImagenCloudinary(productoDoc.publicId);
      }
    } catch (err) {
      console.warn("⚠️ Error intentando eliminar imagen:", err);
    }

    await deleteDoc(doc(db, "inventario", id));
    Swal.fire("Eliminado", "Producto eliminado", "success");
  };

  const cambioDestacado = async (id, val) => {
    await updateDoc(doc(db, "inventario", id), {
      destacado: !val,
    });
  };

  const cambioOferta = async (id, val) => {
    await updateDoc(doc(db, "inventario", id), {
      oferta: !val,
    });
  };

  const editarOferta = async (p) => {
    const { value: porcentaje } = await Swal.fire({
      title: "Editar Oferta",
      input: "number",
      inputLabel: "Porcentaje de descuento (%)",
      inputValue: p.porcentajeOferta || 5,
      inputAttributes: { min: 1, max: 90 },
      showCancelButton: true,
      confirmButtonText: "Guardar",
    });

    if (porcentaje === undefined || porcentaje === null || porcentaje === "")
      return;

    const porcNum = Number(porcentaje);
    if (Number.isNaN(porcNum) || porcNum <= 0) {
      return Swal.fire("Valor inválido", "Ingresa un porcentaje válido.", "warning");
    }

    const precioOriginal = Number(p.precio) || 0;
    const precioFinal = Math.round(precioOriginal - (precioOriginal * porcNum) / 100);

    try {
      await updateDoc(doc(db, "inventario", p.id), {
        porcentajeOferta: porcNum,
        precioOferta: precioFinal,
        oferta: true,
      });
      Swal.fire("Actualizado", "Oferta modificada", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar la oferta", "error");
    }
  };

  const productosFiltrados = productos.filter((p) => {
    if (filtro === "Tortas") return p.categoria === "Tortas";
    if (filtro === "Juguetería") return p.categoria === "Juguetería";
    if (filtro === "Uso Profesional") return p.categoria === "Uso Profesional";
    return true;
  });

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / itemsPorPagina));
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleCambioFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
    setPaginaActual(1);
  };

  return (
    <div className="inventario-container">
      <h2 className="inventario-title">📦 Inventario</h2>

      {/* BÚSQUEDA AUTOCOMPLETE */}
      <div className="busqueda-sku-container">
        <label>🔍 Buscar SKU / Producto</label>
        <div className="busqueda-sku-wrapper">
          <input
            type="text"
            className="busqueda-sku-input"
            placeholder="Ingresa SKU, nombre o categoría..."
            value={busquedaSKU}
            onChange={(e) => setBusquedaSKU(e.target.value)}
            onFocus={() => busquedaSKU && setMostraSugerencias(true)}
          />

          {mostraSugerencias && resultadosBusqueda.length > 0 && (
            <div className="busqueda-sku-sugerencias">
              {resultadosBusqueda.slice(0, 8).map((prod) => (
                <div
                  key={prod.id}
                  className="sugerencia-item"
                  onClick={() => seleccionarDelBuscador(prod)}
                >
                  <img
                    src={prod.imagenUrl || imagenDefault}
                    alt={prod.nombre || prod.id}
                    className="sugerencia-img"
                  />
                  <div className="sugerencia-info">
                    <strong>{prod.id}</strong>
                    <p>{prod.nombre}</p>
                    <small>${prod.precio}</small>
                  </div>
                </div>
              ))}
              {resultadosBusqueda.length > 8 && (
                <div className="sugerencia-mas">
                  +{resultadosBusqueda.length - 8} más resultados
                </div>
              )}
            </div>
          )}

          {mostraSugerencias && busquedaSKU && resultadosBusqueda.length === 0 && (
            <div className="busqueda-sku-no-resultados">
              No se encontraron productos
            </div>
          )}
        </div>
      </div>

      {/* FILTROS */}
      <div className="filtros-categorias">
        {["Todos", "Tortas", "Juguetería", "Uso Profesional"].map((cat) => (
          <button
            key={cat}
            className={`btn ${filtro === cat ? "btn-active" : "btn-outline"}`}
            onClick={() => handleCambioFiltro(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Formulario */}
      <div className="form-row formulario">
        <div className="form-column">
          <div className="form-group">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Seleccione categoría</option>
              {categoriasData.map((c) => (
                <option key={c.nombre} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="form-group botones-formulario">
            <button className="btn btn-action" onClick={guardarProducto} disabled={cargando}>
              {cargando ? "Procesando..." : modoEditar ? "Actualizar" : "Agregar"}
            </button>
            <button className="btn btn-cancel" onClick={limpiar}>
              Limpiar
            </button>
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="preview-container">
            <img
              src={imagenVista || imagenDefault}
              alt="Vista previa"
              className="preview-image"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <h3 className="subtitulo">Productos</h3>
      <div className="table-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Destacado</th>
              <th>Oferta</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productosPaginados.map((p) => (
              <tr key={p.id} className={p.oferta ? "fila-oferta" : ""}>
                <td>
                  <img
                    src={p.imagenUrl || imagenDefault}
                    alt={p.nombre || p.id}
                    className="product-image"
                  />
                </td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.categoria}</td>
                <td>{p.cantidad}</td>
                <td>{p.destacado ? "⭐" : "—"}</td>

                <td>
                  {p.oferta ? (
                    <>
                      <strong className="precio-oferta">${p.precioOferta}</strong>
                      <br />
                      <small className="etiqueta-oferta">{p.porcentajeOferta}% OFF</small>
                      <br />
                      <button className="btn btn-action small-btn" onClick={() => editarOferta(p)}>
                        ✏️ Editar Oferta
                      </button>
                    </>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="acciones">
                  <button className="table-btn btn-edit" onClick={() => editarProducto(p)}>
                    ✏️
                  </button>

                  <button className="table-btn btn-delete" onClick={() => eliminarProducto(p.id)}>
                    🗑️
                  </button>

                  <button className="table-btn btn-star" onClick={() => cambioDestacado(p.id, p.destacado)}>
                    {p.destacado ? "⭐" : "☆"}
                  </button>

                  <button className="table-btn btn-offer" onClick={() => cambioOferta(p.id, p.oferta)}>
                    {p.oferta ? "Quitar" : "Oferta"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="paginacion-container">
          <button
            className="btn btn-pagination"
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </button>

          <span className="info-pagina">
            Página {paginaActual} de {totalPaginas} ({productosFiltrados.length} items)
          </span>

          <button
            className="btn btn-pagination"
            onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}