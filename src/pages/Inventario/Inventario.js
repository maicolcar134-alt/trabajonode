
/* =====================================================
   INVENTARIO COMPLETO – VERSION FINAL OPTIMIZADA
   ===================================================== */

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


// =====================================================
// SUBIR IMAGEN
// =====================================================
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


// =====================================================
// COMPONENTE
// =====================================================
export default function Inventario() {
  const [productos, setProductos] = useState([]);

  // Estados del formulario
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

  // Filtro
  const [filtro, setFiltro] = useState("Todos");

  // Modal para editar oferta
  const [modalOferta, setModalOferta] = useState(false);
  const [productoOferta, setProductoOferta] = useState(null);
  const [porcentajeOferta, setPorcentajeOferta] = useState("");
  const [precioOfertaCalculado, setPrecioOfertaCalculado] = useState("");


  // =====================================================
  // Cargar productos
  // =====================================================
  useEffect(() => {
    const refCol = collection(db, "inventario");
    const unsub = onSnapshot(refCol, (snapshot) => {
      const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(lista);
    });

    return () => unsub();
  }, []);


  // =====================================================
  // Limpiar form
  // =====================================================
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


  // =====================================================
  // Manejar archivo de imagen
  // =====================================================
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


  // =====================================================
  // Guardar o actualizar producto
  // =====================================================
  const guardarProducto = async () => {
    if (!nombre || !precio || !descripcion || !categoria || !cantidad) {
      return Swal.fire(
        "Campos incompletos",
        "Completa todos los campos.",
        "warning"
      );
    }

    setCargando(true);

    try {
      let idFinal = idEdit;

      // Crear nuevo
      if (!modoEditar) {
        const refCol = collection(db, "inventario");
        const nuevo = await addDoc(refCol, {
          nombre,
          precio,
          descripcion,
          categoria,
          cantidad: Number(cantidad),
          destacado,
          oferta,
          imagenUrl: imagenVista,
          pathImagen: "",
          creado: serverTimestamp(),
        });

        idFinal = nuevo.id;
      }

      // Editar producto existente
      await updateDoc(doc(db, "inventario", idFinal), {
        nombre,
        precio,
        descripcion,
        categoria,
        cantidad: Number(cantidad),
        destacado,
        oferta,
        imagenUrl: imagenVista,
        fechaActualizacion: serverTimestamp(),
      });

      // Subir imagen comprimida
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
              } catch (error) {
                reject(error);
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
      Swal.fire("Error", "No se pudo guardar", "error");
    } finally {
      setCargando(false);
    }
  };


  // =====================================================
  // Editar producto
  // =====================================================
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
    setImagenVista(p.imagenUrl || imagenDefault);
    setFileImage(null);
  };


  // =====================================================
  // Eliminar producto
  // =====================================================
  const eliminarProducto = async (id, pathImagen) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar?",
      text: "No podrás recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    });

    if (!confirm.isConfirmed) return;

    try {
      if (pathImagen) {
        await deleteObject(storageRef(storage, pathImagen));
      }

      await deleteDoc(doc(db, "inventario", id));

      Swal.fire("Eliminado", "Producto eliminado", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };


  // =====================================================
  // Destacado / Oferta toggle
  // =====================================================
  const cambioDestacado = (id, val) =>
    updateDoc(doc(db, "inventario", id), { destacado: !val });

  const cambioOferta = (id, val) =>
    updateDoc(doc(db, "inventario", id), { oferta: !val });


  // =====================================================
  // Editar Oferta (%)
  // =====================================================
  const editarOferta = (p) => {
    setProductoOferta(p);
    setPorcentajeOferta(p.porcentajeOferta || "");

    if (p.porcentajeOferta) {
      const precioFinal = p.precio - (p.precio * p.porcentajeOferta) / 100;
      setPrecioOfertaCalculado(Math.round(precioFinal));
    } else {
      setPrecioOfertaCalculado("");
    }

    setModalOferta(true);
  };


  const guardarOferta = async () => {
    if (!productoOferta) return;

    if (!porcentajeOferta) {
      return Swal.fire("Error", "Ingresa un porcentaje válido", "warning");
    }

    const porcentajeNum = Number(porcentajeOferta);
    const precioOriginal = Number(productoOferta.precio);

    const precioFinal = Math.round(
      precioOriginal - precioOriginal * (porcentajeNum / 100)
    );

    try {
      await updateDoc(doc(db, "inventario", productoOferta.id), {
        oferta: true,
        porcentajeOferta: porcentajeNum,
        precioOferta: precioFinal,
        fechaActualizacion: serverTimestamp(),
      });

      Swal.fire("Éxito", "Oferta actualizada", "success");
      setModalOferta(false);
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la oferta", "error");
    }
  };


  // =====================================================
  // Filtrado por categoría
  // =====================================================
  const productosFiltrados = productos.filter((p) => {
    if (filtro === "Tortas") return p.categoria === "Tortas";
    if (filtro === "Juguetería") return p.categoria === "Juguetería";
    if (filtro === "Uso Profesional") return p.categoria === "Uso Profesional";
    return true;
  });


  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="inventario-container">
      <h2 className="inventario-title">📦 Inventario</h2>

      {/* FILTROS */}
      <div className="filtros-categorias">
        {["Todos", "Tortas", "Juguetería", "Uso Profesional"].map((cat) => (
          <button
            key={cat}
            className={`btn ${
              filtro === cat ? "btn-active" : "btn-outline"
            }`}
            onClick={() => setFiltro(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FORMULARIO */}
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
              <option>Seleccione categoría</option>
              {categoriasData.map((c, i) => (
                <option key={i}>{c.nombre}</option>
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

        {/* Imagen */}
        <div className="form-column">
          <div className="form-group">
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="preview-container">
            <img src={imagenVista} alt="Vista previa" className="preview-image" />
          </div>
        </div>
      </div>

      {/* TABLA */}
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

                <td>{p.destacado ? "⭐" : "—"}</td>

                <td>
                  {p.oferta ? (
                    <>
                      <strong className="precio-oferta">${p.precioOferta}</strong>
                      <br />
                      <small className="etiqueta-oferta">
                        {p.porcentajeOferta}% OFF
                      </small>
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
                    onClick={() => eliminarProducto(p.id, p.pathImagen)}
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

                  <button
                    className="table-btn btn-offer-edit"
                    onClick={() => editarOferta(p)}
                  >
                    % Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL OFERTA */}
      {modalOferta && (
        <div className="modal-oferta-overlay">
          <div className="modal-oferta">
            <h3>Editar Oferta (%)</h3>

            <label>Porcentaje de descuento</label>
            <input
              type="number"
              className="input"
              value={porcentajeOferta}
              onChange={(e) => {
                const val = e.target.value;
                setPorcentajeOferta(val);

                if (val && productoOferta) {
                  const precioOriginal = Number(productoOferta.precio);
                  const precioFinal = Math.round(
                    precioOriginal - (precioOriginal * val) / 100
                  );
                  setPrecioOfertaCalculado(precioFinal);
                }
              }}
            />

            {precioOfertaCalculado !== "" && (
              <p className="precio-final">
                💰 Precio final: <strong>${precioOfertaCalculado}</strong>
              </p>
            )}

            <div className="modal-buttons">
              <button className="btn btn-success" onClick={guardarOferta}>
                Guardar
              </button>

              <button
                className="btn btn-danger"
                onClick={() => setModalOferta(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
