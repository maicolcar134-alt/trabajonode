import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaUserTie,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import "./AuxiliaresPage.css";

function AuxiliaresPage() {
  const navigate = useNavigate();
  const [auxiliares, setAuxiliares] = useState([]);
  const [allAuxiliares, setAllAuxiliares] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAux, setSelectedAux] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [edadVerificada, setEdadVerificada] = useState(0);

  // ---------------------------------------------------------
  // CALCULAR EDAD
  // ---------------------------------------------------------
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // ---------------------------------------------------------
  // CARGAR USUARIOS
  // ---------------------------------------------------------
  const fetchAuxiliares = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAuxiliares(data);
      setAllAuxiliares(data);

      const mayoresEdad = data.filter(
        (u) => calcularEdad(u.fechaNacimiento) >= 18
      );
      setEdadVerificada(mayoresEdad.length);

      if (mayoresEdad.length > 0) {
        const listaMayores = mayoresEdad
          .map(
            (m) =>
              `👤 ${m.nombres || "Sin nombre"} (${calcularEdad(
                m.fechaNacimiento
              )} años)`
          )
          .join("<br>");

        Swal.fire({
          icon: "info",
          title: "Usuarios mayores de edad detectados",
          html: `<strong>${mayoresEdad.length}</strong> verificación(es):<br><br>${listaMayores}`,
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  // ---------------------------------------------------------
  // VERIFICAR ADMIN AL CARGAR
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const allUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const current = allUsers.find((u) => u.email === user.email);
        setCurrentUserData(current);

        if (!current || current.Rol !== "Admin") {
          Swal.fire({
            icon: "error",
            title: "Acceso Denegado",
            text: "Solo los administradores pueden acceder a esta página.",
            confirmButtonText: "Volver al Dashboard",
          }).then(() => {
            navigate("/Dashboard");
          });
        } else {
          setAuxiliares(allUsers);
          setAllAuxiliares(allUsers);

          const mayoresEdad = allUsers.filter(
            (u) => calcularEdad(u.fechaNacimiento) >= 18
          );
          setEdadVerificada(mayoresEdad.length);
        }
      } else {
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  // ---------------------------------------------------------
  // LISTENER PEDIDOS EN TIEMPO REAL
  // ---------------------------------------------------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const pedidosData = snapshot.docs.map((doc) => doc.data());

      const pedidosPorUsuario = {};
      pedidosData.forEach((pedido) => {
        const email = pedido.cliente?.email;
        if (email) {
          pedidosPorUsuario[email] = (pedidosPorUsuario[email] || 0) + 1;
        }
      });

      setAuxiliares((prev) =>
        prev.map((aux) => ({
          ...aux,
          pedidos: pedidosPorUsuario[aux.email] || 0,
        }))
      );
    });

    return () => unsub();
  }, []);

  // ---------------------------------------------------------
  // CERRAR SESIÓN
  // ---------------------------------------------------------
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
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

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      Swal.fire("Error", "Escribe un correo para buscar", "warning");
      return;
    }

    const filtrados = allAuxiliares.filter((a) =>
      a.email?.toLowerCase().includes(searchEmail.toLowerCase())
    );

    if (filtrados.length === 0) {
      Swal.fire(
        "Sin resultados",
        "No se encontró ningún usuario con ese correo",
        "info"
      );
    }

    setAuxiliares(filtrados);
  };

  const handleClearSearch = () => {
    setSearchEmail("");
    setAuxiliares(allAuxiliares);
  };

  const totalUsuarios = auxiliares.length;
  const kycCompletado = auxiliares.filter((u) => u.Rol === "Admin").length;
  const kycPendiente = totalUsuarios - kycCompletado;

  if (!currentUserData || currentUserData.Rol !== "Admin") {
    return null;
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <>
      <main className="content">
        <Container fluid className="mt-4">
          <div className="d-flex align-items-center justify-content-start mb-3 p-3 bg-light rounded shadow-sm">
            <FaUserTie className="text-primary me-2" size={28} />
            <h5 className="m-0 text-dark">
              👋 Bienvenido, <strong>Admin {currentUserData?.nombres}</strong>
            </h5>
          </div>

          <h2 className="page-title mb-2">Gestión de Usuarios</h2>
          <p className="page-subtitle mb-4">
            Administra usuarios y verificaciones
          </p>

          {/* BUSCADOR */}
          <Card className="mb-4 p-3 shadow-sm">
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <strong>Buscar por correo electrónico</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="example@gmail.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md="auto">
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              </Col>

              <Col md="auto">
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={handleClearSearch}
                >
                  Limpiar
                </Button>
              </Col>
            </Row>
          </Card>

          {/* RESÚMENES */}
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
              <Card
                className={`summary-card ${
                  edadVerificada > 0 ? "verified" : "no-verified"
                }`}
              >
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    {edadVerificada > 0 ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaExclamationTriangle className="text-warning" />
                    )}
                    <h4 className="m-0">{edadVerificada}</h4>
                  </div>
                  <p className="mt-2">Edad Verificada</p>
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

          {/* TABLA */}
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
                    <th>Edad</th>
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
                        <strong>
                          {aux.nombres} {aux.apellidos}
                        </strong>
                        <div className="email">{aux.email}</div>
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

                      <td>{calcularEdad(aux.fechaNacimiento)}</td>

                      <td>
                        <span
                          className={`kyc-badge ${
                            aux.estado === "Activo" ? "verificado" : "pendiente"
                          }`}
                        >
                          {aux.estado === "Activo" ? "Verificado" : "Pendiente"}
                        </span>
                      </td>

                      <td>{aux.pedidos || 0}</td>

                      <td>
                        <span className="estado-badge activo">Activo</span>
                      </td>

                      <td className="acciones-td">
                        <FaEye className="accion-icon me-2" />

                        <Button
                          variant="link"
                          className="verificar-btn me-2"
                          onClick={() => handleEdit(aux)}
                        >
                          Verificar
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          className="eliminar-btn"
                          onClick={() => handleEliminar(aux.id)}
                        >
                          <FaTrash className="me-1" /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </main>

      {/* MODAL EDITAR */}
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
