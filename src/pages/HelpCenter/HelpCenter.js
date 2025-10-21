import React, { useState } from "react";

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState("pedidos");

  const tabs = [
    { id: "pedidos", name: "Pedidos y Compras" },
    { id: "envios", name: "Envíos y Entregas" },
    { id: "devoluciones", name: "Devoluciones y Cambios" },
    { id: "seguridad", name: "Seguridad y Legal" },
    { id: "cuenta", name: "Cuenta y Perfil" },
  ];

  const faqs = {
    pedidos: [
      "¿Cómo hago un pedido?",
      "¿Puedo cancelar o modificar mi pedido?",
      "¿Qué formas de pago aceptan?",
      "¿Emitén factura?",
    ],
    envios: [
      "¿Cuánto tarda la entrega?",
      "¿Puedo hacer seguimiento a mi pedido?",
      "¿Qué ocurre si no estoy en casa al recibirlo?",
    ],
    devoluciones: [
      "¿Cómo puedo devolver un producto?",
      "¿Cuánto tarda un reembolso?",
      "¿Qué productos no pueden devolverse?",
    ],
    seguridad: [
      "¿Cómo protege PyroShop mis datos?",
      "¿Qué medidas de seguridad usan?",
      "¿Puedo eliminar mi cuenta?",
    ],
    cuenta: [
      "¿Cómo cambio mi contraseña?",
      "¿Cómo elimino mi cuenta?",
      "¿Cómo actualizo mis datos personales?",
    ],
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10 font-sans">
      {/* Encabezado */}
      <div className="text-center space-y-3 mb-10">
        <button className="bg-blue-900 text-blue-200 px-5 py-1 rounded-full text-sm">
          Centro de Ayuda
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">¿En qué podemos ayudarte?</h1>
        <p className="text-gray-400">Encuentra respuestas rápidas o contacta con nuestro equipo de soporte</p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="🔍 Buscar en preguntas frecuentes..."
            className="w-full md:w-1/2 p-3 rounded-lg bg-[#1e293b] text-gray-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Tarjetas de contacto */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-green-600 hover:bg-green-700 transition rounded-xl p-6 text-center shadow-lg">
          <div className="text-4xl mb-3">📞</div>
          <h3 className="font-bold text-lg mb-2">Teléfono</h3>
          <p className="text-sm mb-1">+57 (1) 234 5678</p>
          <p className="text-xs text-green-200 mb-3">L-V: 8:00-18:00, S: 9:00-13:00</p>
          <button className="bg-white text-green-700 px-4 py-1 rounded-lg font-semibold">
            Contactar
          </button>
        </div>

        <div className="bg-blue-700 hover:bg-blue-800 transition rounded-xl p-6 text-center shadow-lg">
          <div className="text-4xl mb-3">📧</div>
          <h3 className="font-bold text-lg mb-2">Email</h3>
          <p className="text-sm mb-1">soporte@pyroshop.co</p>
          <p className="text-xs text-blue-200 mb-3">Respuestas en 24h</p>
          <button className="bg-white text-blue-700 px-4 py-1 rounded-lg font-semibold">
            Contactar
          </button>
        </div>

        <div className="bg-orange-600 hover:bg-orange-700 transition rounded-xl p-6 text-center shadow-lg">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
          <p className="text-sm mb-1">+57 300 123 4567</p>
          <p className="text-xs text-orange-200 mb-3">L-V: 8:00-20:00</p>
          <button className="bg-white text-orange-700 px-4 py-1 rounded-lg font-semibold">
            Contactar
          </button>
        </div>
      </div>

      {/* Tabs de Preguntas Frecuentes */}
      <div className="mb-10">
        <div className="flex flex-wrap justify-center gap-2 border-b border-gray-700 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                activeTab === tab.id
                  ? "bg-blue-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-blue-900"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="bg-[#1e293b] mt-5 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold mb-4">{tabs.find(t => t.id === activeTab).name}</h2>
          <div className="space-y-3">
            {faqs[activeTab].map((q, i) => (
              <details key={i} className="bg-[#0f172a] rounded-lg p-3">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="text-gray-400 mt-2 text-sm">
                  Aquí irá la respuesta correspondiente a la pregunta "{q}".
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-purple-700 rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-3">📘 Guías y Tutoriales</h3>
          <ul className="text-sm space-y-2">
            <li>→ Cómo elegir el producto adecuado</li>
            <li>→ Guía de almacenamiento seguro</li>
            <li>→ Normas por comunidad autónoma</li>
            <li>→ Calculadora de cantidad por evento</li>
          </ul>
        </div>

        <div className="bg-orange-700 rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-3">❓¿No encuentras respuesta?</h3>
          <p className="text-sm mb-4 text-orange-100">
            Nuestro equipo está disponible para ayudarte con cualquier consulta específica.
          </p>
          <button className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-lg font-semibold">
            Abrir Chat de Soporte
          </button>
          <p className="text-xs text-orange-200 mt-3">Tiempo medio de respuesta: 5 minutos</p>
        </div>
      </div>
    </div>
  );
}
