import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../pages/components/Navbar";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

function MainLayout() {
  const [user] = useAuthState(auth);
  const [rol, setRol] = useState(undefined);
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito al iniciar
  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(c);
  }, []);

  // Actualizar carrito en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const c = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarrito(c);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Obtener rol del usuario desde Firestore
  useEffect(() => {
    let mounted = true;
    const fetchRol = async () => {
      try {
        if (!user) {
          if (mounted) setRol(null);
          return;
        }
        const userDocRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists() && mounted) {
          const data = userSnap.data();
          // Buscar 'Rol' con mayúscula (como está en Firestore) o 'rol' con minúscula
          const userRol = data?.Rol || data?.rol || null;
          setRol(userRol);
        } else if (mounted) {
          setRol(null);
        }
      } catch (e) {
        console.error("Error obteniendo rol de usuario:", e);
        if (mounted) setRol(null);
      }
    };

    fetchRol();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <>
      <DashboardNavbar
        user={user}
        userPhoto={user?.photoURL}
        rol={rol}
        carrito={carrito}
        handleLogout={handleLogout}
      />

      <Outlet /> {/* Aquí se cargan todas las páginas */}
    </>
  );
}

export default MainLayout;
