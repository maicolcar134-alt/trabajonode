import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavDropdown,
  Table,
  Button,
  Modal,
  Form,
  Container,
  Image,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { FaUserCircle, FaCheckCircle, FaEye, FaStore } from "react-icons/fa";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import "./AuxiliaresPage.css";
import logo from "../../assets/Explosión de color y energía.png";

function AuxiliaresPage() {
  const navigate = useNavigate();
  const [auxiliares, setAuxiliares] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAux, setSelectedAux] = useState(null);

  const fetchAuxiliares = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAuxiliares(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    fetchAuxiliares();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/Auditoria");
  };

  const handleVolver = () => {
    navigate("/Admin"); // redirige a la tienda
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4d4d",
      cancelButtonColor: "#666",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "usuarios", id));
        setAuxiliares(auxiliares.filter((a) => a.id !== id));
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const handleEdit = (aux) => {
    setSelectedAux(aux);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const auxRef = doc(db, "usuarios", selectedAux.id);
      await updateDoc(auxRef, selectedAux);
      fetchAuxiliares();
      setShowModal(false);
      Swal.fire("Actualizado", "Datos guardados correctamente", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudieron guardar los cambios", "error");
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedAux({ ...selectedAux, [name]: value });
  };

  const user = auth.currentUser;

  const totalUsuarios = auxiliares.length;
  const edadVerificada = auxiliares.filter((u) => u.estado === "Activo").length;
  const kycCompletado = auxiliares.filter((u) => u.Rol === "Admin").length;
  const kycPendiente = totalUsuarios - kycCompletado;

  return (
    <>
      {/* NAVBAR */}
      <Navbar expand="lg" bg="dark" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="mas Logo" height="40" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown
                title={
                  user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      roundedCircle
                      width="40"
                      height="40"
                    />
                  ) : (
                    <FaUserCircle size={24} color="#f1edeaff" />
                  )
                }
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  {user?.email || "Usuario"}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MAIN */}
      <main className="content">
        <Container fluid className="mt-4">
          <h2 className="page-title mb-2">Gestión de Usuarios</h2>
          <p className="page-subtitle mb-4">
            Administra usuarios y verificaciones
          </p>

          {/* Tarjetas */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="summary-card">
                <Card.Body>
                  <h4>{totalUsuarios}</h4>
                  <p>Usuarios Totales</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="summary-card verified">
                <Card.Body>
                  <h4>{edadVerificada}</h4>
                  <p>Edad Verificada</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="summary-card completed">
                <Card.Body>
                  <h4>{kycCompletado}</h4>
                  <p>KYC Completado</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="summary-card pending">
                <Card.Body>
                  <h4>{kycPendiente}</h4>
                  <p>KYC Pendiente</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tabla */}
          <Card className="table-card mb-4">
            <Card.Header className="table-header">
              Lista de Usuarios
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="custom-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Edad Verificada</th>
                    <th>KYC</th>
                    <th>Pedidos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {auxiliares.map((aux) => (
                    <tr key={aux.id}>
                      <td>
                        <div>
                          <strong>
                            {aux.nombres} {aux.apellidos}
                          </strong>
                          <div className="email">{aux.email}</div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`role-badge ${
                            aux.Rol === "Admin" ? "admin" : "cliente"
                          }`}
                        >
                          {aux.Rol || "Cliente"}
                        </span>
                      </td>
                      <td>
                        <FaCheckCircle className="text-success" />
                      </td>
                      <td>
                        <span
                          className={`kyc-badge ${
                            aux.estado === "Activo"
                              ? "verificado"
                              : "pendiente"
                          }`}
                        >
                          {aux.estado === "Activo"
                            ? "Verificado"
                            : "Pendiente"}
                        </span>
                      </td>
                      <td>{aux.pedidos || 0}</td>
                      <td>
                        <span className="estado-badge activo">Activo</span>
                      </td>
                      <td>
                        <FaEye className="accion-icon" />
                        <Button
                          variant="link"
                          className="verificar-btn"
                          onClick={() => handleEdit(aux)}
                        >
                          Verificar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* BOTÓN VOLVER */}
          <div className="text-center mt-4 mb-5">
            <Button
              onClick={handleVolver}
              className="btn-volver-tienda d-flex align-items-center justify-content-center mx-auto"
            >
              <FaStore className="me-2" />
              Volver   Admin 
            </Button>
          </div>
        </Container>
      </main>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAux && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  type="text"
                  name="nombres"
                  value={selectedAux.nombres}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedAux.email}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  name="Rol"
                  value={selectedAux.Rol || "Cliente"}
                  onChange={handleModalChange}
                >
                  <option>Cliente</option>
                  <option>Admin</option>
                  <option>Auxiliar</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AuxiliaresPage;
