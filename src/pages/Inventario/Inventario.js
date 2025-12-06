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
import { db, storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Swal from "sweetalert2";
import Compressor from "compressorjs";
import "./Inventario.css";

/* ===========================
   SUBIR IMAGEN A FIREBASE STORAGE
   =========================== */
const subirImagenFirebase = async (file) => {
  try {
    // Comprimir antes de subir
    const compressed = await new Promise((res, rej) => {
      new Compressor(file, {
        quality: 0.7,
        maxWidth: 1200,
        maxHeight: 1200,
        success: res,
        error: rej,
      });
    });

    // Crear referencia con timestamp y nombre original
    const timestamp = Date.now();
    const nombreArchivo = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `inventario/${nombreArchivo}`);

    console.log(`📤 Subiendo imagen a Firebase: inventario/${nombreArchivo}`);

    // Subir archivo comprimido
    const snapshot = await uploadBytes(storageRef, compressed);
    console.log("✅ Archivo subido a:", snapshot.ref.fullPath);

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("✅ URL de descarga:", downloadURL);

    return {
      secure_url: downloadURL,
      public_id: snapshot.ref.fullPath, // Guardar la ruta para poder eliminar después
      nombre_archivo: nombreArchivo,
    };
  } catch (error) {
    console.error("❌ Error subiendo imagen a Firebase:", error);
    return null;
  }
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

  /* Cargar productos en tiempo real */
  useEffect(() => {
    const refCol = collection(db, "inventario");
    const unsub = onSnapshot(refCol, (snap) => {
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

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

      // Si hay un archivo nuevo, subir a Firebase Storage
      if (fileImage) {
        const subida = await subirImagenFirebase(fileImage);
        if (!subida || !subida.secure_url) {
          setCargando(false);
          return Swal.fire(
            "Error al subir imagen",
            "No se pudo subir la imagen a Firebase. Verifica tu conexión.",
            "error"
          );
        }

        imagenFinal = subida.secure_url;
        publicId = subida.public_id || "";

        // Si estamos editando y hay una imagen anterior, eliminarla de Firebase
        if (modoEditar && imagenUrl && publicIdImage) {
          try {
            const oldRef = ref(storage, publicIdImage);
            await deleteObject(oldRef);
            console.log("🗑️ Imagen anterior eliminada de Firebase");
          } catch (err) {
            console.warn("⚠️ No se pudo eliminar imagen anterior:", err);
          }
        }
      } else if (modoEditar && imagenUrl) {
        // En edición, si no hay nuevo archivo, mantener la imagen anterior
        imagenFinal = imagenUrl;
      }

      // Garantizar que imagenFinal nunca sea string vacío
      if (!imagenFinal || imagenFinal.trim() === "") {
        imagenFinal = imagenDefault;
      }

      if (!modoEditar) {
        // Crear documento usando la URL definitiva (si la hay)
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
        // Edición: actualizar campos principales
        await updateDoc(doc(db, "inventario", idFinal), {
          nombre,
          precio: Number(precio),
          descripcion,
          categoria,
          cantidad: Number(cantidad),
          destacado,
          oferta,
        });

        // Siempre actualizar la imagen (bien sea nueva o la anterior)
        await updateDoc(doc(db, "inventario", idFinal), {
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
      Swal.fire("Error", "No se pudo guardar", "error");
    }

    setCargando(false);
  };

  /* Editar */
  const editarProducto = (p) => {
    setModoEditar(true);
    setIdEdit(p.id);
    setNombre(p.nombre);
    setPrecio(p.precio);
    setDescripcion(p.descripcion);
    setCategoria(p.categoria);
    setCantidad(p.cantidad);
    setDestacado(p.destacado);
    setOferta(p.oferta);
    setImagenVista(p.imagenUrl);
    setImagenUrl(p.imagenUrl); // Guardar URL anterior para usar en edición
    setPublicIdImage(p.publicId);
  };

  /* Eliminar */
  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar?",
      text: "No podrás recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (!confirm.isConfirmed) return;

    await deleteDoc(doc(db, "inventario", id));
    Swal.fire("Eliminado", "Producto eliminado", "success");
  };

  /* Cambiar destacado */
  const cambioDestacado = async (id, val) => {
    await updateDoc(doc(db, "inventario", id), {
      destacado: !val,
    });
  };

  /* Activar/desactivar oferta */
  const cambioOferta = async (id, val) => {
    await updateDoc(doc(db, "inventario", id), {
      oferta: !val,
    });
  };

  /* =====================================
     🚀 EDITAR OFERTA — NUEVO
     ===================================== */
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

    if (!porcentaje) return;

    const precioFinal = Math.round(p.precio - (p.precio * porcentaje) / 100);

    await updateDoc(doc(db, "inventario", p.id), {
      porcentajeOferta: Number(porcentaje),
      precioOferta: precioFinal,
      oferta: true,
    });

    Swal.fire("Actualizado", "Oferta modificada", "success");
  };

  const productosFiltrados = productos.filter((p) => {
    if (filtro === "Tortas") return p.categoria === "Tortas";
    if (filtro === "Juguetería") return p.categoria === "Juguetería";
    if (filtro === "Uso Profesional") return p.categoria === "Uso Profesional";
    return true;
  });

  return (
    <div className="inventario-container">
      <h2 className="inventario-title">📦 Inventario</h2>

      {/* Filtros */}
      <div className="filtros-categorias">
        {["Todos", "Tortas", "Juguetería", "Uso Profesional"].map((cat) => (
          <button
            key={cat}
            className={`btn ${filtro === cat ? "btn-active" : "btn-outline"}`}
            onClick={() => setFiltro(cat)}
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
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
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
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="form-group botones-formulario">
            <button
              className="btn btn-action"
              onClick={guardarProducto}
              disabled={cargando}
            >
              {cargando
                ? "Procesando..."
                : modoEditar
                ? "Actualizar"
                : "Agregar"}
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
            {productosFiltrados.map((p) => (
              <tr key={p.id} className={p.oferta ? "fila-oferta" : ""}>
                <td>
                  <img src={p.imagenUrl} className="product-image" />
                </td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.categoria}</td>
                <td>{p.cantidad}</td>
                <td>{p.destacado ? "⭐" : "—"}</td>

                {/* COLUMNA OFERTA - MODIFICADA */}
                <td>
                  {p.oferta ? (
                    <>
                      <strong className="precio-oferta">
                        ${p.precioOferta}
                      </strong>
                      <br />
                      <small className="etiqueta-oferta">
                        {p.porcentajeOferta}% OFF
                      </small>

                      {/* BOTÓN NUEVO */}
                      <br />
                      <button
                        className="btn btn-action small-btn"
                        onClick={() => editarOferta(p)}
                      >
                        ✏️ Editar Oferta
                      </button>
                    </>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="acciones">
                  <button
                    className="table-btn btn-edit"
                    onClick={() => editarProducto(p)}
                  >
                    ✏️
                  </button>

                  <button
                    className="table-btn btn-delete"
                    onClick={() => eliminarProducto(p.id)}
                  >
                    🗑️
                  </button>

                  <button
                    className="table-btn btn-star"
                    onClick={() => cambioDestacado(p.id, p.destacado)}
                  >
                    {p.destacado ? "⭐" : "☆"}
                  </button>

                  <button
                    className="table-btn btn-offer"
                    onClick={() => cambioOferta(p.id, p.oferta)}
                  >
                    {p.oferta ? "Quitar" : "Oferta"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
