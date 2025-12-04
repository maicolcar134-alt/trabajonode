/**
 * Helper de reintentos con exponential backoff
 * Reintenta una función async hasta 3 veces en caso de error
 * con delays progresivos (1s, 2s, 4s por defecto)
 */

/**
 * Reintenta una función async con exponential backoff
 * @param {Function} fn - Función async a ejecutar
 * @param {number} maxRetries - Máximo número de reintentos (default: 3)
 * @param {number} baseDelay - Delay inicial en ms (default: 1000)
 * @param {Function} shouldRetry - Función que determina si reintentar basada en el error (optional)
 * @returns {Promise} Resultado de la función o error después de agotar reintentos
 */
export const retryAsync = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000,
  shouldRetry = null
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Si shouldRetry es una función y retorna false, no reintentar
      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        console.error(
          `❌ Máximo de reintentos alcanzado (${maxRetries}). Error final:`,
          error
        );
        throw error;
      }

      // Calcular delay con exponential backoff: baseDelay * 2^attempt
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(
        `⚠️ Intento ${attempt + 1}/${maxRetries} falló. Reintentando en ${delay}ms...`
      );

      // Esperar antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Predicate para determinar si un error es recuperable
 * Devuelve false para errores que no deben reintentarse
 * (ej: auth errors, validation errors)
 * @param {Error} error - Error a evaluar
 * @returns {boolean} true si debe reintentarse, false si no
 */
export const isRecoverableError = (error) => {
  // Errores de Firebase que SÍ deben reintentarse (errores de red/temporales)
  const retryableFirebaseCodes = [
    "service-unavailable",
    "deadline-exceeded",
    "internal",
    "unavailable",
    "resource-exhausted",
    "network-error",
  ];

  // Errores de Firebase que NO deben reintentarse (errores del cliente)
  const nonRetryableCodes = [
    "auth/user-not-found",
    "auth/wrong-password",
    "auth/invalid-email",
    "auth/weak-password",
    "auth/email-already-in-use",
    "permission-denied",
    "not-found",
    "unauthenticated",
  ];

  // Revisar si es un error de Firebase
  if (error.code) {
    if (nonRetryableCodes.includes(error.code)) {
      return false; // No reintentar
    }
    if (retryableFirebaseCodes.includes(error.code)) {
      return true; // Sí reintentar
    }
  }

  // Errores de red o timeouts siempre son reintentables
  if (
    error.message &&
    (error.message.includes("network") ||
      error.message.includes("timeout") ||
      error.message.includes("NETWORK") ||
      error.message.includes("TIMEOUT"))
  ) {
    return true;
  }

  // Por defecto, reintentar errores desconocidos
  return true;
};

/**
 * Versión simplificada: reintenta solo en errores recuperables
 * @param {Function} fn - Función async a ejecutar
 * @param {number} maxRetries - Máximo número de reintentos (default: 3)
 * @param {number} baseDelay - Delay inicial en ms (default: 1000)
 * @returns {Promise} Resultado de la función o error
 */
export const retryAsyncSmartly = (fn, maxRetries = 3, baseDelay = 1000) => {
  return retryAsync(fn, maxRetries, baseDelay, isRecoverableError);
};
