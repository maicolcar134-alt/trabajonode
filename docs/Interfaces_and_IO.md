# Requisitos de Interfaces y Entradas/Salidas del Sistema

## 📋 Índice
1. [Interfaces Comunes (Requisitos)](#interfaces-comunes-requisitos)
2. [Entradas y Salidas por Módulo](#entradas-y-salidas--descripción-detallada-por-módulo)
3. [Formatos de Datos, Validaciones y Errores](#formatos-de-datos-validaciones-y-errores-comunes)
4. [Outputs Operacionales](#outputs-operacionales-logs-reportes-auditoría)
5. [Recomendaciones Prácticas](#recomendaciones-prácticas-y-garantías)

---

## Interfaces Comunes (Requisitos)

### UI / Frontend
- **Consistencia:** Interfaz coherente entre páginas (`src/pages/*`) con componentes reutilizables.
- **Accesibilidad:** Campos con `label`, `aria-*` cuando aplique, texto alternativo en imágenes (`alt`).
- **Validación cliente:** Validaciones inmediatas para formularios (email válido con `src/utils/validarEmail.js`, campos obligatorios, formatos numéricos).
- **Mensajería:** Mostrar errores claros (400-level), confirmaciones de éxito y estados de carga/spinner (`Spinner.js`).
- **Responsive:** Soporte móvil con breakpoints y uso de `srcset` para imágenes (`src/utils/responsiveImageHelper.js`).

### Integración con Firebase (Autenticación y BBDD)
- **Autenticación:** Uso de Firebase Auth desde frontend; entradas seguras y protección anti-brute-force (rate limit en `functions/`).
- **Base de datos:** Lecturas/escrituras en Firestore; las operaciones de escritura deben validar datos antes de persistir.
- **Storage/Imágenes:** Subida a Cloudinary/Storage; URLs normalizadas con parámetros transformadores.

### API / Comunicación (Front → Backend)
- **Patrón:** Principalmente llamadas directas desde frontend a Firebase SDK; no hay REST API pública documentada en el repo.
- **Formato de datos:** JSON para objetos; fechas en ISO 8601; identificadores como strings (`uid`, `id` de documentos).
- **Errores:** Estructura uniforme: `{ code: string, message: string, details?: any }` para mostrar en UI.

### Admin / Operaciones
- **Backups:** No automatizado (documentado en README). Requerimiento: exportar/importar configuración en JSON.
- **Auditoría:** Escritura de eventos en `auditoria` con: actor, acción, timestamp, meta.

### Seguridad y Privacidad
- **Validaciones servidor/cliente:** Campos sanitizados y validados en cliente; reglas Firestore mínimas en `firestore.rules`.
- **Protección datos sensibles:** No almacenar PAN completo; si hay pagos, tokenizar en provider externo (actual repo solo valida Luhn cliente).
- **Registros:** Auditoría de cambios críticos y rate-limiting (ver `functions/rateLimitController.js`).

### Observabilidad / Telemetría
- **Logs:** Eventos de error y transaccionales en Cloud Functions + consola del navegador para debugging.
- **Métricas:** Puntos de medición sugeridos: FCP, LCP, tamaño de imágenes, latencia de Firestore.

---

## Entradas y Salidas — Descripción detallada por módulo

Nota: cuando menciono colecciones uso los nombres observados en el repo: `usuarios`, `inventario`, `pedidos`, `auditoria`, `zonas`, `rateLimits`.

### Autenticación / Registro (`RegisterPage`, `LoginPage`)
**Entradas (formulario):**
- **`email`**: string, formato RFC-like; validado por `validarEmail.js`. Obligatorio.
- **`password`**: string; validaciones cliente (longitud mínima, complejidad si está implementada). Obligatorio.
- **`displayName` / `nombre`**: string; obligatorio en registro.
- **Campos opcionales:** teléfono, dirección breve.

**Validaciones:**
- Email único (consulta a Firestore)
- Password no vacío
- Longitud y complejidad
- Confirmación de password

**Salidas/efectos esperados:**
- Crear usuario en Firebase Auth (output: `uid`)
- Crear documento en `usuarios` con: `{ uid, email, nombre, rol?, createdAt: ISO }`
- Respuesta al cliente: éxito (HTTP-like) o error `{code, message}` mostrado en UI
- Audit log: entrada en `auditoria` indicando `usuario.registro`

### Inventario / CRUD productos (`Inventario.js`, `CategoriasAdmin.js`)
**Entradas (formularios y uploads):**
- **`nombre`**: string, obligatorio
- **`descripcion`**: string, opcional/obligatoria según UI
- **`precio`**: number, formato decimal; validar transformaciones `Number(...)`. Obligatorio
- **`stock` / `cantidad`**: integer >= 0. Obligatorio
- **`categoriaId`**: string (FK a colección categorías)
- **`imagen`**: archivo binario (jpeg/png) o URL; validar MIME y tamaño (límite en UI)
- **`oferta` / `visible` / `tags`**: booleans/arrays

**Validaciones:**
- Campos obligatorios
- Tipos correctos
- Límite de tamaño imagen
- Nombre único si aplica

**Salidas/efectos:**
- Subida de archivo a Storage/Cloudinary → output: `imagenUrl` (string)
- Escritura en Firestore `inventario/{id}` con estructura: `{ nombre, descripcion, precio, stock, categoriaId, imagenUrl, createdAt }`
- Actualizaciones provocan auditoría (`auditoria`) y posible invalidación de cache UI (onSnapshot actualiza vista)
- Errores: colisión de ID, validación fallida → mensaje al frontend

### Checkout / Pedidos (`Checkout.js`)
**Entradas (checkout form + carrito):**
- **`cart`**: array de items `{ productoId, cantidad }`. Debe existir stock
- **`customer`**: `{ nombre, email, telefono, direccion, zonaId }`. ZonaId usado para calcular envío
- **`payment`**: si hay pago integrado: card info (en repo solo validación Luhn cliente). Evitar almacenar PAN

**Validaciones:**
- Cart no vacío
- Cantidades disponibles
- Dirección válida
- Luhn check en tarjeta (cliente)

**Salidas/efectos:**
- Nuevo documento en `pedidos/{id}`: `{ items, customer, total, envio, estado: 'pendiente', createdAt }`
- Decremento atómico del `stock` de cada `inventario` (ideal con transacción de Firestore)
- Auditoría: registrar `pedido.creado`
- Respuesta al cliente: confirmación con `orderId` y resumen
- Notificaciones opcionales: email/WhatsApp (no documentado — si existe, describir proveedor)

### Auditoría (`Auditoria.js`)
**Entradas:** filtros desde UI `{ actor, acción, fechaDesde, fechaHasta, tipo }`

**Validaciones:** rango de fecha, límites de paginación

**Salidas:** lista paginada de eventos `{ actor, acción, targetId, meta, timestamp }`. Export CSV/JSON opcional

**Efectos:** Ninguno (read-only)

### Zonas de Envío (`ZonasEnvio`)
**Entradas:** `zonaNombre`, `precioEnvio`, `restricciones` (peso, distancia)

**Validaciones:** precio >= 0, nombre único

**Salidas/efectos:** escritura en `zonas` collection: `{ zonaId, nombre, precio, condiciones }`. Usado por checkout para cálculo

### Categorías y Ofertas (`CategoriasAdmin`, `OfertasPirotecnia`)
**Entradas:** `nombre`, `descripcion`, `imagen`, `fechaInicio/Fin` (para ofertas)

**Validaciones:** fechas coherentes, imagen válida

**Salidas:** documentos en `categorias`, `ofertas` y afectación visual en catálogo (frontend consume)

### Manejo de Imágenes (Cloudinary / `responsiveImageHelper.js`)
**Entradas:** archivo imagen o URL base (si viene de Cloudinary)

**Validaciones:** MIME tipo (image/*), tamaño

**Salidas:** URL transformada con parámetros Cloudinary (`c_fill`, `w_400`, `q_80`, `f_auto`, etc.) y `srcset` con descriptores (`400w, 800w, 1200w`)

**Efectos:** mejora de rendimiento; helper exporta props para `<img {...getResponsiveImageProps(url, type, alt)} />`

### Cloud Functions (`functions/index.js`, `rateLimitController.js`)
**Entradas:** triggers programados (cron), HTTP callable (si existe), triggers DB

**Validaciones:** permisos, payload esperado

**Salidas/efectos:** limpieza de datos, control de rate-limits, envío de eventos, actualizaciones en Firestore. Logs en consola y Stackdriver/Cloud Logging

### Rate Limit y Protección
**Entradas:** IP/uid y acción

**Validaciones:** contador por ventana temporal

**Salidas:** bloqueos temporales, registro en `rateLimits` collection

### Export / Import de Configuración (Admin)
**Entradas:** petición export (acción manual)

**Salidas:** JSON/CSV descargable con `categorias`, `zonas`, `config-admin`. Actualmente manual (README)

### Interacciones de Real-time (onSnapshot)
**Entradas:** suscripción desde cliente (consulta Firestore)

**Salidas:** eventos de snapshot con cambios incrementales usados para actualizar UI en tiempo real

---

## Formatos de Datos, Validaciones y Errores Comunes

### Tipos básicos
- **IDs:** `string` (Firestore doc id)
- **Money/precio:** `number` (guardar en centavos o con convención decimal; repo actual usa `Number(...)`)
- **Fechas:** `string` ISO 8601 o `Timestamp` de Firestore
- **Imágenes:** `string` URL público

### Reglas de validación (ejemplos)
- **Email:** formato válido, longitud <= 254
- **Password:** min 8 chars (si se requiere), no almacenar en claro
- **Precio:** >= 0; stock: integer >= 0
- **Imagen:** `image/jpeg` o `image/png`; tamaño máximo (ej. 2MB) en cliente
- **Checkout:** Luhn check en número de tarjeta (solo cliente)

### Códigos de error y manejo (frontend)
- `AUTH/EMAIL-ALREADY-IN-USE` → mostrar mensaje y focus
- `VALIDATION/INVALID-FIELD` → resaltar campo con mensaje
- `STOCK/INSUFFICIENT` → bloquear checkout y mostrar alternativas
- `NETWORK/UNAVAILABLE` → reintentar o guardar localmente antes de reintento

---

## Outputs Operacionales (logs, reportes, auditoría)

- **Auditoría (`auditoria`):** cada operación crítica produce un registro `{ actorUid, action, resourceId, details, timestamp }`
- **Backups:** si se realizan manualmente, salida esperada: `backup-config-YYYYMMDD.json` con dumps de colecciones administrativas
- **Notificaciones / Emails:** si existieran, salida: envío de email con estado y `messageId` del proveedor

---

## Recomendaciones Prácticas y Garantías

- ✅ Añadir validaciones redundantes en reglas Firestore además de validación cliente
- ✅ Registrar transacciones críticas (por ejemplo decremento de stock) con transacciones Firestore o Cloud Functions para evitar race conditions
- ✅ No almacenar datos de pago sensibles; usar proveedor externo y tokens
- ✅ Mantener `docs/` actualizado cuando cambien interfaces o flujos de datos
- ✅ Documentar nuevas colecciones Firestore y su schema en `docs/` para facilitar onboarding

---

**Última actualización:** 5 de diciembre de 2025
