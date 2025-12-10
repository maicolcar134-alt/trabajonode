/**
 * Generador de URLs responsivas con srcset para Cloudinary
 * Optimiza imágenes para diferentes tamaños de pantalla
 */

/**
 * Genera un srcset string a partir de una URL de Cloudinary
 * @param {string} imageUrl - URL de la imagen en Cloudinary
 * @param {object} options - Configuración opcional
 * @returns {string} String de srcset listo para usar en HTML
 */
export function generateSrcSet(imageUrl, options = {}) {
  if (!imageUrl) return "";

  // Configuración por defecto
  const {
    widths = [400, 800, 1200], // Anchos en píxeles
    quality = 80, // Calidad (1-100)
    format = "auto", // auto, webp, jpg, png
  } = options;

  // Si no es URL de Cloudinary, retornar URL original sin transformación
  if (!imageUrl.includes("cloudinary")) {
    return "";
  }

  // Generar srcset con parámetros de Cloudinary
  const srcSetArray = widths.map((width) => {
    const transformedUrl = addCloudinaryParams(imageUrl, {
      width,
      quality,
      format,
    });
    return `${transformedUrl} ${width}w`;
  });

  return srcSetArray.join(", ");
}

/**
 * Añade parámetros de transformación a URL de Cloudinary
 * @param {string} url - URL base de Cloudinary
 * @param {object} params - Parámetros a añadir
 * @returns {string} URL transformada
 */
export function addCloudinaryParams(url, params = {}) {
  if (!url || !url.includes("cloudinary")) return url;

  const { width, quality = 80, format = "auto", crop = "fill" } = params;

  // Estructura: https://res.cloudinary.com/{cloud}/image/upload/c_fill,w_400,q_80,f_auto/image.jpg
  const parts = url.split("/upload/");

  if (parts.length !== 2) return url; // URL no tiene estructura esperada

  const baseUrl = parts[0];
  const imagePath = parts[1];

  // Construir string de transformación
  const transforms = [];

  if (crop) transforms.push(`c_${crop}`);
  if (width) transforms.push(`w_${width}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);

  const transformString = transforms.join(",");
  return `${baseUrl}/upload/${transformString}/${imagePath}`;
}

/**
 * Hook para usar srcset en imágenes responsivas
 * Define tamaños según viewport para optimización
 */
export const ResponsiveImageSizes = {
  // Para productos en catálogo/ofertas (small cards)
  productCard: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",

  // Para imágenes destacadas (medium)
  featured: "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",

  // Para hero/banners (full width)
  hero: "100vw",

  // Para thumbnails
  thumbnail: "(max-width: 640px) 80px, (max-width: 1024px) 120px, 150px",

  // Para avatares/logos
  avatar: "(max-width: 640px) 40px, (max-width: 1024px) 60px, 100px",
};

/**
 * Genera un objeto completo de props para imagen responsiva
 * @param {string} imageUrl - URL de la imagen
 * @param {string} type - Tipo de imagen (productCard, featured, hero, etc)
 * @param {string} alt - Texto alternativo
 * @returns {object} Props listos para <img>
 */
export function getResponsiveImageProps(imageUrl, type = "productCard", alt = "") {
  return {
    src: imageUrl, // Fallback
    srcSet: generateSrcSet(imageUrl, {
      widths: [400, 800, 1200],
      quality: 80,
      format: "auto",
    }),
    sizes: ResponsiveImageSizes[type] || ResponsiveImageSizes.productCard,
    alt: alt,
    loading: "lazy", // Lazy loading
  };
}
