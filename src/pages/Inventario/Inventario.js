import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import "./Inventario.css";

export default function Inventario() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");

  // 🔄 Escucha en tiempo real los productos
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productos"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
    });
    return () => unsub();
  }, []);

  // 📸 Vista previa
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🧼 Limpiar formulario
  const resetForm = () => {
    setNombre("");
    setCategoria("");
    setPrecio("");
    setStock("");
    setImagen(null);
    setPreview(null);
    setEditando(null);
    setShowModal(false);
  };

  // ✅ Validaciones
  const validarCampos = () => {
    if (!nombre || !categoria || !precio || !stock) {
      alert("⚠️ Todos los campos son obligatorios");
      return false;
    }
    if (precio <= 0) {
      alert("⚠️ El precio debe ser mayor que 0");
      return false;
    }
    if (stock < 0) {
      alert("⚠️ El stock no puede ser negativo");
      return false;
    }
    return true;
  };

  // 💾 Guardar producto (crear o editar)
  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      let imageUrl = editando?.imagenUrl || "";

      // Si se seleccionó una nueva imagen
      if (imagen) {
        if (editando?.imagenUrl) {
          const oldRef = ref(storage, editando.imagenUrl);
          await deleteObject(oldRef).catch(() => {});
        }
        const storageRef = ref(storage, `productos/${Date.now()}_${imagen.name}`);
        await uploadBytes(storageRef, imagen);
        imageUrl = await getDownloadURL(storageRef);
      }

      const datosProducto = {
        nombre,
        categoria,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagenUrl: imageUrl,
        fechaActualizacion: new Date(),
      };

      if (editando) {
        await updateDoc(doc(db, "productos", editando.id), datosProducto);
        alert("✅ Producto actualizado correctamente");
      } else {
        await addDoc(collection(db, "productos"), {
          ...datosProducto,
          fechaCreacion: new Date(),
        });
        alert("✅ Producto agregado correctamente");
      }

      resetForm();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ No se pudo guardar el producto");
    }
  };

  // ✏️ Editar producto
  const handleEditar = (producto) => {
    setEditando(producto);
    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setPreview(producto.imagenUrl);
    setShowModal(true);
  };

  // 🗑️ Eliminar producto
  const handleEliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    try {
      await deleteDoc(doc(db, "productos", producto.id));
      if (producto.imagenUrl) {
        const imgRef = ref(storage, producto.imagenUrl);
        await deleteObject(imgRef).catch(() => {});
      }
      alert("🗑️ Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ No se pudo eliminar el producto");
    }
  };

  const handleVolver = () => navigate("/admin");

  // 🔍 Filtrado
  const productosFiltrados = productos.filter((p) => {
    return (
      (!filterCategoria ||
        p.categoria.toLowerCase() === filterCategoria.toLowerCase()) &&
      (!searchTerm || p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))];

  return (
    <div className="inventario">
      <div className="inventario-header">
        <h1>📦 Gestión de Inventario</h1>
        <button className="btn-volver" onClick={handleVolver}>
          🔙 Volver
        </button>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="🔎 Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categoriasUnicas.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button className="btn-nuevo" onClick={() => setShowModal(true)}>
          ➕ Nuevo Producto
        </button>
      </div>

      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imagenUrl ? (
                  <img src={p.imagenUrl} alt={p.nombre} className="miniatura" />
                ) : (
                  "Sin imagen"
                )}
              </td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <button className="btn-editar" onClick={() => handleEditar(p)}>
                  ✏️ Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => handleEliminar(p)}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editando ? "✏️ Editar Producto" : "➕ Agregar Producto"}</h2>
            <form onSubmit={handleGuardar} className="formulario-producto">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                min="0"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
              />

              {preview && (
                <div className="preview-container">
                  <img src={preview} alt="Vista previa" className="preview-img" />
                </div>
              )}

              <input type="file" accept="image/*" onChange={handleImagenChange} />

              <div className="botones">
                <button type="submit" className="btn-guardar">
                  {editando ? "Actualizar" : "Agregar"}
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
