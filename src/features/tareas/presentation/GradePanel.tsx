// ============================================================
// DrumPro Academy - Panel de Calificación del Profesor
// Fase 4: Tareas y Entregas
// Rúbricas configurables con criterios y puntajes
// ============================================================

import React, { useState } from 'react';
import { TareaAsignacion, Tarea } from '../../../types/academy';

interface GradePanelProps {
  asignacion: TareaAsignacion;
  tarea: Tarea;
  onGrade: (puntaje: number, feedback: string, criterios: CriterioCalificacion[]) => void;
  onCancel: () => void;
}

export interface CriterioCalificacion {
  nombre: string;
  puntajeMaximo: number;
  puntajeObtenido: number;
  comentario: string;
}

// Criterios por defecto para evaluación de batería
const DEFAULT_CRITERIOS: CriterioCalificacion[] = [
  { nombre: 'Tiempo', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
  { nombre: 'Limpieza', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
  { nombre: 'Dinámica', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
  { nombre: 'Coordinación', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
  { nombre: 'Lectura', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
];

export default function GradePanel({ asignacion, tarea, onGrade, onCancel }: GradePanelProps) {
  const [criterios, setCriterios] = useState<CriterioCalificacion[]>(DEFAULT_CRITERIOS);
  const [feedbackGeneral, setFeedbackGeneral] = useState('');
  const [estado, setEstado] = useState<'aprobada' | 'con_correcciones'>('aprobada');

  // Calcular puntaje total
  const puntajeTotal = criterios.reduce((sum, c) => sum + c.puntajeObtenido, 0);
  const porcentaje = Math.round((puntajeTotal / tarea.puntajeMaximo) * 100);

  // Actualizar criterio
  const updateCriterio = (index: number, field: keyof CriterioCalificacion, value: any) => {
    const newCriterios = [...criterios];
    newCriterios[index] = { ...newCriterios[index], [field]: value };
    setCriterios(newCriterios);
  };

  // Enviar calificación
  const handleSubmit = () => {
    onGrade(puntajeTotal, feedbackGeneral, criterios);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Calificar Entrega</h3>
        <p className="text-gray-400 text-sm">
          Tarea: {tarea.titulo} • Puntaje máximo: {tarea.puntajeMaximo}
        </p>
      </div>

      {/* Rúbrica de criterios */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Rúbrica de Evaluación</h4>
        
        {criterios.map((criterio, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{criterio.nombre}</span>
              <span className="text-gray-400 text-sm">
                {criterio.puntajeObtenido} / {criterio.puntajeMaximo}
              </span>
            </div>
            
            {/* Slider de puntaje */}
            <input
              type="range"
              min="0"
              max={criterio.puntajeMaximo}
              value={criterio.puntajeObtenido}
              onChange={(e) => updateCriterio(index, 'puntajeObtenido', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            
            {/* Comentario */}
            <textarea
              value={criterio.comentario}
              onChange={(e) => updateCriterio(index, 'comentario', e.target.value)}
              placeholder={`Comentario sobre ${criterio.nombre.toLowerCase()}...`}
              className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 text-sm resize-none"
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Puntaje total */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-bold text-lg">Puntaje Total</span>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-500">{puntajeTotal}</div>
            <div className="text-gray-400 text-sm">de {tarea.puntajeMaximo}</div>
          </div>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              porcentaje >= 70 ? 'bg-green-500' : porcentaje >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        <div className="text-right text-sm text-gray-400 mt-1">{porcentaje}%</div>
      </div>

      {/* Estado */}
      <div className="space-y-2">
        <label className="text-white font-medium">Estado de la entrega:</label>
        <div className="flex gap-3">
          <button
            onClick={() => setEstado('aprobada')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              estado === 'aprobada'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ✅ Aprobada
          </button>
          <button
            onClick={() => setEstado('con_correcciones')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              estado === 'con_correcciones'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ⚠️ Con correcciones
          </button>
        </div>
      </div>

      {/* Feedback general */}
      <div className="space-y-2">
        <label className="text-white font-medium">Feedback general:</label>
        <textarea
          value={feedbackGeneral}
          onChange={(e) => setFeedbackGeneral(e.target.value)}
          placeholder="Comentarios generales para el alumno..."
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 resize-none"
          rows={4}
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={puntajeTotal === 0}
          className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
        >
          Enviar Calificación
        </button>
      </div>
    </div>
  );
}
