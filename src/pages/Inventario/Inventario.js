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
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom"; // 👈 agregado
import "./Inventario.css";

const categoriasData = [
  { nombre: "Tortas" },
  { nombre: "Juguetería" },
  { nombre: "Pirotecnia de Escenario" },
  { nombre: "Uso Profesional" },
];

export default function Inventario() {
  const navigate = useNavigate(); // 👈 necesario para redirigir
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", categoria: "", precio: "", stock: "" });
  const [previewLocal, setPreviewLocal] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(data);
    });
    return () => unsub();
  }, []);

  const uploadImageForSku = async (sku, file) => {
    if (!file) return null;
    setFileUploading(true);
    const path = `productos/${sku}_${Date.now()}_${file.name}`;
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const docRef = doc(db, "productos", sku);
      await setDoc(
        docRef,
        { imagenUrl: url, imagenPath: path, fechaActualizacion: serverTimestamp() },
        { merge: true }
      );
      setFileUploading(false);
      return { url, path };
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setFileUploading(false);
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
      await updateDoc(doc(db, "productos", id), { imagenUrl: null, imagenPath: null });
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
    if (!form.nombre || !form.categoria) return alert("Completa todos los campos");
    const payload = {
      nombre: form.nombre,
      categoria: form.categoria,
      precio: Number(form.precio),
      stock: Number(form.stock),
      fechaActualizacion: serverTimestamp(),
    };

    try {
      if (editando) {
        await updateDoc(doc(db, "productos", editando.id), payload);
      } else {
        await addDoc(collection(db, "productos"), payload);
      }
      alert("Producto guardado correctamente");
      setShowModal(false);
      setEditando(null);
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto");
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
      alert("Producto eliminado");
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto");
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      (!filtroCategoria || p.categoria === filtroCategoria) &&
      (!filtroBusqueda || p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  return (
    <div className="inventario-root" style={{ padding: 20 }}>
      {/* 🔙 Botón Volver al Admin */}
      <button
        onClick={() => navigate("/admin")} // 👈 cambia "/admin" por tu ruta del panel admin
        className="btn-volver-admin"
        style={{
          backgroundColor: "#333",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        🔙 Volver al Admin
      </button>

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
          <div key={p.id} className="producto-card">
            {p.imagenUrl ? (
              <img src={p.imagenUrl} alt={p.nombre} className="producto-imagen" />
            ) : (
              <div className="producto-imagen placeholder">Sin imagen</div>
            )}
            <div className="producto-body">
              <h3>{p.nombre}</h3>
              <p>Categoría: {p.categoria}</p>
              <p>Precio: ${p.precio?.toLocaleString()}</p>
              <p>Stock: {p.stock}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadImageForSku(p.id, e.target.files[0])}
                />
                {p.imagenUrl && (
                  <button className="btn-eliminar" onClick={() => deleteImageForSku(p.id)}>
                    Eliminar imagen
                  </button>
                )}
                <button className="btn-editar" onClick={() => abrirEditar(p)}>
                  Editar
                </button>
                <button className="btn-eliminar" onClick={() => eliminarProducto(p.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editando ? "Editar Producto" : "Nuevo Producto"}</h3>
            <form onSubmit={guardarProducto}>
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                required
              >
                <option value="">Selecciona categoría</option>
                {categoriasData.map((c, i) => (
                  <option key={i} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Precio"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
              {previewLocal && (
                <img
                  src={previewLocal}
                  alt="Preview"
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                />
              )}
              <div style={{ marginTop: 8 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPreviewLocal(URL.createObjectURL(file));
                    if (editando) await uploadImageForSku(editando.id, file);
                  }}
                />
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button type="submit" className="btn-guardar">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
