// ============================================================
// DrumPro Academy - Componente de Evaluación
// Fase 5: Evaluaciones y Progreso
// Evaluaciones periódicas con rúbricas configurables
// ============================================================

import React, { useState } from 'react';
import { Evaluacion, CriterioEvaluacion, UserProfile } from '../../../types/academy';

interface EvaluationFormProps {
  alumno: UserProfile;
  evaluacion?: Evaluacion | null;
  onSave: (evaluacion: Omit<Evaluacion, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function EvaluationForm({ alumno, evaluacion, onSave, onCancel }: EvaluationFormProps) {
  const [formData, setFormData] = useState({
    titulo: evaluacion?.titulo || '',
    descripcion: evaluacion?.descripcion || '',
    observaciones: evaluacion?.observaciones || '',
    criterios: evaluacion?.criterios || [
      { id: '1', nombre: 'Tiempo', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
      { id: '2', nombre: 'Limpieza', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
      { id: '3', nombre: 'Dinámica', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
      { id: '4', nombre: 'Coordinación', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
      { id: '5', nombre: 'Lectura', puntajeMaximo: 20, puntajeObtenido: 0, comentario: '' },
    ],
  });

  const [error, setError] = useState('');

  // Calcular puntaje total
  const puntajeTotal = formData.criterios.reduce((sum, c) => sum + c.puntajeMaximo, 0);
  const puntajeObtenido = formData.criterios.reduce((sum, c) => sum + (c.puntajeObtenido || 0), 0);
  const porcentaje = puntajeTotal > 0 ? Math.round((puntajeObtenido / puntajeTotal) * 100) : 0;

  // Actualizar criterio
  const updateCriterio = (index: number, field: keyof CriterioEvaluacion, value: any) => {
    const newCriterios = [...formData.criterios];
    newCriterios[index] = { ...newCriterios[index], [field]: value };
    setFormData({ ...formData, criterios: newCriterios });
  };

  // Agregar criterio personalizado
  const addCriterio = () => {
    const newCriterio: CriterioEvaluacion = {
      id: Date.now().toString(),
      nombre: 'Nuevo criterio',
      puntajeMaximo: 10,
      puntajeObtenido: 0,
      comentario: '',
    };
    setFormData({ ...formData, criterios: [...formData.criterios, newCriterio] });
  };

  // Eliminar criterio
  const removeCriterio = (index: number) => {
    if (formData.criterios.length > 1) {
      setFormData({ ...formData, criterios: formData.criterios.filter((_, i) => i !== index) });
    }
  };

  // Enviar evaluación
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    onSave({
      profesorId: '', // Se llenará en el componente padre
      alumnoId: alumno.id,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fechaEvaluacion: new Date().toISOString(),
      puntajeTotal,
      puntajeObtenido,
      observaciones: formData.observaciones,
      criterios: formData.criterios,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {evaluacion ? 'Editar Evaluación' : 'Nueva Evaluación'}
      </h2>
      <p className="text-gray-600 mb-6">Alumno: {alumno.fullName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la evaluación *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Evaluación mensual - Diciembre"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe el propósito de esta evaluación..."
          />
        </div>

        {/* Rúbrica de criterios */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Criterios de evaluación
            </label>
            <button
              type="button"
              onClick={addCriterio}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              + Agregar criterio
            </button>
          </div>

          <div className="space-y-3">
            {formData.criterios.map((criterio, index) => (
              <div key={criterio.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={criterio.nombre}
                    onChange={(e) => updateCriterio(index, 'nombre', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del criterio"
                  />
                  <input
                    type="number"
                    value={criterio.puntajeMaximo}
                    onChange={(e) => updateCriterio(index, 'puntajeMaximo', parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">pts</span>
                  {formData.criterios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriterio(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Slider de puntaje obtenido */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Puntaje obtenido</span>
                    <span className="text-sm font-medium text-gray-700">
                      {criterio.puntajeObtenido} / {criterio.puntajeMaximo}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={criterio.puntajeMaximo}
                    value={criterio.puntajeObtenido}
                    onChange={(e) => updateCriterio(index, 'puntajeObtenido', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Comentario */}
                <textarea
                  value={criterio.comentario}
                  onChange={(e) => updateCriterio(index, 'comentario', e.target.value)}
                  placeholder={`Comentario sobre ${criterio.nombre.toLowerCase()}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Puntaje total */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-gray-800">Puntaje Total</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{puntajeObtenido}</div>
              <div className="text-sm text-gray-600">de {puntajeTotal}</div>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                porcentaje >= 70 ? 'bg-green-500' : porcentaje >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-600 mt-1">{porcentaje}%</div>
        </div>

        {/* Observaciones generales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones generales
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Observaciones generales sobre el desempeño del alumno..."
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {evaluacion ? 'Actualizar Evaluación' : 'Crear Evaluación'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
