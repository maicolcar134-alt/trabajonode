# Cloud Functions - PyroShop Cleanup, Backup & Rate Limiting

Funciones programadas para:
- ✅ Limpieza automática de datos expirados en Firestore
- ✅ **Backup automático de configuración administrativa**
- ✅ Control de rate limiting

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

### 4. `backupAdminConfig` ⭐ **NUEVO**
- **Propósito:** Exporta colecciones administrativas a Cloud Storage automáticamente
- **Schedula:** Cada domingo a las 1:00 AM UTC (ajustable)
- **Colecciones respaldadas:** `categorias`, `zonas`, `eventos`, `ofertas`
- **Retención:** Últimos 52 backups (1 año completo)
- **Formato:** JSON con timestamp y metadata
- **Almacenamiento:** `backups/admin-config/backup-YYYY-MM-DD...json`

### 5. `updateRateLimitCounter` (Trigger)
- **Propósito:** Actualiza contador de rate limit en cada operación Firestore
- **Disparador:** `onWrite` en cualquier colección protegida
- **Colección:** `rateLimits`
- **Límite:** 100 requests por minuto por usuario

### 6. `cleanupExpiredRateLimits`
- **Propósito:** Elimina contadores de rate limit inactivos (> 7 días sin requests)
- **Schedula:** Cada domingo a las 4 AM UTC
- **Colección:** `rateLimits`

### 7. `resetRateLimit` (HTTP Callable)
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

## 💾 Backup Automático - Configuración

### Cómo funciona

La función `backupAdminConfig` se ejecuta **cada domingo a las 1:00 AM UTC** y:

1. **Exporta colecciones administrativas** a Cloud Storage (JSON)
   - `categorias`, `zonas`, `eventos`, `ofertas`
2. **Almacena en:** `gs://proyecto/backups/admin-config/backup-YYYY-MM-DDTHH-MM-SS.json`
3. **Retiene:** Los últimos 52 backups (1 año completo de histórico)
4. **Limpia automáticamente:** Backups más antiguos se eliminan

### Estructura del backup

```json
{
  "timestamp": "2025-12-09T01:00:00.000Z",
  "version": "1.0",
  "collections": {
    "categorias": [
      { "id": "cat1", "nombre": "Categoría 1", "descripcion": "...", ... },
      ...
    ],
    "zonas": [ ... ],
    "eventos": [ ... ],
    "ofertas": [ ... ]
  }
}
```

### Listar backups disponibles (desde frontend)

```javascript
import { listBackups } from './src/utils/backupService';

const backups = await listBackups();
console.log(backups);
// [
//   { name: "backup-2025-12-09...", path: "...", timeCreated: "...", size: ... },
//   ...
// ]
```

### Descargar un backup

```javascript
import { downloadBackup, downloadBackupAsFile } from './src/utils/backupService';

// Opción 1: Obtener como objeto JSON
const backup = await downloadBackup('backups/admin-config/backup-...');

// Opción 2: Descargar como archivo
await downloadBackupAsFile(backup, 'backup-2025-12-09.json');
```

### Restaurar un backup (CUIDADO: Reemplaza datos)

```javascript
import { downloadBackup, restoreBackup } from './src/utils/backupService';

const backup = await downloadBackup('backups/admin-config/backup-...');

// Restaurar solo colecciones específicas (por seguridad)
const resultado = await restoreBackup(backup, [
  'categorias',  // Restaurar solo esto
  'zonas'
]);

console.log(resultado);
// { success: true, restauradas: 42, errores: [] }
```

### Ver estadísticas del backup

```javascript
import { getBackupStats } from './src/utils/backupService';

const stats = getBackupStats(backup);
console.log(stats);
// {
//   timestamp: "2025-12-09T01:00:00.000Z",
//   totalDocumentos: 152,
//   colecciones: {
//     categorias: 12,
//     zonas: 8,
//     eventos: 24,
//     ofertas: 108
//   }
// }
```

### Cambiar horario del backup

Edita `functions/index.js` línea con `backupAdminConfig`:

```javascript
// Cambiar de "0 1 * * 0" (domingo 1 AM) a otro horario
.pubsub.schedule("0 3 * * 0") // Domingo 3 AM
```

Luego desplega:
```bash
firebase deploy --only functions
```

---

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

1. **Backup automático:** ✅ Se ejecuta cada domingo a las 1:00 AM UTC. Mantiene 52 backups (1 año). Ver sección [Backup Automático](#-backup-automático---configuración).
2. **Soft delete:** Para auditoría, considera usar un campo `deleted: true` en lugar de eliminar (mejor para compliance).
3. **Retención legal:** Verifica si necesitas guardar logs más tiempo por regulaciones locales.
4. **Testing:** Prueba en colecciones de prueba primero.
5. **Permisos Storage:** Asegúrate de que las reglas de Security Rules de Storage permitan lectura/escritura de backups solo para admin.

## Referencias

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Pub/Sub Scheduler Documentation](https://firebase.google.com/docs/functions/schedule-functions)
- [Cron Expression Format](https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules)
