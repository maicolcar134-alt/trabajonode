import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../pages/components/Navbar";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

function MainLayout() {
  const [user] = useAuthState(auth);
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

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <>
      <DashboardNavbar
        user={user}
        userPhoto={user?.photoURL}
        carrito={carrito}
        handleLogout={handleLogout}
      />

      <Outlet /> {/* Aquí se cargan todas las páginas */}
    </>
  );
}

export default MainLayout;
