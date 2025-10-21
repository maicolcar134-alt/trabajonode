import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriasAdmin.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const categoriasData = [
  {
    id: 1,
    nombre: 'Bengalas',
    productos: 45,
    descripcion: 'Bengalas de mano y humo de colores para celebraciones',
    imagen: '/img/bengalas.jpg',
    icono: 'fa-solid fa-sparkles',
    link: '/bengalas',
  },
  {
    id: 2,
    nombre: 'Cohetes',
    productos: 32,
    descripcion: 'Cohetes y voladores con efectos espectaculares',
    imagen: '/img/cohetes.jpg',
    icono: 'fa-solid fa-rocket',
    link: '/cohetes',
  },
  {
    id: 3,
    nombre: 'Fuentes',
    productos: 28,
    descripcion: 'Fuentes pirotécnicas con efectos visuales',
    imagen: '/img/fuentes.jpg',
    icono: 'fa-solid fa-fire',
    link: '/fuentes',
  },
  {
    id: 4,
    nombre: 'Baterías',
    productos: 15,
    descripcion: 'Baterías profesionales de múltiples disparos',
    imagen: '/img/baterias.jpg',
    icono: 'fa-solid fa-bolt',
    link: '/baterias',
  },
  {
    id: 5,
    nombre: 'Packs',
    productos: 12,
    descripcion: 'Packs completos para todo tipo de eventos',
    imagen: '/img/packs.jpg',
    icono: 'fa-solid fa-gift',
    link: '/packs',
  },
  {
    id: 6,
    nombre: 'Accesorios',
    productos: 20,
    descripcion: 'Accesorios de seguridad y complementos',
    imagen: '/img/accesorios.jpg',
    icono: 'fa-solid fa-box',
    link: '/accesorios',
  },
  {
    id: 7,
    nombre: 'Luces',
    productos: 25,
    descripcion: 'Luces festivas y decorativas para ambientes',
    imagen: '/img/luces.jpg',
    icono: 'fa-solid fa-lightbulb',
    link: '/luces',
  },
  {
    id: 8,
    nombre: 'Petardos',
    productos: 30,
    descripcion: 'Petardos de distintos niveles y tamaños',
    imagen: '/img/petardos.jpg',
    icono: 'fa-solid fa-bomb',
    link: '/petardos',
  },
  {
    id: 9,
    nombre: 'Efectos Especiales',
    productos: 18,
    descripcion: 'Humo, chispas y efectos especiales visuales',
    imagen: '/img/efectos.jpg',
    icono: 'fa-solid fa-magic',
    link: '/efectos',
  },
];

export default function CategoriasAdmin() {
  const navigate = useNavigate();

  const abrirCategoria = (ruta) => {
    // Abrir la página específica de la categoría
    window.open(ruta, '_blank');
  };

  return (
    <div className="categorias-page">
      <h2>Categorías de Productos</h2>
      <p>Explora nuestra amplia selección de productos pirotécnicos certificados y legales</p>

      <div className="grid-categorias">
        {categoriasData.map((cat) => (
          <div
            key={cat.id}
            className="categoria-card"
            onClick={() => abrirCategoria(cat.link)}
          >
            <img src={cat.imagen} alt={cat.nombre} />
            <div className="categoria-info">
              <i className={cat.icono}></i>
              <h3>{cat.nombre}</h3>
              <p>{cat.descripcion}</p>
              <span className="badge">{cat.productos} productos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
