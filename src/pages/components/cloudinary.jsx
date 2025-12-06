import { useState, useRef } from "react";
import Compressor from "compressorjs";

// 🔥 CONFIG CLOUDINARY
const CLOUD_NAME = "const CLOUD_NAME = Raíz";
const UPLOAD_PRESET = "react-test";
const API_KEY = "435252382541262"; // ← Reemplaza con tu API Key real
const FOLDER = "inventario"; // ← Carpeta personalizada

export default function ImageUploader({ onImageUpload, currentImage }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropRef = useRef(null);

  const subirImagenCloudinary = async (file) => {
    setUploading(true);
    setProgress(0);

    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.7, // 70% calidad (reduce MUCHO el peso)
        maxWidth: 1200,
        success(compressedFile) {
          const formData = new FormData();
          formData.append("file", compressedFile);
          formData.append("upload_preset", UPLOAD_PRESET);
          formData.append("api_key", API_KEY);
          formData.append("folder", FOLDER);

          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            true
          );

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded * 100) / e.total));
            }
          };

          xhr.onload = () => {
            const response = JSON.parse(xhr.responseText);

            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(response.secure_url);
            } else {
              reject(response.error?.message || "Error al subir");
            }

            setUploading(false);
          };

          xhr.onerror = () => {
            setUploading(false);
            reject("Error de red");
          };

          xhr.send(formData);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  // 📌 CLICK normal
  const handleFile = async (e) => {
    if (!e.target.files[0]) return;
    procesarArchivo(e.target.files[0]);
  };

  // 📌 Procesa el archivo con validaciones
  const procesarArchivo = async (file) => {
    if (!file.type.startsWith("image/")) {
      return alert("Solo se permiten imágenes");
    }

    if (file.size > 5 * 1024 * 1024) {
      return alert("La imagen es demasiado grande (máximo 5MB).");
    }

    try {
      const url = await subirImagenCloudinary(file);
      onImageUpload(url);
    } catch (err) {
      alert("Error al subir: " + err);
    }
  };

  // 📌 DRAG & DROP
  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.style.borderColor = "#ccc";
    const file = e.dataTransfer.files[0];
    if (file) procesarArchivo(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.style.borderColor = "#007bff";
  };

  const handleDragLeave = () => {
    dropRef.current.style.borderColor = "#ccc";
  };

  return (
    <div>
      {/* Vista previa */}
      {currentImage && (
        <img
          src={currentImage}
          alt="preview"
          style={{
            width: "100%",
            maxWidth: 300,
            borderRadius: 10,
            marginBottom: 15,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        />
      )}

      {/* Drag & Drop Zone */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: "2px dashed #ccc",
          padding: 30,
          borderRadius: 10,
          textAlign: "center",
          marginBottom: 15,
          transition: "0.2s",
        }}
      >
        Arrastra tu imagen aquí 📁  
        <br />
        — o —
        <br />
        <label
          style={{
            display: "inline-block",
            marginTop: 10,
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Seleccionar imagen
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            hidden
          />
        </label>
      </div>

      {/* Barra de progreso */}
      {uploading && (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              height: 10,
              background: "#ddd",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#007bff",
                transition: "0.2s",
              }}
            />
          </div>
          <p style={{ textAlign: "center", marginTop: 5 }}>{progress}%</p>
        </div>
      )}
    </div>
  );
}
