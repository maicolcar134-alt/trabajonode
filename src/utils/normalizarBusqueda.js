/**
 * Normaliza un string removiendo acentos y tildes
 * Ejemplo: "Juguetería" => "jugueteria", "José" => "jose"
 * @param {string} texto - Texto a normalizar
 * @returns {string} Texto normalizado en minúsculas sin acentos
 */
export function normalizarBusqueda(texto) {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .normalize("NFD") // Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, ""); // Remueve marcas diacríticas
}

/**
 * Busca un término en un texto (ignora acentos y mayúsculas)
 * @param {string} texto - Texto donde buscar
 * @param {string} termino - Término a buscar
 * @returns {boolean} true si encuentra el término
 */
export function buscarConNormalizacion(texto, termino) {
  return normalizarBusqueda(texto).includes(normalizarBusqueda(termino));
}
