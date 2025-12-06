# Cloud Functions - PyroShop Cleanup & Rate Limiting

Funciones programadas para limpieza automática de datos expirados en Firestore y control de rate limiting.

## Funciones Disponibles

### 1. `cleanupAuditoria`
- **Propósito:** Elimina logs de auditoría más antiguos de 90 días
- **Schedula:** Diariamente a las 2:00 AM UTC (ajustable)
- **Colección:** `auditoria`
- **Condición:** `fecha < hace 90 días`
- **Límite:** 500 registros por ejecución (evita timeout)

### 2. `cleanupPedidosCancelados`
- **Propósito:** Elimina pedidos con estado "cancelado" más antiguos de 30 días
- **Schedula:** Cada lunes a las 3:00 AM UTC (ajustable)
- **Colección:** `pedidos`
- **Condiciones:** `estado == 'cancelado' AND fecha < hace 30 días`
- **Límite:** 500 registros por ejecución

### 3. `cleanupSesiones`
- **Propósito:** Placeholder para limpieza de sesiones (requiere colección de sesiones)
- **Schedula:** Cada 6 horas
- **Estado:** Deshabilitado (requiere configuración adicional)

### 4. `updateRateLimitCounter` (Trigger)
- **Propósito:** Actualiza contador de rate limit en cada operación Firestore
- **Disparador:** `onWrite` en cualquier colección protegida
- **Colección:** `rateLimits`
- **Límite:** 100 requests por minuto por usuario

### 5. `cleanupExpiredRateLimits`
- **Propósito:** Elimina contadores de rate limit inactivos (> 7 días sin requests)
- **Schedula:** Cada domingo a las 4 AM UTC
- **Colección:** `rateLimits`

### 6. `resetRateLimit` (HTTP Callable)
- **Propósito:** Resetea manualmente el contador de rate limit de un usuario (admin only)
- **Tipo:** Cloud Function callable
- **Parámetros:** `{ userId: "uid" }`

## Instalación y Despliegue

### Prerequisitos
```bash
# Instala Firebase CLI globalmente
npm install -g firebase-tools

# Autentica con tu cuenta Firebase
firebase login
```

### Desplegar funciones
```bash
# Desde la raíz del proyecto
cd functions
npm install
cd ..

firebase deploy --only functions
firebase deploy --only firestore:rules

# Ver logs en tiempo real
firebase functions:log
```

## Rate Limiting - Configuración

### Límites actuales (en `firestore.rules`)
- **Inventario:** 100 requests/minuto (admin)
- **Pedidos:** 100 requests/minuto (usuario)
- **Usuarios:** 100 requests/minuto (admin/self)
- **Zonas:** 100 requests/minuto (admin)
- **Auditoría:** 100 requests/minuto (all)
- **Categorías:** 100 requests/minuto (admin)
- **Eventos:** 100 requests/minuto (admin)

### Cómo funciona

1. **Firestore Rules** verifica `checkRateLimit()` en cada operación
2. Si el usuario está dentro del límite de 60 segundos, permite la operación
3. Si se alcanza 100 requests en menos de 60 segundos, rechaza con error
4. **Cloud Function trigger** (`updateRateLimitCounter`) actualiza el contador en `rateLimits/{userId}`
5. Después de 60 segundos, el contador se reinicia

### Colección `rateLimits`

Estructura de documento:
```json
{
  "userId": "abc123",
  "count": 45,
  "lastReset": 1702566000000,
  "updatedAt": "2025-12-02T...",
  "resetBy": "admin_uid" // Solo si fue reseteado manualmente
}
```

### Cambiar límites

Edita `firestore.rules` y modifica:

```javascript
if (counter < 100) {  // Cambiar a otro número
  return true;
}
```

Luego desplega:
```bash
firebase deploy --only firestore:rules
```

### Resetear rate limit manualmente (desde cliente)

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const resetRateLimit = httpsCallable(functions, 'resetRateLimit');

// Admin resetea el rate limit de un usuario
await resetRateLimit({ userId: 'xyz123' });
```

## Configuración

### Cambiar horarios
Edita `functions/index.js` y modifica las expresiones cron:

```javascript
// Formato: "minuto hora dia_mes mes dia_semana"
// Ejemplo: "0 2 * * *" = 2:00 AM todos los días

.pubsub.schedule("0 2 * * *") // Diariamente a las 2 AM UTC
```

**Ejemplos de cron:**
- `"0 2 * * *"` → Todos los días a las 2 AM
- `"0 3 * * 1"` → Lunes a las 3 AM
- `"0 */6 * * *"` → Cada 6 horas
- `"30 23 * * 0"` → Domingo a las 11:30 PM

### Cambiar períodos de retención
En `functions/index.js`, modifica:

```javascript
// Auditoría: 90 días
const hace90Dias = new Date(ahora.getTime() - 90 * 24 * 60 * 60 * 1000);

// Pedidos: 30 días
const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
```

## Monitoreo

### Ver logs
```bash
firebase functions:log
# O en la consola Firebase: https://console.firebase.google.com → Functions → Logs
```

### Alertas
Configura alertas en Google Cloud Console:
1. Ve a Cloud Monitoring
2. Crea alertas para funciones con errores
3. Configura notificaciones por email/Slack

### Costos
- **Primeras 2 millones de invocaciones/mes:** Gratis
- **Después:** ~$0.40 por millón de invocaciones
- Las ejecuciones de cron consumen compute time

## Troubleshooting

### Función no se ejecuta
1. Verifica timezone en `firebase.json` o función
2. Confirma que la hora UTC sea correcta
3. Revisa logs: `firebase functions:log`

### Timeout (timeout después de 60s)
- Reduce `limit(500)` a `limit(100)` en la query
- O aumenta timeout en función (máx 540s)

### Permisos insuficientes
```bash
# Asegúrate de que el service account tiene permisos Firestore
firebase functions:config:set env=prod
```

### Error: "Collection not found"
- Verifica que la colección exista en Firestore
- Crea documentos de prueba manualmente si es necesario

## Desarrollo local

```bash
# Instala firebase-tools localmente
cd functions
npm install

# Emula funciones localmente (requiere emulador)
cd ..
firebase emulators:start --only functions

# Prueba desde otro terminal
curl http://localhost:5001/fuegos-pirotecnicos/us-central1/cleanupAuditoria
```

## Notas importantes

1. **Backup:** Antes del primer despliegue, realiza un backup manual de `auditoria` y `pedidos`.
2. **Soft delete:** Para auditoría, considera usar un campo `deleted: true` en lugar de eliminar (mejor para compliance).
3. **Retención legal:** Verifica si necesitas guardar logs más tiempo por regulaciones locales.
4. **Testing:** Prueba en colecciones de prueba primero.

## Referencias

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Pub/Sub Scheduler Documentation](https://firebase.google.com/docs/functions/schedule-functions)
- [Cron Expression Format](https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules)
