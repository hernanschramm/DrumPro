// ============================================================
// DrumPro Academy - Panel de Progreso del Alumno
// Fase 5: Evaluaciones y Progreso
// Gráficos de evolución, estadísticas y logros
// ============================================================

import React from 'react';
import { UserProfile, Evaluacion, TareaAsignacion, Tarea } from '../../../types/academy';

interface ProgressDashboardProps {
  alumno: UserProfile;
  evaluaciones: Evaluacion[];
  asignaciones: TareaAsignacion[];
  tareas: Tarea[];
}

export default function ProgressDashboard({ alumno, evaluaciones, asignaciones, tareas }: ProgressDashboardProps) {
  // Calcular estadísticas
  const tareasCompletadas = asignaciones.filter(a => a.estado === 'aprobada').length;
  const tareasPendientes = asignaciones.filter(a => a.estado === 'pendiente').length;
  const promedioGeneral = evaluaciones.length > 0
    ? Math.round(evaluaciones.reduce((sum, e) => sum + (e.puntajeObtenido || 0), 0) / evaluaciones.length)
    : 0;

  // Datos para gráfico de evolución
  const evaluacionesOrdenadas = [...evaluaciones].sort((a, b) => 
    new Date(a.fechaEvaluacion).getTime() - new Date(b.fechaEvaluacion).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Progreso de {alumno.fullName}</h2>
        <p className="text-blue-100">Seguimiento de evolución y logros</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-green-600">{tareasCompletadas}</div>
          <div className="text-gray-600 mt-2">Tareas completadas</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-yellow-600">{tareasPendientes}</div>
          <div className="text-gray-600 mt-2">Tareas pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-blue-600">{evaluaciones.length}</div>
          <div className="text-gray-600 mt-2">Evaluaciones</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-purple-600">{promedioGeneral}%</div>
          <div className="text-gray-600 mt-2">Promedio general</div>
        </div>
      </div>

      {/* Gráfico de evolución */}
      {evaluacionesOrdenadas.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Evolución de Calificaciones</h3>
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((value) => (
                <g key={value}>
                  <line
                    x1="50"
                    y1={250 - (value * 2)}
                    x2="750"
                    y2={250 - (value * 2)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text x="10" y={255 - (value * 2)} fontSize="12" fill="#6b7280">
                    {value}%
                  </text>
                </g>
              ))}

              {/* Line chart */}
              {evaluacionesOrdenadas.length > 1 && (
                <polyline
                  points={evaluacionesOrdenadas.map((evaluacion, i) => {
                    const x = 50 + (i * (700 / (evaluacionesOrdenadas.length - 1)));
                    const porcentaje = ((evaluacion.puntajeObtenido || 0) / evaluacion.puntajeTotal) * 100;
                    const y = 250 - (porcentaje * 2);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
              )}

              {/* Points */}
              {evaluacionesOrdenadas.map((evaluacion, i) => {
                const x = 50 + (evaluacionesOrdenadas.length > 1 ? (i * (700 / (evaluacionesOrdenadas.length - 1))) : 350);
                const porcentaje = ((evaluacion.puntajeObtenido || 0) / evaluacion.puntajeTotal) * 100;
                const y = 250 - (porcentaje * 2);
                return (
                  <g key={evaluacion.id}>
                    <circle cx={x} cy={y} r="6" fill="#3b82f6" />
                    <circle cx={x} cy={y} r="3" fill="white" />
                    <text x={x} y={y - 15} fontSize="11" fill="#374151" textAnchor="middle">
                      {Math.round(porcentaje)}%
                    </text>
                    <text x={x} y={270} fontSize="10" fill="#6b7280" textAnchor="middle">
                      {new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-ES', { month: 'short' })}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Historial de evaluaciones */}
      {evaluaciones.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Historial de Evaluaciones</h3>
          <div className="space-y-3">
            {evaluacionesOrdenadas.reverse().map((evaluacion) => {
              const porcentaje = Math.round(((evaluacion.puntajeObtenido || 0) / evaluacion.puntajeTotal) * 100);
              return (
                <div key={evaluacion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">{evaluacion.titulo}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{porcentaje}%</div>
                      <div className="text-sm text-gray-500">
                        {evaluacion.puntajeObtenido}/{evaluacion.puntajeTotal}
                      </div>
                    </div>
                  </div>

                  {/* Criterios */}
                  <div className="mt-3 space-y-2">
                    {evaluacion.criterios.map((criterio) => (
                      <div key={criterio.id} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-32">{criterio.nombre}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              ((criterio.puntajeObtenido || 0) / criterio.puntajeMaximo) >= 0.7
                                ? 'bg-green-500'
                                : ((criterio.puntajeObtenido || 0) / criterio.puntajeMaximo) >= 0.5
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{
                              width: `${((criterio.puntajeObtenido || 0) / criterio.puntajeMaximo) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-20 text-right">
                          {criterio.puntajeObtenido}/{criterio.puntajeMaximo}
                        </span>
                      </div>
                    ))}
                  </div>

                  {evaluacion.observaciones && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">{evaluacion.observaciones}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensaje si no hay evaluaciones */}
      {evaluaciones.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sin evaluaciones aún</h3>
          <p className="text-gray-600">
            Las evaluaciones aparecerán aquí cuando el profesor las cree
          </p>
        </div>
      )}
    </div>
  );
}
