import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Gracias.css";
import { FaCheckCircle, FaHome, FaReceipt } from "react-icons/fa";


export default function Gracias() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || "N/A";

  return (
    <div className="gracias-container">
      <div className="gracias-card">
        <FaCheckCircle className="icon-success" />
        <h1>¡Gracias por tu compra! 🎉</h1>
        <p>Tu pedido fue recibido y está siendo procesado.</p>

        <div className="order-box">
          <span>ID del Pedido:</span>
          <b>{orderId}</b>
        </div>

        <div className="btn-box">
          <button className="btn-home" onClick={() => navigate("/")}>
            <FaHome /> Volver a la tienda
          </button>

          
         
        </div>
      </div>
    </div>
  );
}
