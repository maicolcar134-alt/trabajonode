import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebaseConfig';
import Spinner from './Spinner';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { doc, getDoc } from 'firebase/firestore';


function ProtectedRoute({ children, rol }) {
  const [user, loading] = useAuthState(auth);
  const [fakeLoading, setFakeLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFakeLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !fakeLoading) {
      if (!user) {
        const logoutFlag = sessionStorage.getItem("logout");

        if (!logoutFlag) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Debes iniciar sesión para acceder a esta página.',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          sessionStorage.removeItem("logout");
        }

        setRedirect(<Navigate to="/" replace />);
      }
    }
  }, [loading, fakeLoading, user]);

  // Si la ruta requiere rol específico, comprobar rol del usuario en Firestore
  useEffect(() => {
    let mounted = true;
    const checkRol = async () => {
      if (!rol) return; // no se requiere rol específico
      if (!user || loading) return; // esperar a que usuario esté cargado

      try {
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userSnap = await getDoc(userDocRef);
        const data = userSnap.exists() ? userSnap.data() : null;
         // Buscar 'Rol' con mayúscula (como está en Firestore) o 'rol' con minúscula
        const currentRol = data?.Rol || data?.rol || null;
        if (mounted) setUserRol(currentRol);

        // Si el rol actual NO coincide con el requerido (comparación case-insensitive)
        if (mounted && currentRol?.toLowerCase() !== rol?.toLowerCase()) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso denegado',
            text: 'No tienes permisos para acceder a esta sección.',
            timer: 1800,
            showConfirmButton: false,
          });
          setRedirect(<Navigate to="/" replace />);
        }
      } catch (e) {
        console.error('Error comprobando rol en ProtectedRoute:', e);
      }
    };

    checkRol();

    return () => {
      mounted = false;
    };
  }, [rol, user, loading]);

  if (loading || fakeLoading) {
    return <Spinner />;
  }

  if (redirect) {
    return redirect;
  }

  return children;
}

export default ProtectedRoute;
