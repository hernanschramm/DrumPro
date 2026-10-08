// ============================================================
// DrumPro Academy - Panel de Alumno
// Fase 2: Ver tareas, clases, biblioteca y progreso
// ============================================================

import React, { useState } from 'react';
import { useAcademy } from '../../../store/AcademyContext';
import { Clase, Tarea, TareaAsignacion } from '../../../types/academy';
import CalendarView from '../../clases/presentation/CalendarView';
import ClassDetail from '../../clases/presentation/ClassDetail';
import TaskDetailAlumno from '../../tareas/presentation/TaskDetailAlumno';
import ProgressDashboard from '../../progreso/presentation/ProgressDashboard';

export default function AlumnoPanel() {
  const { state, dispatch } = useAcademy();
  const [activeTab, setActiveTab] = useState<'tareas' | 'clases' | 'biblioteca' | 'progreso'>('tareas');
  const [selectedClass, setSelectedClass] = useState<Clase | null>(null);
  const [selectedTask, setSelectedTask] = useState<{ tarea: Tarea; asignacion: TareaAsignacion } | null>(null);

  const currentUser = state.currentUser!;
  const profesor = state.users.find(u => u.id === currentUser.profesorId);
  const misAsignaciones = state.asignaciones.filter(a => a.alumnoId === currentUser.id);
  const misClases = state.clases.filter(c => c.alumnoId === currentUser.id);
  const misNotificaciones = state.notificaciones.filter(n => n.usuarioId === currentUser.id && !n.leida);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-green-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎵 Mi Panel</h1>
            <p className="text-green-100 text-sm">Bienvenido, {currentUser.fullName}</p>
          </div>
          {misNotificaciones.length > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {misNotificaciones.length}
            </div>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-white">
        {[
          { id: 'tareas', label: 'Tareas', count: misAsignaciones.filter(a => a.estado === 'pendiente').length },
          { id: 'clases', label: 'Clases', count: misClases.length },
          { id: 'biblioteca', label: 'Biblioteca', count: state.rudimentos.length },
          { id: 'progreso', label: 'Progreso', count: 0 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
            }`}
          >
            {tab.label} {tab.count > 0 && `(${tab.count})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'tareas' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Tareas</h2>
            
            {misNotificaciones.length > 0 && (
              <div className="mb-6 space-y-2">
                {misNotificaciones.map(notif => (
                  <div key={notif.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start justify-between">
                    <div>
                      <div className="font-medium text-blue-900 text-sm">{notif.titulo}</div>
                      <div className="text-xs text-blue-700">{notif.mensaje}</div>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id })}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {misAsignaciones.map(asig => {
                const tarea = state.tareas.find(t => t.id === asig.tareaId);
                if (!tarea) return null;

                return (
                  <div key={asig.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{tarea.titulo}</h3>
                        <p className="text-sm text-gray-500">
                          Fecha límite: {new Date(tarea.fechaLimite).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        asig.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        asig.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                        asig.estado === 'entregada' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {asig.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{tarea.consigna}</p>
                    
                    <button
                      onClick={() => setSelectedTask({ tarea, asignacion: asig })}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
                    >
                      {asig.estado === 'pendiente' || asig.estado === 'con_correcciones' ? '📹 Ver y Entregar' : '👁️ Ver Detalle'}
                    </button>

                    {asig.estado === 'aprobada' && asig.puntaje !== undefined && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-900">Calificación:</span>
                          <span className="text-2xl font-bold text-green-600">{asig.puntaje}/{tarea.puntajeMaximo}</span>
                        </div>
                        {asig.correccionTexto && (
                          <p className="text-sm text-green-800 mt-2">{asig.correccionTexto}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detalle de tarea */}
            {selectedTask && (
              <TaskDetailAlumno
                tarea={selectedTask.tarea}
                asignacion={selectedTask.asignacion}
                entregas={state.entregas.filter(e => e.asignacionId === selectedTask.asignacion.id)}
                onDeliver={(entrega) => {
                  dispatch({ type: 'ADD_ENTREGA', payload: entrega });
                  dispatch({
                    type: 'UPDATE_ASIGNACION',
                    payload: { ...selectedTask.asignacion, estado: 'entregada', fechaEntrega: new Date().toISOString() },
                  });
                  setSelectedTask(null);
                }}
                onClose={() => setSelectedTask(null)}
              />
            )}
          </div>
        )}

        {activeTab === 'clases' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Clases</h2>
            
            {/* Calendario */}
            <div className="mb-6">
              <CalendarView
                clases={misClases}
                onClassClick={(clase: Clase) => setSelectedClass(clase)}
              />
            </div>

            {/* Próximas clases */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">Próximas Clases</h3>
            {misClases.filter(c => new Date(c.fechaInicio) > new Date() && c.estado === 'programada').length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                <div className="text-4xl mb-2">📅</div>
                <p>No tienes clases próximas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {misClases
                  .filter(c => new Date(c.fechaInicio) > new Date() && c.estado === 'programada')
                  .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
                  .map(clase => (
                    <div
                      key={clase.id}
                      onClick={() => setSelectedClass(clase)}
                      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{clase.titulo}</h4>
                          <p className="text-sm text-gray-600">Profesor: {profesor?.fullName}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Programada
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>📅 {new Date(clase.fechaInicio).toLocaleDateString('es-ES')}</span>
                        <span>🕐 {new Date(clase.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {clase.videollamadaUrl && (
                        <a
                          href={clase.videollamadaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium"
                        >
                          📹 Unirse a videollamada
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Detalle de clase */}
            {selectedClass && (
              <ClassDetail
                clase={selectedClass}
                profesor={profesor}
                onClose={() => setSelectedClass(null)}
              />
            )}
          </div>
        )}

        {activeTab === 'biblioteca' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Biblioteca de Estudio</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">Rudimentos ({state.rudimentos.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.rudimentos.map(rud => (
                  <div key={rud.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{rud.nombre}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rud.dificultad === 'basico' ? 'bg-green-100 text-green-700' :
                        rud.dificultad === 'intermedio' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {rud.dificultad}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rud.descripcion}</p>
                    <div className="text-xs text-gray-500">
                      Categoría: {rud.categoria} • BPM: {rud.bpmObjetivo}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Grooves ({state.grooves.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.grooves.map(groove => (
                  <div key={groove.id} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{groove.nombre}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        groove.dificultad === 'basico' ? 'bg-green-100 text-green-700' :
                        groove.dificultad === 'intermedio' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {groove.dificultad}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{groove.descripcion}</p>
                    <div className="text-xs text-gray-500">
                      Estilo: {groove.estilo} • Compás: {groove.compas} • BPM: {groove.bpmSugerido}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progreso' && (
          <div className="p-6">
            <ProgressDashboard
              alumno={currentUser}
              evaluaciones={state.evaluaciones.filter(e => e.alumnoId === currentUser.id)}
              asignaciones={misAsignaciones}
              tareas={state.tareas}
            />
          </div>
        )}
      </div>
    </div>
  );
}
