import { useState, useEffect } from "react";

/**
 * Hook que detecta si el dispositivo es móvil basado en el ancho de la ventana
 * Se actualiza dinámicamente cuando cambia el tamaño de la ventana
 * @param {number} breakpoint - Ancho en píxeles considerado como móvil (default: 768)
 * @returns {boolean} true si es móvil, false si es desktop
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar tamaño inicial
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Establecer estado inicial
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", handleResize);

    // Limpiar listener
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

/**
 * Hook adicional que devuelve el breakpoint actual
 * Útil para components más complejos que necesitan más información
 * @returns {object} { isMobile, isTablet, isDesktop, width }
 */
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        width,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};
