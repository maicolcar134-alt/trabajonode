import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
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
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Inventario.css";

const categoriasData = [
  { nombre: "Tortas" },
  { nombre: "Juguetería" },
  { nombre: "Uso Profesional" },
];

export default function Inventario() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });
  const [previewLocal, setPreviewLocal] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [activeTab, setActiveTab] = useState("inventario");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(data);
    });
    return () => unsub();
  }, []);

  const uploadImageForSku = async (sku, file) => {
    if (!file) return null;
    const path = `productos/${sku}_${Date.now()}_${file.name}`;
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const docRef = doc(db, "productos", sku);
      await setDoc(
        docRef,
        {
          imagenUrl: url,
          imagenPath: path,
          fechaActualizacion: serverTimestamp(),
        },
        { merge: true }
      );
      return { url, path };
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    }
  };

  const deleteImageForSku = async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto?.imagenUrl) return alert("No hay imagen para eliminar");
    if (!window.confirm("¿Eliminar imagen del producto?")) return;
    try {
      if (producto.imagenPath) {
        await deleteObject(ref(storage, producto.imagenPath));
      }
      await updateDoc(doc(db, "productos", id), {
        imagenUrl: null,
        imagenPath: null,
      });
      alert("Imagen eliminada");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar imagen");
    }
  };

  const abrirEditar = (p = null) => {
    setEditando(p);
    setForm({
      nombre: p?.nombre || "",
      categoria: p?.categoria || "",
      precio: p?.precio || "",
      stock: p?.stock || "",
    });
    setPreviewLocal(p?.imagenUrl || null);
    setShowModal(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.categoria)
      return Swal.fire("⚠️", "Completa todos los campos", "warning");

    const payload = {
      nombre: form.nombre,
      categoria: form.categoria,
      precio: Number(form.precio),
      stock: Number(form.stock),
      fechaActualizacion: serverTimestamp(),
      destacado: editando?.destacado || false,
      mensajeDestacado: editando?.mensajeDestacado || "",
    };

    try {
      if (editando) {
        await updateDoc(doc(db, "productos", editando.id), payload);
      } else {
        await addDoc(collection(db, "productos"), payload);
      }
      Swal.fire("✅", "Producto guardado correctamente", "success");
      setShowModal(false);
      setEditando(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error al guardar producto", "error");
    }
  };

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

  const toggleDestacado = async (producto) => {
    try {
      if (!producto.destacado) {
        const { value: mensaje } = await Swal.fire({
          title: "⭐ Marcar como destacado",
          input: "text",
          inputLabel: "Escribe un mensaje para este producto",
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
          Swal.fire(
            "✅ ¡Producto destacado!",
            "💫 Mensaje agregado correctamente.",
            "success"
          );
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

  const copiarTodo = () => {
    const texto = productos
      .map((p) => {
        let info = `📦 ${p.nombre}\nCategoría: ${p.categoria}\nPrecio: $${p.precio}\nStock: ${p.stock}`;
        if (p.destacado && p.mensajeDestacado) {
          info += `\n⭐ ${p.mensajeDestacado}`;
        }
        return info;
      })
      .join("\n----------------------\n");
    navigator.clipboard.writeText(texto);
    Swal.fire(
      "📋 Copiado",
      "Información copiada con los mensajes destacados incluidos.",
      "success"
    );
  };

  const duplicarProducto = async (producto) => {
    try {
      const nuevo = { ...producto };
      delete nuevo.id;
      nuevo.nombre = `${producto.nombre} (copia)`;
      nuevo.fechaActualizacion = serverTimestamp();
      await addDoc(collection(db, "productos"), nuevo);
      Swal.fire("✅", "Producto duplicado correctamente", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo duplicar el producto", "error");
    }
  };

  return (
    <div className="inventario-root" style={{ padding: 20 }}>
      
      {/* 📦 Inventario General */}
      {activeTab === "inventario" && (
        <>
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

          <div className="inventario-grid">
            {productosFiltrados.map((p) => (
              <div
                key={p.id}
                className={`producto-card ${p.destacado ? "destacado" : ""}`}
              >
                {p.imagenUrl ? (
                  <img
                    src={p.imagenUrl}
                    alt={p.nombre}
                    className="producto-imagen"
                  />
                ) : (
                  <div className="producto-imagen placeholder">Sin imagen</div>
                )}
                <div className="producto-body">
                  <h3>
                    {p.nombre}{" "}
                    {p.destacado && <span style={{ color: "gold" }}>⭐</span>}
                  </h3>

                  {p.destacado && p.mensajeDestacado && (
                    <div
                      style={{
                        backgroundColor: "#fff8dc",
                        border: "2px solid gold",
                        borderRadius: "8px",
                        padding: "6px",
                        marginTop: "6px",
                        color: "#b8860b",
                        fontStyle: "italic",
                        fontWeight: "500",
                        boxShadow: "0 0 6px rgba(255, 215, 0, 0.4)",
                      }}
                    >
                      💬 {p.mensajeDestacado}
                    </div>
                  )}

                  <p>Categoría: {p.categoria}</p>
                  <p>Precio: ${p.precio?.toLocaleString()}</p>
                  <p>Stock: {p.stock}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadImageForSku(p.id, e.target.files[0])
                      }
                    />
                    {p.imagenUrl && (
                      <button
                        className="btn-eliminar"
                        onClick={() => deleteImageForSku(p.id)}
                      >
                        Eliminar imagen
                      </button>
                    )}
                    <button
                      className="btn-editar"
                      onClick={() => abrirEditar(p)}
                    >
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 📋 Pestaña Copiar Información */}
      {activeTab === "copiar" && (
        <div style={{ marginTop: 20 }}>
          <h2>📋 Copiar Información</h2>
          <p>
            Aquí puedes copiar toda la información de los productos o duplicar
            uno existente.
          </p>
          <button
            onClick={copiarTodo}
            style={{
              background: "#007bff",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            📑 Copiar Todo
          </button>

          <div className="inventario-grid">
            {productos.map((p) => (
              <div
                key={p.id}
                className={`producto-card ${p.destacado ? "destacado" : ""}`}
              >
                <h3>
                  {p.nombre}{" "}
                  {p.destacado && <span style={{ color: "gold" }}>⭐</span>}
                </h3>
                <p>Categoría: {p.categoria}</p>
                <p>Precio: ${p.precio}</p>
                <p>Stock: {p.stock}</p>

                {p.destacado && p.mensajeDestacado && (
                  <div
                    style={{
                      backgroundColor: "#fff8dc",
                      border: "2px solid gold",
                      borderRadius: "8px",
                      padding: "6px",
                      marginTop: "6px",
                      color: "#b8860b",
                      fontStyle: "italic",
                      fontWeight: "500",
                    }}
                  >
                    💬 {p.mensajeDestacado}
                  </div>
                )}

                <button
                  onClick={() => duplicarProducto(p)}
                  className="btn-editar"
                  style={{ marginTop: "10px" }}
                >
                  📄 Duplicar Producto
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📝 Modal de creación/edición */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "420px",
              maxWidth: "90%",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            }}
          >
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
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
              <label>Categoría:</label>
              <select
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                required
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
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
                min="0"
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
              <label>Stock:</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
                min="0"
                style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
              />

              <label>Imagen:</label>
              {previewLocal && (
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "10px",
                    position: "relative",
                  }}
                >
                  <img
                    src={previewLocal}
                    alt="Vista previa"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #ccc",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewLocal(null);
                      if (editando?.id) deleteImageForSku(editando.id);
                    }}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "35%",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "25px",
                      height: "25px",
                      cursor: "pointer",
                    }}
                  >
                    ✖
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setPreviewLocal(ev.target.result);
                    reader.readAsDataURL(file);
                    if (editando?.id) {
                      await uploadImageForSku(editando.id, file);
                      Swal.fire(
                        "✅",
                        "Imagen actualizada correctamente",
                        "success"
                      );
                    }
                  }
                }}
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  💾 Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
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
