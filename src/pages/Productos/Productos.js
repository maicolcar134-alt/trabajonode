// src/pages/ProductosPage/ProductosPage.jsx
import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from
import {collection,getDocs,addDoc, updateDoc, deleteDoc, doc,} from "firebase/firestore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./ProductosPage.css";

function ProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
  });

  // ✅ Cargar productos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const productosArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(productosArray);
  };

  // ✅ Abrir modal para crear o editar
  const handleShowModal = (producto = null) => {
    if (producto) {
      setEditingProducto(producto);
      setFormData(producto);
    } else {
      setEditingProducto(null);
      setFormData({ nombre: "", precio: "", stock: "" });
    }
    setShowModal(true);
  };

  // ✅ Guardar producto
  const handleSave = async () => {
    try {
      if (editingProducto) {
        await updateDoc(doc(db, "productos", editingProducto.id), formData);
        Swal.fire("Actualizado", "El producto se actualizó correctamente", "success");
      } else {
        await addDoc(collection(db, "productos"), formData);
        Swal.fire("Agregado", "El producto se agregó correctamente", "success");
      }
      setShowModal(false);
      fetchProductos();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  // ✅ Eliminar producto
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "productos", id));
        Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
        fetchProductos();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  return (
    <Container className="mt-5 productos-page">
      <h1 className="text-center mb-4">Gestión de Productos 🎇</h1>
      <div className="acciones mb-3">
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ⬅ Volver al Dashboard
        </Button>
        <Button
          variant="primary"
          className="ms-2"
          onClick={() => handleShowModal()}
        >
          ➕ Agregar Producto
        </Button>
      </div>

      <Table striped bordered hover responsive className="productos-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio (COP)</th>
            <th>Stock</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{Number(prod.precio).toLocaleString()}</td>
                <td>{prod.stock}</td>
                <td className="text-center">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(prod)}
                  >
                    ✏ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(prod.id)}
                  >
                    🗑 Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay productos registrados
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal para agregar/editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProducto ? "Editar Producto" : "Agregar Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrecio" className="mb-3">
              <Form.Label>Precio (COP)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio en pesos"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formStock" className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Cantidad disponible"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProductosPage;
