const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Trigger: Actualiza contador de rate limit cuando se crea/actualiza documento
 * Se ejecuta después de cada operación en colecciones protegidas
 */
exports.updateRateLimitCounter = functions
  .region("us-central1")
  .firestore.document("{collection}/{docId}")
  .onWrite(async (change, context) => {
    const userId = change.after.exists ? change.after.data().usuarioId || change.after.data().uid : null;

    if (!userId) return;

    try {
      const rateLimitDoc = db.collection("rateLimits").doc(userId);
      const now = Date.now();
      const doc = await rateLimitDoc.get();

      if (!doc.exists) {
        // Primer request del usuario
        await rateLimitDoc.set({
          count: 1,
          lastReset: now,
          userId: userId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        const data = doc.data();
        const timeDiff = now - data.lastReset;

        if (timeDiff > 60000) {
          // Pasó más de 60 segundos, reiniciar contador
          await rateLimitDoc.update({
            count: 1,
            lastReset: now,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          // Incrementar contador
          await rateLimitDoc.update({
            count: admin.firestore.FieldValue.increment(1),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      // Log en auditoría si alcanza límite (opcional)
      if (doc.exists && doc.data().count >= 95) {
        console.warn(`⚠️ Usuario ${userId} se acerca al límite de rate limit (${doc.data().count}/100)`);
      }
    } catch (error) {
      console.error(`Error actualizando rate limit para ${userId}:`, error);
    }
  });

/**
 * Limpieza de contadores de rate limit expirados
 * Elimina registros de usuarios inactivos (sin requests en 7 días)
 * Se ejecuta cada semana
 */
exports.cleanupExpiredRateLimits = functions
  .region("us-central1")
  .pubsub.schedule("0 4 * * 0") // Cada domingo a las 4 AM UTC
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("🧹 Limpiando contadores de rate limit expirados...");

    try {
      const ahora = Date.now();
      const hace7Dias = ahora - 7 * 24 * 60 * 60 * 1000;

      const querySnapshot = await db
        .collection("rateLimits")
        .where("updatedAt", "<", new Date(hace7Dias))
        .limit(500)
        .get();

      if (querySnapshot.empty) {
        console.log("✅ No hay contadores expirados para limpiar.");
        return;
      }

      const batch = db.batch();
      let count = 0;

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });

      await batch.commit();

      console.log(`✅ Limpieza completada: ${count} contadores eliminados`);
    } catch (error) {
      console.error("❌ Error en limpieza de rate limits:", error);
    }
  });

/**
 * Endpoint HTTP para resetear rate limit manualmente (admin only)
 * Uso: POST /resetRateLimit con { userId: "xyz" }
 */
exports.resetRateLimit = functions
  .region("us-central1")
  .https.onCall(async (data, context) => {
    // Verificar autenticación
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Usuario no autenticado");
    }

    // Verificar que sea admin
    const userDoc = await db.collection("usuarios").doc(context.auth.uid).get();
    if (!userDoc.exists || userDoc.data().Rol !== "Admin") {
      throw new functions.https.HttpsError("permission-denied", "Solo admin puede resetear rate limits");
    }

    const { userId } = data;
    if (!userId) {
      throw new functions.https.HttpsError("invalid-argument", "userId es requerido");
    }

    try {
      await db.collection("rateLimits").doc(userId).set({
        count: 0,
        lastReset: Date.now(),
        userId: userId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        resetBy: context.auth.uid,
      });

      return { success: true, message: `Rate limit reseteado para ${userId}` };
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  });
