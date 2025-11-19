// src/components/Inventario.js
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
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Compressor from "compressorjs";
import { db, storage } from "../../firebaseConfig";
import Swal from "sweetalert2";
import "./Inventario.css";

const categoriasData = [
  { nombre: "Tortas" },
  { nombre: "Juguetería" },
  { nombre: "Uso Profesional" },
];

const imagenDefault = "/placeholder";

// Subir imagen a Firebase
async function subirImagenFirebase(file, idProductoReal) {
  try {
    const nombreLimpio = file.name.replace(/\s+/g, "_");
    const path = `productos/${idProductoReal}_${Date.now()}_${nombreLimpio}`;
    const ref = storageRef(storage, path);

    await uploadBytes(ref, file);

    const url = await getDownloadURL(ref);
    return { url, path };
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    Swal.fire("Error", "No se pudo subir la imagen.", "error");
    return { url: imagenDefault, path: "" };
  }
}

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [categorias] = useState(categoriasData);

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

  const [cargando, setCargando] = useState(false);

  const [filtro, setFiltro] = useState("todos");

  // Cargar productos en tiempo real
  useEffect(() => {
    const refCol = collection(db, "inventario");
    const unsub = onSnapshot(refCol, (snapshot) => {
      const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(lista);
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
    setFileImage(null);
    setModoEditar(false);
    setIdEdit("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return Swal.fire(
        "Formato no permitido",
        "Solo JPG, PNG o WEBP",
        "warning"
      );
    }
    if (file.size > 8 * 1024 * 1024) {
      return Swal.fire("Archivo muy grande", "Máximo 8 MB", "warning");
    }

    setFileImage(file);
    setImagenVista(URL.createObjectURL(file));
  };

  const guardarProducto = async () => {
    if (!nombre || !precio || !descripcion || !categoria || !cantidad) {
      return Swal.fire(
        "Campos incompletos",
        "Llena todos los campos.",
        "warning"
      );
    }

    setCargando(true);

    try {
      let idFinal = idEdit;

      if (!modoEditar) {
        const refCol = collection(db, "inventario");
        const nuevoDoc = await addDoc(refCol, {
          nombre,
          precio,
          descripcion,
          categoria,
          cantidad: Number(cantidad),
          imagenUrl: imagenDefault,
          pathImagen: "",
          destacado,
          oferta,
          creado: serverTimestamp(),
        });
        idFinal = nuevoDoc.id;
      }

      await updateDoc(doc(db, "inventario", idFinal), {
        nombre,
        precio,
        descripcion,
        categoria,
        cantidad: Number(cantidad),
        destacado,
        oferta,
        fechaActualizacion: serverTimestamp(),
      });

      if (fileImage) {
        await new Promise((resolve, reject) => {
          new Compressor(fileImage, {
            quality: 0.7,
            maxWidth: 1200,
            maxHeight: 1200,
            success: async (compressedFile) => {
              try {
                const subida = await subirImagenFirebase(
                  compressedFile,
                  idFinal
                );
                await updateDoc(doc(db, "inventario", idFinal), {
                  imagenUrl: subida.url,
                  pathImagen: subida.path,
                });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            error(err) {
              reject(err);
            },
          });
        });
      }

      Swal.fire(
        "Éxito",
        modoEditar ? "Producto actualizado" : "Producto agregado",
        "success"
      );
      limpiar();
    } catch (error) {
      console.error("Error guardando:", error);
      Swal.fire("Error", "No se pudo guardar el producto.", "error");
    } finally {
      setCargando(false);
    }
  };

  const editarProducto = (p) => {
    setModoEditar(true);
    setIdEdit(p.id);
    setNombre(p.nombre || "");
    setPrecio(p.precio || "");
    setDescripcion(p.descripcion || "");
    setCategoria(p.categoria || "");
    setCantidad(p.cantidad || "");
    setDestacado(p.destacado || false);
    setOferta(p.oferta || false);
    setImagenVista(p.imagenUrl || imagenDefault);
    setFileImage(null);
  };

  const eliminarProducto = async (id, pathImagen) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });
    if (!confirm.isConfirmed) return;

    setCargando(true);
    try {
      if (pathImagen) await deleteObject(storageRef(storage, pathImagen));
      await deleteDoc(doc(db, "inventario", id));
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    } finally {
      setCargando(false);
    }
  };

  const cambioDestacado = async (id, currentValue) => {
    try {
      await updateDoc(doc(db, "inventario", id), { destacado: !currentValue });
    } catch (err) {
      Swal.fire("Error", "No se pudo cambiar destacado.", "error");
    }
  };

  const cambioOferta = async (id, currentValue) => {
    try {
      await updateDoc(doc(db, "inventario", id), { oferta: !currentValue });
    } catch (err) {
      Swal.fire("Error", "No se pudo cambiar oferta.", "error");
    }
  };

  const actualizarStock = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 0)
      return Swal.fire("Cantidad inválida", "No puede ser negativa", "warning");
    try {
      await updateDoc(doc(db, "inventario", id), { cantidad: nuevaCantidad });
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar la cantidad.", "error");
    }
  };

  const productosFiltrados = productos.filter((p) => {
    if (filtro === "destacados") return p.destacado;
    if (filtro === "oferta") return p.oferta;
    return true;
  });

  return (
    <div className="inventario-container">
      <h2 className="inventario-title">📦 Panel Admin — Inventario</h2>

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
              {categorias.map((c, i) => (
                <option key={i} value={c.nombre}>
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

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn"
              onClick={guardarProducto}
              disabled={cargando}
            >
              {cargando
                ? "Procesando..."
                : modoEditar
                ? "Actualizar"
                : "Agregar"}
            </button>
            <button
              className="btn btn-danger"
              onClick={limpiar}
              disabled={cargando}
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="form-column" style={{ minWidth: 260 }}>
          <div className="form-group">
            <label>Imagen</label>
            <input
              type="file"
              accept="imagen/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="preview-container">
            <img
              src={imagenVista}
              alt="Vista previa"
              className="preview-image"
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Filtrar: </label>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="destacados">Destacados</option>
          <option value="oferta">Oferta</option>
        </select>
      </div>

      <h3 className="subtitulo">Lista de Productos</h3>
      <div className="table-container">
        <table>
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
              <tr key={p.id}>
                <td>
                  <img
                    src={p.imagenUrl || imagenDefault}
                    alt={p.nombre}
                    className="product-image"
                  />
                </td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.categoria}</td>
                <td>{p.cantidad}</td>
                <td>{p.destacado ? "Sí" : "—"}</td>
                <td>{p.oferta ? "Sí" : "—"}</td>
                <td>
                  <button
                    className="table-btn btn-edit"
                    onClick={() => editarProducto(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-btn btn-delete"
                    onClick={() => eliminarProducto(p.id, p.pathImagen)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="table-btn btn-edit"
                    onClick={() => cambioDestacado(p.id, p.destacado)}
                  >
                    {p.destacado ? "Quitar" : "Destacar"}
                  </button>
                  <button
                    className="table-btn btn-edit"
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
