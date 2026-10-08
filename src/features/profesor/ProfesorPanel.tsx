// ============================================================
// DrumPro Academy - Panel de Profesor
// ============================================================

import React, { useState } from 'react';
import { useAcademy } from '../../store/AcademyContext';
import { Tarea, TareaAsignacion, Clase } from '../../types/academy';

export default function ProfesorPanel() {
  const { state, dispatch } = useAcademy();
  const [activeTab, setActiveTab] = useState<'alumnos' | 'clases' | 'tareas'>('alumnos');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    titulo: '',
    consigna: '',
    fechaLimite: '',
    puntajeMaximo: 100,
    alumnoIds: [] as string[],
  });

  const currentUser = state.currentUser!;
  const misAlumnos = state.users.filter(u => u.profesorId === currentUser.id);
  const misClases = state.clases.filter(c => c.profesorId === currentUser.id);
  const misTareas = state.tareas.filter(t => t.profesorId === currentUser.id);

  const handleCreateTask = () => {
    if (!taskForm.titulo || !taskForm.consigna || !taskForm.fechaLimite) return;

    const newTask: Tarea = {
      id: `tarea-${Date.now()}`,
      profesorId: currentUser.id,
      titulo: taskForm.titulo,
      consigna: taskForm.consigna,
      materialUrls: [],
      fechaLimite: taskForm.fechaLimite,
      puntajeMaximo: taskForm.puntajeMaximo,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TAREA', payload: newTask });

    // Asignar a alumnos seleccionados
    taskForm.alumnoIds.forEach(alumnoId => {
      const asignacion: TareaAsignacion = {
        id: `asig-${Date.now()}-${alumnoId}`,
        tareaId: newTask.id,
        alumnoId,
        estado: 'pendiente',
        correccionMediaUrls: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_ASIGNACION', payload: asignacion });
    });

    setShowTaskForm(false);
    setTaskForm({ titulo: '', consigna: '', fechaLimite: '', puntajeMaximo: 100, alumnoIds: [] });
  };

  const handleGradeAssignment = (asignacion: TareaAsignacion, puntaje: number, feedback: string) => {
    dispatch({
      type: 'UPDATE_ASIGNACION',
      payload: {
        ...asignacion,
        estado: 'aprobada',
        puntaje,
        correccionTexto: feedback,
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <h1 className="text-2xl font-bold">🎓 Panel de Profesor</h1>
        <p className="text-blue-100 text-sm">Bienvenido, {currentUser.fullName}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('alumnos')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'alumnos'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mis Alumnos ({misAlumnos.length})
        </button>
        <button
          onClick={() => setActiveTab('clases')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'clases'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Clases ({misClases.length})
        </button>
        <button
          onClick={() => setActiveTab('tareas')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'tareas'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tareas ({misTareas.length})
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'alumnos' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Alumnos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {misAlumnos.map(alumno => {
                const tareasPendientes = state.asignaciones.filter(
                  a => a.alumnoId === alumno.id && a.estado === 'pendiente'
                ).length;

                return (
                  <div key={alumno.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {alumno.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-800">{alumno.fullName}</div>
                        <div className="text-sm text-gray-500">{alumno.email}</div>
                      </div>
                    </div>
                    {alumno.bio && (
                      <p className="text-sm text-gray-600 mb-4">{alumno.bio}</p>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-orange-600">{tareasPendientes}</span> tareas pendientes
                      </div>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium">
                        Ver progreso
                      </button>
                    </div>
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
              {misClases.map(clase => {
                const alumno = state.users.find(u => u.id === clase.alumnoId);
                return (
                  <div key={clase.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{clase.titulo}</h3>
                        <p className="text-sm text-gray-600">Alumno: {alumno?.fullName}</p>
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
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(clase.fechaInicio).toLocaleDateString('es-ES')}</span>
                      <span>🕐 {new Date(clase.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {clase.videollamadaUrl && (
                      <a
                        href={clase.videollamadaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                      >
                        🔗 Unirse a videollamada
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'tareas' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mis Tareas</h2>
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
              >
                + Nueva Tarea
              </button>
            </div>

            {/* Formulario de tarea */}
            {showTaskForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Crear Nueva Tarea</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={taskForm.titulo}
                      onChange={(e) => setTaskForm({ ...taskForm, titulo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consigna</label>
                    <textarea
                      value={taskForm.consigna}
                      onChange={(e) => setTaskForm({ ...taskForm, consigna: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                      <input
                        type="datetime-local"
                        value={taskForm.fechaLimite}
                        onChange={(e) => setTaskForm({ ...taskForm, fechaLimite: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Puntaje máximo</label>
                      <input
                        type="number"
                        value={taskForm.puntajeMaximo}
                        onChange={(e) => setTaskForm({ ...taskForm, puntajeMaximo: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a alumnos</label>
                    <div className="space-y-2">
                      {misAlumnos.map(alumno => (
                        <label key={alumno.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={taskForm.alumnoIds.includes(alumno.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTaskForm({ ...taskForm, alumnoIds: [...taskForm.alumnoIds, alumno.id] });
                              } else {
                                setTaskForm({ ...taskForm, alumnoIds: taskForm.alumnoIds.filter(id => id !== alumno.id) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">{alumno.fullName}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateTask}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                    >
                      Crear Tarea
                    </button>
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de tareas */}
            <div className="space-y-4">
              {misTareas.map(tarea => {
                const asignaciones = state.asignaciones.filter(a => a.tareaId === tarea.id);
                return (
                  <div key={tarea.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{tarea.titulo}</h3>
                        <p className="text-sm text-gray-500">
                          Fecha límite: {new Date(tarea.fechaLimite).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {asignaciones.length} asignaciones
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{tarea.consigna}</p>
                    <div className="space-y-2">
                      {asignaciones.map(asig => {
                        const alumno = state.users.find(u => u.id === asig.alumnoId);
                        return (
                          <div key={asig.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-700">{alumno?.fullName}</span>
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                                asig.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                asig.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {asig.estado}
                              </span>
                            </div>
                            {asig.estado === 'entregada' && (
                              <button
                                onClick={() => {
                                  const puntaje = prompt('Puntaje (0-100):');
                                  const feedback = prompt('Feedback:');
                                  if (puntaje && feedback) {
                                    handleGradeAssignment(asig, parseInt(puntaje), feedback);
                                  }
                                }}
                                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium"
                              >
                                Calificar
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
