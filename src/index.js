import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// 👉 Importar Firebase para asegurarnos de que se carga antes de la app
import "./firebaseConfig";
// (No necesitas usar nada aquí; solo cargarlo ya inicializa Firebase)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Medición de rendimiento (lo dejo igual)
reportWebVitals();
