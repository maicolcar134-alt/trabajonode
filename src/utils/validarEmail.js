/**
 * Validación de emails - Múltiples niveles de estrictez
 * Referencia: RFC 5322 (práctico)
 */

// Regex RFC 5322 SIMPLIFICADO (práctico)
export const RFC5322_SIMPLE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Regex RFC 5322 ESTRICTO (más completo)
export const RFC5322_STRICT = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

// Regex BÁSICO LEGADO
export const BASIC_LEGACY = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmailRFC5322Simple(email) {
  if (!email || typeof email !== "string") return false;
  return RFC5322_SIMPLE.test(email.trim());
}

export function validarEmailRFC5322Strict(email) {
  if (!email || typeof email !== "string") return false;
  return RFC5322_STRICT.test(email.trim());
}

export function validarEmailLegacy(email) {
  if (!email || typeof email !== "string") return false;
  return BASIC_LEGACY.test(email.trim());
}

export function validarEmail(email, nivel = "simple") {
  switch (nivel) {
    case "strict":
      return validarEmailRFC5322Strict(email);
    case "legacy":
      return validarEmailLegacy(email);
    case "simple":
    default:
      return validarEmailRFC5322Simple(email);
  }
}

export function validarEmailDetallado(email) {
  if (!email || typeof email !== "string") {
    return { valido: false, nivel: null, razon: "Email vacío o no es string" };
  }

  const trimmed = email.trim();

  if (trimmed.length > 254) {
    return { valido: false, nivel: null, razon: "Email muy largo (máx 254 caracteres)" };
  }

  if (!trimmed.includes("@")) {
    return { valido: false, nivel: null, razon: "Falta el símbolo @" };
  }

  const [local, domain] = trimmed.split("@");
  if (!domain || !domain.includes(".")) {
    return { valido: false, nivel: null, razon: "Dominio inválido (sin TLD)" };
  }

  if (local.length > 64) {
    return { valido: false, nivel: null, razon: "Parte local muy larga (máx 64 caracteres)" };
  }

  if (validarEmailRFC5322Strict(trimmed)) {
    return { valido: true, nivel: "strict", razon: "Válido según RFC 5322 ESTRICTO" };
  }

  if (validarEmailRFC5322Simple(trimmed)) {
    return { valido: true, nivel: "simple", razon: "Válido según RFC 5322 SIMPLE" };
  }

  if (validarEmailLegacy(trimmed)) {
    return { valido: true, nivel: "legacy", razon: "Válido según validación básica" };
  }

  return { valido: false, nivel: null, razon: "Formato de email no válido" };
}

/**
 * Valida que el email tenga formato correcto y pertenezca a una lista de dominios permitidos
 * @param {string} email
 * @param {Array<string>} allowedDomains - lista de dominios permitidos (ej: ["gmail.com", "outlook.com"])
 * @param {string} nivel - 'simple' | 'strict' | 'legacy'
 * @returns {{valido: boolean, razon: string}}
 */
export function validarEmailConDominios(email, allowedDomains = [], nivel = "simple") {
  const detalle = validarEmailDetallado(email);
  if (!detalle.valido) return { valido: false, razon: detalle.razon };

  if (!Array.isArray(allowedDomains) || allowedDomains.length === 0) {
    return { valido: true, razon: "Válido (sin restricción de dominios)" };
  }

  const domain = String(email).split("@").pop().toLowerCase();

  const match = allowedDomains.some((d) => {
    const dd = d.toLowerCase();
    return domain === dd || domain.endsWith(`.${dd}`);
  });

  if (!match) return { valido: false, razon: `Dominio no permitido: ${domain}` };
  return { valido: true, razon: "Válido y dominio permitido" };
}
