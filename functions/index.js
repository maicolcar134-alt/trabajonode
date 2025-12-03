const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Importar controladores de rate limit
const rateLimitFunctions = require("./rateLimitController");

/**
 * Limpieza diaria de logs de auditoría
 * Elimina registros más antiguos de 90 días
 * Se ejecuta cada día a las 2:00 AM UTC
 */
exports.cleanupAuditoria = functions
  .region("us-central1")
  .pubsub.schedule("0 2 * * *") // Cada día a las 2 AM UTC
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("🧹 Iniciando limpieza de auditoría...");

    try {
      const ahora = new Date();
      const hace90Dias = new Date(ahora.getTime() - 90 * 24 * 60 * 60 * 1000);

      // Consultar logs más antiguos de 90 días
      const querySnapshot = await db
        .collection("auditoria")
        .where("fecha", "<", admin.firestore.Timestamp.fromDate(hace90Dias))
        .limit(500) // Limitar a 500 por ejecución para evitar timeout
        .get();

      if (querySnapshot.empty) {
        console.log("✅ No hay logs para eliminar.");
        return { success: true, deletedCount: 0, message: "No data to delete" };
      }

      // Batch delete
      const batch = db.batch();
      let count = 0;

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });

      await batch.commit();

      console.log(`✅ Limpieza completada: ${count} logs eliminados`);
      return { success: true, deletedCount: count };
    } catch (error) {
      console.error("❌ Error en limpieza de auditoría:", error);
      return { success: false, error: error.message };
    }
  });

/**
 * Limpieza de pedidos cancelados
 * Elimina pedidos con estado 'cancelado' más antiguos de 30 días
 * Se ejecuta cada lunes a las 3:00 AM UTC
 */
exports.cleanupPedidosCancelados = functions
  .region("us-central1")
  .pubsub.schedule("0 3 * * 1") // Cada lunes a las 3 AM UTC
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("🧹 Iniciando limpieza de pedidos cancelados...");

    try {
      const ahora = new Date();
      const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Consultar pedidos cancelados más antiguos de 30 días
      const querySnapshot = await db
        .collection("pedidos")
        .where("estado", "==", "cancelado")
        .where("fecha", "<", admin.firestore.Timestamp.fromDate(hace30Dias))
        .limit(500)
        .get();

      if (querySnapshot.empty) {
        console.log("✅ No hay pedidos cancelados para eliminar.");
        return { success: true, deletedCount: 0, message: "No data to delete" };
      }

      // Batch delete
      const batch = db.batch();
      let count = 0;

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });

      await batch.commit();

      console.log(`✅ Limpieza completada: ${count} pedidos eliminados`);
      return { success: true, deletedCount: count };
    } catch (error) {
      console.error("❌ Error en limpieza de pedidos:", error);
      return { success: false, error: error.message };
    }
  });

/**
 * Limpieza de sesiones expiradas (opcional)
 * Elimina documentos de sesión/carrito más antiguos de 7 días
 * Se ejecuta cada 6 horas
 */
exports.cleanupSesiones = functions
  .region("us-central1")
  .pubsub.schedule("0 */6 * * *") // Cada 6 horas
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("🧹 Iniciando limpieza de sesiones...");

    try {
      const ahora = new Date();
      const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Si tienes una colección de sesiones, descomentar:
      // const querySnapshot = await db
      //   .collection('sesiones')
      //   .where('ultimaActividad', '<', admin.firestore.Timestamp.fromDate(hace7Dias))
      //   .limit(500)
      //   .get();

      // Por ahora, solo log
      console.log("✅ Limpieza de sesiones completada (no hay colección configurada)");
      return { success: true, message: "Sesiones check - no collection configured" };
    } catch (error) {
      console.error("❌ Error en limpieza de sesiones:", error);
      return { success: false, error: error.message };
    }
  });

// =====================================================
// EXPORTAR FUNCIONES DE RATE LIMIT
// =====================================================
module.exports = {
  ...exports,
  ...rateLimitFunctions,
};
