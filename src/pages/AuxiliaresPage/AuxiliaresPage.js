import { useEffect, useState } from "react";
import { collection,getDocs,deleteDoc,doc,updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {Navbar,Nav, NavDropdown,Table, Button,Modal,Form,Container,Image,
} from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import "./AuxiliaresPage.css";
import logo from "../../assets/mas.jpg";

function AuxiliaresPage() {
  const navigate = useNavigate();
  const [auxiliares, setAuxiliares] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAux, setSelectedAux] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // Expresiones regulares para validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^\d{7,10}$/;
  const cedulaRegex = /^\d{5,10}$/;
  const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    if (!selectedAux.nombres || !nombreRegex.test(selectedAux.nombres)) {
      errors.nombres =
        "Nombres inválidos. Solo letras y espacios, entre 2 y 50 caracteres.";
    }
    if (!selectedAux.apellidos || !nombreRegex.test(selectedAux.apellidos)) {
      errors.apellidos =
        "Apellidos inválidos. Solo letras y espacios, entre 2 y 50 caracteres.";
    }
    if (!selectedAux.cedula || !cedulaRegex.test(selectedAux.cedula)) {
      errors.cedula = "Cédula inválida. Solo números, entre 5 y 10 dígitos.";
    }
    if (!selectedAux.telefono || !telefonoRegex.test(selectedAux.telefono)) {
      errors.telefono =
        "Teléfono inválido. Solo números, entre 7 y 10 dígitos.";
    }
    if (!selectedAux.email || !emailRegex.test(selectedAux.email)) {
      errors.email = "Email inválido.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para calcular edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Cargar auxiliares y verificar rol
  useEffect(() => {
    const fetchAuxiliares = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Obtener usuario actual
        const userEmail = auth.currentUser?.email;
        const currentUser = data.find((u) => u.email === userEmail);

        if (currentUser) {
          setCurrentUserRole(currentUser.Rol || "Usuario");
        }

        // Solo mostrar auxiliares si es admin
        if (currentUser?.Rol === "Admin") {
          setAuxiliares(data);
        } else {
          setAuxiliares([]); // Si no es admin, no muestra nada
        }
      } catch (error) {
        console.error("Error cargando auxiliares:", error);
      }
    };
    fetchAuxiliares();
  }, []);

  // Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Eliminar
  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "usuarios", id));
        setAuxiliares(auxiliares.filter((a) => a.id !== id));
        Swal.fire("Eliminado", "Registro eliminado correctamente.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el registro.", "error");
      }
    }
  };

  // Abrir modal edición
  const handleEdit = (aux) => {
    setSelectedAux(aux);
    setShowModal(true);
  };

  // Guardar cambios
  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      const auxRef = doc(db, "usuarios", selectedAux.id);
      await updateDoc(auxRef, {
        nombres: selectedAux.nombres,
        apellidos: selectedAux.apellidos,
        cedula: selectedAux.cedula,
        telefono: selectedAux.telefono,
        email: selectedAux.email,
        fechaNacimiento: selectedAux.fechaNacimiento,
        edad: calcularEdad(selectedAux.fechaNacimiento),
        sexo: selectedAux.sexo,
        Rol: selectedAux.Rol,
        estado: selectedAux.estado,
      });

      setAuxiliares(
        auxiliares.map((a) =>
          a.id === selectedAux.id
            ? {
                ...selectedAux,
                edad: calcularEdad(selectedAux.fechaNacimiento),
              }
            : a
        )
      );

      setShowModal(false);
      Swal.fire("Actualizado", "Los datos fueron actualizados.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar.", "error");
    }
  };

  // Cambios en modal
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    if (name === "fechaNacimiento") {
      const nuevaEdad = calcularEdad(value);
      setSelectedAux({ ...selectedAux, [name]: value, edad: nuevaEdad });
    } else {
      setSelectedAux({ ...selectedAux, [name]: value });
    }
  };

  // Usuario actual
  const user = auth.currentUser;

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
              <Nav.Link onClick={() => navigate("/clientes")}>
                Clientes
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/auxiliares")}>
                Auxiliares
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/servicios")}>
                Servicios
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/cronograma")}>
                Cronograma
              </Nav.Link>

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

      {/* MAIN CONTENT */}
      <main className="content">
        <Container className="mt-4">
          <h2 className="page-title text-center mb-4">
            AUXILIARES DE SERVICIOS REGISTRADOS FUEGO PIROTECNICOS
          </h2>
          <div className="text-center mb-4">  
      
       
     
    </div>
  
          {currentUserRole !== "Admin" ? (
            <div className="text-center"></div>
          ) : (
            <div className="table-container">
              <Table
                striped
                bordered
                hover
                responsive
                className="tabla-auxiliares"
              >
                <thead>
                  <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Edad</th>
                    <th>Fecha Nacimiento</th>
                    <th>Sexo</th>
                    <th>Estado</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {auxiliares.map((aux) => (
                    <tr key={aux.id}>
                      <td>{aux.nombres}</td>
                      <td>{aux.apellidos}</td>
                      <td>{aux.cedula}</td>
                      <td>{aux.telefono}</td>
                      <td>{aux.email}</td>
                      <td>{calcularEdad(aux.fechaNacimiento) || "-"}</td>
                      <td>{aux.fechaNacimiento || "-"}</td>
                      <td>{aux.sexo || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            aux.estado === "Activo"
                              ? "bg-success"
                              : aux.estado === "Pendiente"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {aux.estado || "Pendiente"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            aux.Rol === "Admin"
                              ? "bg-primary"
                              : "bg-info text-dark"
                          }`}
                        >
                          {aux.Rol || "Auxiliar"}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(aux)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleEliminar(aux.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Container>
      </main>

      {/* FOOTER */}
      <footer className="footer mt-auto">
        <Container className="text-center">
          <small>© 2025 Bienvenido fuegos pirotecnicos</small>
        </Container>
      </footer>

      {/* MODAL EDICIÓN */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Auxiliar</Modal.Title>
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
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="apellidos"
                  value={selectedAux.apellidos}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={selectedAux.cedula}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={selectedAux.telefono}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={selectedAux.email} disabled />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={selectedAux.fechaNacimiento || ""}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Sexo</Form.Label>
                <Form.Select
                  name="sexo"
                  value={selectedAux.sexo || ""}
                  onChange={handleModalChange}
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={selectedAux.estado || "Pendiente"}
                  onChange={handleModalChange}
                >
                  <option>Pendiente</option>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  name="Rol"
                  value={selectedAux.Rol || "Auxiliar"}
                  onChange={handleModalChange}
                >
                  <option>Auxiliar</option>
                  <option>Admin</option>
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
