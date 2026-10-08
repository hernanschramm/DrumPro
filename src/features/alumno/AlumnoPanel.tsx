// ============================================================
// DrumPro Academy - Panel de Alumno
// ============================================================

import React, { useState } from 'react';
import { useAcademy } from '../../store/AcademyContext';

export default function AlumnoPanel() {
  const { state, dispatch } = useAcademy();
  const [activeTab, setActiveTab] = useState<'tareas' | 'clases' | 'biblioteca' | 'progreso'>('tareas');

  const currentUser = state.currentUser!;
  const profesor = state.users.find(u => u.id === currentUser.profesorId);
  const misAsignaciones = state.asignaciones.filter(a => a.alumnoId === currentUser.id);
  const misClases = state.clases.filter(c => c.alumnoId === currentUser.id);
  const misNotificaciones = state.notificaciones.filter(n => n.usuarioId === currentUser.id && !n.leida);

  const handleMarkNotificationRead = (notifId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notifId });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎵 Mi Panel de Alumno</h1>
            <p className="text-green-100 text-sm">Bienvenido, {currentUser.fullName}</p>
          </div>
          {misNotificaciones.length > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {misNotificaciones.length} nuevas
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('tareas')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'tareas'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tareas ({misAsignaciones.filter(a => a.estado === 'pendiente').length})
        </button>
        <button
          onClick={() => setActiveTab('clases')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'clases'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Clases
        </button>
        <button
          onClick={() => setActiveTab('biblioteca')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'biblioteca'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Biblioteca
        </button>
        <button
          onClick={() => setActiveTab('progreso')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'progreso'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Progreso
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'tareas' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Tareas</h2>
            
            {/* Notificaciones */}
            {misNotificaciones.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Notificaciones</h3>
                <div className="space-y-2">
                  {misNotificaciones.map(notif => (
                    <div key={notif.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start justify-between">
                      <div>
                        <div className="font-medium text-blue-900 text-sm">{notif.titulo}</div>
                        <div className="text-xs text-blue-700">{notif.mensaje}</div>
                      </div>
                      <button
                        onClick={() => handleMarkNotificationRead(notif.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de tareas */}
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
                    
                    {asig.estado === 'pendiente' && (
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium">
                        📹 Grabar y Entregar
                      </button>
                    )}

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
          </div>
        )}

        {activeTab === 'clases' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Clases</h2>
            <div className="space-y-4">
              {misClases.map(clase => (
                <div key={clase.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{clase.titulo}</h3>
                      <p className="text-sm text-gray-600">Profesor: {profesor?.fullName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      clase.estado === 'programada' ? 'bg-green-100 text-green-700' :
                      clase.estado === 'finalizada' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {clase.estado}
                    </span>
                  </div>
                  {clase.descripcion && (
                    <p className="text-sm text-gray-600 mb-4">{clase.descripcion}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📅 {new Date(clase.fechaInicio).toLocaleDateString('es-ES')}</span>
                    <span>🕐 {new Date(clase.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {clase.videollamadaUrl && clase.estado === 'programada' && (
                    <a
                      href={clase.videollamadaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                    >
                      🔗 Unirse a videollamada
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'biblioteca' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Biblioteca de Estudio</h2>
            
            {/* Rudimentos */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">Rudimentos</h3>
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
                      Categoría: {rud.categoria} • BPM objetivo: {rud.bpmObjetivo}
                    </div>
                    <button className="mt-3 w-full px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-sm font-medium">
                      🎵 Practicar con metrónomo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Grooves */}
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">Grooves</h3>
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
                    <div className="text-xs text-gray-500 mb-3">
                      Estilo: {groove.estilo} • Compás: {groove.compas} • BPM: {groove.bpmSugerido}
                    </div>
                    <button className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium">
                      ▶️ Ver patrón
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progreso' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mi Progreso</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {misAsignaciones.filter(a => a.estado === 'aprobada').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Tareas completadas</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Minutos de práctica</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Rudimentos dominados</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Días de racha</div>
              </div>
            </div>

            {/* Promedio */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Promedio General</h3>
              <div className="flex items-center justify-center">
                <div className="text-6xl font-bold text-green-600">
                  {(() => {
                    const aprobadas = misAsignaciones.filter(a => a.estado === 'aprobada' && a.puntaje);
                    if (aprobadas.length === 0) return '-';
                    const promedio = aprobadas.reduce((sum, a) => sum + (a.puntaje || 0), 0) / aprobadas.length;
                    return Math.round(promedio);
                  })()}
                </div>
              </div>
            </div>

            {/* Profesor */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Mi Profesor</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profesor?.fullName.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">{profesor?.fullName}</div>
                  <div className="text-sm text-gray-600">{profesor?.email}</div>
                  {profesor?.bio && <p className="text-sm text-gray-600 mt-1">{profesor.bio}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
