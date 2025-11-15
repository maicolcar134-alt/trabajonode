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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebaseConfig";
import Swal from "sweetalert2";
import "./Inventario.css";

const categoriasData = [
  { nombre: "Tortas" },
  { nombre: "Juguetería" },
  { nombre: "Uso Profesional" },
];

// Imagen por defecto pública
const imagenDefault =
  "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTeo-HU5cWit5l0RBtsCZ8dNJxan73EBnXLzcXkLM0wnegrW4bgq";

// --- Helper: redimensionar y comprimir imagen en cliente ---
// Recibe File, maxWidth, maxHeight, quality (0..1)
// Devuelve Blob listo para subir
async function resizeAndCompressImage(
  file,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
) {
  // crear ImageBitmap (más rápido)
  const imageBitmap = await createImageBitmap(file);

  // calcular tamaño objetivo manteniendo proporción
  let { width, height } = imageBitmap;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1); // no agrandar
  const targetWidth = Math.round(width * ratio);
  const targetHeight = Math.round(height * ratio);

  // canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  // dibujar
  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  // convertir a blob jpeg (si file.type es png y quieres mantener transparencia, podrías usar png; aquí preferimos jpeg para compresión)
  // si la imagen original tiene transparencia y es PNG, aún así la convertimos a jpeg para reducir peso (si quieres mantener transparencia, cambia a 'image/png' y quality no aplicará)
  const mime = "image/jpeg";
  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), mime, quality)
  );

  // liberar ImageBitmap
  imageBitmap.close();

  return blob;
}

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    porcentajeOferta: 0,
    file: null, // File original (no el blob comprimido)
  });
  const [previewLocal, setPreviewLocal] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Cargar productos en tiempo real (incluye imagenUrl si ya existe en Firestore)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(data);
    });
    return () => unsub();
  }, []);

  // Eliminar producto e imagen asociada
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto del inventario?")) return;
    try {
      const p = productos.find((x) => x.id === id);
      if (p?.imagenPath) {
        await deleteObject(ref(storage, p.imagenPath)).catch(() => {});
      }
      await deleteDoc(doc(db, "productos", id));
      Swal.fire("✅", "Producto eliminado", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error eliminando producto", "error");
    }
  };

  // Abrir modal para nuevo/editar
  const abrirEditar = (p = null) => {
    setEditando(p);
    setForm({
      nombre: p?.nombre || "",
      categoria: p?.categoria || "",
      precio: p?.precio || "",
      stock: p?.stock || "",
      porcentajeOferta: p?.porcentajeOferta || 0,
      file: null,
    });
    setPreviewLocal(p?.imagenUrl || null);
    setShowModal(true);
  };

  // Guardar producto (con manejo completo de imagen y compresión)
  const guardarProducto = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.categoria)
      return Swal.fire("⚠️", "Completa todos los campos", "warning");

    try {
      let idProducto = editando ? editando.id : null;

      // Datos base del producto
      const payload = {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0,
        fechaActualizacion: serverTimestamp(),
        destacado: editando?.destacado || false,
        mensajeDestacado: editando?.mensajeDestacado || "",
        enOferta: form.porcentajeOferta > 0,
        porcentajeOferta: Number(form.porcentajeOferta) || 0,
        mensajeOferta: editando?.mensajeOferta || "",
      };

      // Crear o actualizar documento base (sin imagen aún)
      if (editando) {
        await updateDoc(doc(db, "productos", idProducto), payload);
      } else {
        const nuevo = await addDoc(collection(db, "productos"), payload);
        idProducto = nuevo.id;
      }

      // Manejo de imagen
      let urlFinal = editando?.imagenUrl || imagenDefault;
      let pathFinal = editando?.imagenPath || "";

      // Si se seleccionó archivo nuevo
      if (form.file) {
        // Validaciones del archivo
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(form.file.type)) {
          return Swal.fire(
            "Formato no permitido",
            "Sube JPEG/PNG/WEBP",
            "warning"
          );
        }

        // Intentar comprimir/resizar
        try {
          // Ajustes de compresión
          const MAX_DIMENSION = 1600; // px
          const QUALITY = 0.8; // 0..1

          const compressedBlob = await resizeAndCompressImage(
            form.file,
            MAX_DIMENSION,
            MAX_DIMENSION,
            QUALITY
          );

          // Compruebo tamaño y si sigue muy grande, intento bajar calidad
          let finalBlob = compressedBlob;
          const MAX_BYTES = 1_500_000; // 1.5 MB
          if (finalBlob.size > MAX_BYTES) {
            // recalcular con calidad menor
            const lowerQuality = 0.6;
            finalBlob = await resizeAndCompressImage(
              form.file,
              MAX_DIMENSION,
              MAX_DIMENSION,
              lowerQuality
            );
          }

          // Si existía path anterior, eliminarla
          if (pathFinal) {
            await deleteObject(ref(storage, pathFinal)).catch(() => {});
          }

          // Subir Blob (convertir a File para mantener nombre)
          const archivo = new File(
            [finalBlob],
            form.file.name.replace(/\s+/g, "_"),
            {
              type: finalBlob.type || "image/jpeg",
            }
          );

          const newPath = `productos/${idProducto}_${Date.now()}_${
            archivo.name
          }`;
          const storageRef = ref(storage, newPath);

          await uploadBytes(storageRef, archivo);

          urlFinal = await getDownloadURL(storageRef);
          pathFinal = newPath;
        } catch (imgErr) {
          console.warn("Error comprimiendo/subiendo imagen:", imgErr);
          // Como fallback intenta subir el file original
          try {
            if (pathFinal) {
              await deleteObject(ref(storage, pathFinal)).catch(() => {});
            }
            const archivoOriginal = form.file;
            const newPath = `productos/${idProducto}_${Date.now()}_${
              archivoOriginal.name
            }`;
            const storageRef = ref(storage, newPath);
            await uploadBytes(storageRef, archivoOriginal);
            urlFinal = await getDownloadURL(storageRef);
            pathFinal = newPath;
          } catch (subErr) {
            console.error("No se pudo subir la imagen:", subErr);
            // seguimos, pero mantenemos imagenDefault o la anterior
          }
        }
      }

      // Actualizar Firestore con la imagen final
      await updateDoc(doc(db, "productos", idProducto), {
        imagenUrl: urlFinal,
        imagenPath: pathFinal || "imagenes/default_image.jpeg",
      });

      Swal.fire("✅", "Producto guardado correctamente", "success");

      // Reiniciar estado y formulario
      setShowModal(false);
      setEditando(null);
      setPreviewLocal(null);
      setForm({
        nombre: "",
        categoria: "",
        precio: "",
        stock: "",
        porcentajeOferta: 0,
        file: null,
      });
    } catch (error) {
      console.error(error);
      Swal.fire("❌ Error", "No se pudo guardar el producto", "error");
    }
  };

  // Activar/desactivar oferta
  const toggleOferta = async (producto) => {
    try {
      if (!producto.enOferta) {
        const { value: descuento } = await Swal.fire({
          title: "🔥 Activar oferta",
          input: "number",
          inputLabel: "Porcentaje de descuento (0-100)",
          inputAttributes: { min: 1, max: 100, step: 1 },
          showCancelButton: true,
          confirmButtonText: "Siguiente ➡️",
        });
        if (!descuento) return;

        const { value: mensajeOferta } = await Swal.fire({
          title: "📝 Mensaje de oferta",
          input: "text",
          inputLabel: "Texto promocional del producto",
          inputPlaceholder:
            "Ejemplo: ¡Aprovecha esta oferta por tiempo limitado!",
          showCancelButton: true,
          confirmButtonText: "Aplicar oferta",
        });

        await updateDoc(doc(db, "productos", producto.id), {
          enOferta: true,
          porcentajeOferta: Number(descuento),
          mensajeOferta:
            mensajeOferta ||
            "🔥 ¡Aprovecha esta oferta especial por tiempo limitado! 🔥",
        });

        Swal.fire("✅", "Oferta activada correctamente", "success");
      } else {
        await updateDoc(doc(db, "productos", producto.id), {
          enOferta: false,
          porcentajeOferta: 0,
          mensajeOferta: "",
        });
        Swal.fire("❌", "Oferta desactivada", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar la oferta", "error");
    }
  };

  // Toggle destacado
  const toggleDestacado = async (producto) => {
    try {
      if (!producto.destacado) {
        const { value: mensaje } = await Swal.fire({
          title: "⭐ Marcar como destacado",
          input: "text",
          inputLabel: "Mensaje para producto destacado",
          inputPlaceholder:
            "Este producto es más importante y se ha agregado a destacados.",
          showCancelButton: true,
          confirmButtonText: "Guardar",
        });
        if (mensaje !== undefined) {
          await updateDoc(doc(db, "productos", producto.id), {
            destacado: true,
            mensajeDestacado:
              mensaje ||
              "Este producto es más importante y se ha agregado a destacados.",
          });
          Swal.fire("✅ ¡Producto destacado!", "", "success");
        }
      } else {
        await updateDoc(doc(db, "productos", producto.id), {
          destacado: false,
          mensajeDestacado: "",
        });
        Swal.fire("❌", "Producto quitado de destacados", "info");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
    }
  };

  const productosFiltrados = productos
    .filter(
      (p) =>
        (!filtroCategoria || p.categoria === filtroCategoria) &&
        (!filtroBusqueda ||
          p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
    )
    .sort((a, b) => (b.destacado === true) - (a.destacado === true));

  return (
    <div className="inventario-root" style={{ padding: 20 }}>
      <h1>📦 Inventario General</h1>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
          style={{ padding: 8 }}
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">Todas las categorías</option>
          {categoriasData.map((c, i) => (
            <option key={i} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
        <button onClick={() => abrirEditar()} className="btn-agregar">
          ➕ Nuevo Producto
        </button>
      </div>

      {/* Lista de productos */}
      <div className="inventario-grid" style={{ marginTop: 16 }}>
        {productosFiltrados.map((p) => {
          const precioFinal = p.enOferta
            ? p.precio - (p.precio * p.porcentajeOferta) / 100
            : p.precio;

          return (
            <div
              key={p.id}
              className={`producto-card ${p.destacado ? "destacado" : ""}`}
            >
              {/* Imagen con auto-resize */}
              <img
                src={p.imagenUrl || imagenDefault}
                alt={p.nombre}
                className="producto-imagen"
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "contain",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
              />

              <div className="producto-body">
                <h3>
                  {p.nombre}{" "}
                  {p.destacado && <span style={{ color: "gold" }}>⭐</span>}
                  {p.enOferta && (
                    <span style={{ color: "red", marginLeft: "8px" }}>🔥</span>
                  )}
                </h3>

                <p>Categoría: {p.categoria}</p>

                {p.enOferta ? (
                  <>
                    <p>
                      Precio original:{" "}
                      <span style={{ textDecoration: "line-through" }}>
                        ${p.precio?.toLocaleString()}
                      </span>
                    </p>
                    <p>
                      🔥 {p.porcentajeOferta}% OFF →{" "}
                      <b>${precioFinal.toLocaleString()}</b>
                    </p>
                    {p.mensajeOferta && (
                      <p style={{ fontStyle: "italic", color: "#d63384" }}>
                        {p.mensajeOferta}
                      </p>
                    )}
                  </>
                ) : (
                  <p>Precio: ${p.precio?.toLocaleString()}</p>
                )}

                <p>Stock: {p.stock}</p>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="btn-editar" onClick={() => abrirEditar(p)}>
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarProducto(p.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn-destacar"
                    style={{
                      backgroundColor: p.destacado ? "gold" : "#555",
                      color: p.destacado ? "black" : "white",
                    }}
                    onClick={() => toggleDestacado(p)}
                  >
                    {p.destacado ? "⭐ Quitar Destacado" : "⭐ Destacar"}
                  </button>
                  <button
                    className="btn-oferta"
                    style={{
                      backgroundColor: p.enOferta ? "red" : "#007bff",
                      color: "white",
                    }}
                    onClick={() => toggleOferta(p)}
                  >
                    {p.enOferta ? "❌ Quitar Oferta" : "🔥 Activar Oferta"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
              {editando ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
            </h2>

            <form onSubmit={guardarProducto}>
              <label>Nombre:</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />

              <label>Categoría:</label>
              <select
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                required
              >
                <option value="">Seleccionar categoría</option>
                {categoriasData.map((c, i) => (
                  <option key={i} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              <label>Precio:</label>
              <input
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                required
              />

              <label>Stock:</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />

              <label>Porcentaje de oferta (%):</label>
              <input
                type="number"
                value={form.porcentajeOferta}
                onChange={(e) =>
                  setForm({ ...form, porcentajeOferta: e.target.value })
                }
              />

              {/* Vista previa con auto-size */}
              <label>Imagen del producto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Validación rápida de tipo y tamaño bruto (antes de comprimir)
                    const allowed = ["image/jpeg", "image/png", "image/webp"];
                    if (!allowed.includes(file.type)) {
                      Swal.fire(
                        "Formato no permitido",
                        "Usa .jpg, .png o .webp",
                        "warning"
                      );
                      return;
                    }
                    // opcional: límite bruto (por ejemplo 8MB)
                    const MAX_RAW_MB = 8;
                    if (file.size > MAX_RAW_MB * 1024 * 1024) {
                      Swal.fire(
                        "Archivo demasiado grande",
                        `Máx ${MAX_RAW_MB} MB`,
                        "warning"
                      );
                      return;
                    }

                    setPreviewLocal(URL.createObjectURL(file));
                    setForm({ ...form, file });
                  }
                }}
              />

              {previewLocal && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={previewLocal}
                    alt="Vista previa"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: "15px",
                      objectFit: "contain",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="btn-guardar">
                  💾 Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPreviewLocal(null);
                    setForm({
                      nombre: "",
                      categoria: "",
                      precio: "",
                      stock: "",
                      porcentajeOferta: 0,
                      file: null,
                    });
                  }}
                  className="btn-cancelar"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
