/**
 * Servicio de Backup y Restauración
 * Maneja descarga y restauración de backups administrativos
 */

import { db, storage } from "../firebaseConfig";
import { ref, listAll, getBytes } from "firebase/storage";
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  setDoc,
} from "firebase/firestore";

/**
 * Lista todos los backups disponibles en Storage
 * @returns {Promise<Array>} Array de objetos backup con metadata
 */
export const listBackups = async () => {
  try {
    const backupRef = ref(storage, "backups/admin-config");
    const result = await listAll(backupRef);

    const backups = await Promise.all(
      result.items.map(async (item) => {
        try {
          const metadata = await item.getMetadata?.();
          return {
            name: item.name,
            path: item.fullPath,
            timeCreated: metadata?.timeCreated || new Date().toISOString(),
            size: metadata?.size || 0,
          };
        } catch (e) {
          return {
            name: item.name,
            path: item.fullPath,
            timeCreated: new Date().toISOString(),
            size: 0,
          };
        }
      })
    );

    // Ordenar por fecha descendente (más reciente primero)
    return backups.sort(
      (a, b) => new Date(b.timeCreated) - new Date(a.timeCreated)
    );
  } catch (error) {
    console.error("Error al listar backups:", error);
    throw error;
  }
};

/**
 * Descarga un backup específico
 * @param {string} backupPath - Ruta completa del backup en Storage
 * @returns {Promise<Object>} Objeto con la configuración del backup
 */
export const downloadBackup = async (backupPath) => {
  try {
    const fileRef = ref(storage, backupPath);
    const data = await getBytes(fileRef);
    const text = new TextDecoder().decode(data);
    return JSON.parse(text);
  } catch (error) {
    console.error("Error al descargar backup:", error);
    throw error;
  }
};

/**
 * Restaura un backup a Firestore
 * ADVERTENCIA: Esto REEMPLAZARÁ los documentos existentes
 * @param {Object} backup - Objeto del backup descargado
 * @param {Array<string>} coleccionesARestaurar - Colecciones a restaurar (por seguridad)
 * @returns {Promise<Object>} Resultado de la restauración
 */
export const restoreBackup = async (
  backup,
  coleccionesARestaurar = ["categorias", "zonas", "eventos", "ofertas"]
) => {
  try {
    const resultado = {
      success: true,
      restauradas: 0,
      errores: [],
    };

    if (!backup.collections) {
      throw new Error("Formato de backup inválido: falta 'collections'");
    }

    // Restaurar cada colección
    for (const coleccion of coleccionesARestaurar) {
      if (!backup.collections[coleccion]) {
        console.warn(`⚠️ Colección '${coleccion}' no encontrada en backup`);
        continue;
      }

      try {
        const documentos = backup.collections[coleccion];
        const batch = writeBatch(db);
        let count = 0;

        for (const doc of documentos) {
          const { id, ...data } = doc;
          const docRef = doc(db, coleccion, id);
          batch.set(docRef, data, { merge: false }); // merge: false reemplaza completamente
          count++;

          // Firestore tiene límite de 500 operaciones por batch
          if (count % 500 === 0) {
            await batch.commit();
          }
        }

        // Commit final
        if (count % 500 !== 0) {
          await batch.commit();
        }

        console.log(`✅ Colección '${coleccion}': ${count} documentos restaurados`);
        resultado.restauradas += count;
      } catch (error) {
        const msg = `Error restaurando '${coleccion}': ${error.message}`;
        console.error(msg);
        resultado.errores.push(msg);
      }
    }

    return resultado;
  } catch (error) {
    console.error("Error en restauración:", error);
    throw error;
  }
};

/**
 * Descarga un backup como archivo JSON
 * @param {Object} backup - Objeto del backup
 * @param {string} filename - Nombre del archivo a descargar
 */
export const downloadBackupAsFile = (backup, filename = "backup-admin.json") => {
  try {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`✅ Backup descargado: ${filename}`);
  } catch (error) {
    console.error("Error al descargar archivo:", error);
    throw error;
  }
};

/**
 * Obtiene estadísticas del backup (cuántos documentos, tamaño aprox)
 * @param {Object} backup - Objeto del backup
 * @returns {Object} Estadísticas
 */
export const getBackupStats = (backup) => {
  const stats = {
    timestamp: backup.timestamp,
    totalDocumentos: 0,
    colecciones: {},
  };

  if (backup.collections) {
    for (const [coleccion, documentos] of Object.entries(
      backup.collections
    )) {
      const count = Array.isArray(documentos) ? documentos.length : 0;
      stats.colecciones[coleccion] = count;
      stats.totalDocumentos += count;
    }
  }

  return stats;
};
