import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Categorias.css';

const categoriasData = [
  {
    id: 1,
    nombre: 'Bengalas',
    descripcion: 'Bengalas de mano y humo de colores para celebraciones',
    lista: [
      { id: 1, nombre: 'Bengala Dorada', precio: '$5.000', stock: 20 },
      { id: 2, nombre: 'Bengala Roja', precio: '$4.500', stock: 15 },
      { id: 3, nombre: 'Bengala Azul', precio: '$6.000', stock: 10 },
    ],
  },
  {
    id: 2,
    nombre: 'Cohetes',
    descripcion: 'Cohetes y voladores con efectos espectaculares',
    lista: [
      { id: 1, nombre: 'Cohete Titanio', precio: '$12.000', stock: 8 },
      { id: 2, nombre: 'Volador Estelar', precio: '$9.000', stock: 12 },
    ],
  },
  {
    id: 3,
    nombre: 'Fuentes',
    descripcion: 'Fuentes pirotécnicas con efectos visuales',
    lista: [
      { id: 1, nombre: 'Fuente Dorada', precio: '$15.000', stock: 10 },
      { id: 2, nombre: 'Fuente Plateada', precio: '$17.000', stock: 6 },
    ],
  },
  {
    id: 4,
    nombre: 'Baterías',
    descripcion: 'Baterías profesionales de múltiples disparos',
    lista: [
      { id: 1, nombre: 'Batería 25 Tiros', precio: '$40.000', stock: 5 },
      { id: 2, nombre: 'Batería Thunder', precio: '$50.000', stock: 4 },
    ],
  },
];

export default function CategoriaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const categoria = categoriasData.find((c) => c.id === parseInt(id));

  if (!categoria) {
    return <h2>Categoría no encontrada</h2>;
  }

  return (
    <div className="detalle-page">
      <button className="btn-volver" onClick={() => navigate('/')}>← Volver</button>
      <h2>{categoria.nombre}</h2>
      <p>{categoria.descripcion}</p>

      <div className="productos-grid">
        {categoria.lista.map((p) => (
          <div key={p.id} className="producto-card">
            <div className="producto-info">
              <h4>{p.nombre}</h4>
              <p className="precio">{p.precio}</p>
              <p className="stock">Stock: {p.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
