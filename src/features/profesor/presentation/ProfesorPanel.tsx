// ============================================================
// DrumPro Academy - Panel de Profesor
// Fase 2: Gestión de alumnos, clases y tareas
// ============================================================

import React, { useState } from 'react';
import { useAcademy } from '../../../store/AcademyContext';
import { Tarea, TareaAsignacion, Clase, UserProfile } from '../../../types/academy';
import CalendarView from '../../clases/presentation/CalendarView';
import ClassForm from '../../clases/presentation/ClassForm';
import ClassDetail from '../../clases/presentation/ClassDetail';
import GradePanel, { CriterioCalificacion } from '../../tareas/presentation/GradePanel';
import EvaluationForm from '../../evaluaciones/presentation/EvaluationForm';

export default function ProfesorPanel() {
  const { state, dispatch } = useAcademy();
  const [activeTab, setActiveTab] = useState<'alumnos' | 'clases' | 'tareas' | 'evaluaciones'>('clases');
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Clase | null>(null);
  const [selectedClass, setSelectedClass] = useState<Clase | null>(null);
  const [gradingAsignacion, setGradingAsignacion] = useState<TareaAsignacion | null>(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<UserProfile | null>(null);
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

  const handleGradeAssignment = (asignacion: TareaAsignacion) => {
    const tarea = state.tareas.find(t => t.id === asignacion.tareaId);
    const puntajeStr = prompt(`Puntaje para ${state.users.find(u => u.id === asignacion.alumnoId)?.fullName} (0-${tarea?.puntajeMaximo || 100}):`);
    const feedback = prompt('Feedback para el alumno:');
    
    if (puntajeStr !== null && feedback !== null) {
      const puntaje = parseInt(puntajeStr);
      if (!isNaN(puntaje)) {
        dispatch({
          type: 'UPDATE_ASIGNACION',
          payload: {
            ...asignacion,
            estado: 'aprobada',
            puntaje,
            correccionTexto: feedback,
          },
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-blue-600 text-white px-6 py-4">
        <h1 className="text-2xl font-bold">🎓 Panel de Profesor</h1>
        <p className="text-blue-100 text-sm">Bienvenido, {currentUser.fullName}</p>
      </div>

      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('alumnos')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'alumnos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Mis Alumnos ({misAlumnos.length})
        </button>
        <button
          onClick={() => setActiveTab('clases')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'clases' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Clases ({misClases.length})
        </button>
        <button
          onClick={() => setActiveTab('tareas')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'tareas' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Tareas ({misTareas.length})
        </button>
        <button
          onClick={() => setActiveTab('evaluaciones')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'evaluaciones' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Evaluaciones
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'alumnos' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mis Alumnos</h2>
            {misAlumnos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">👥</div>
                <p>Aún no tienes alumnos asignados</p>
                <p className="text-sm">El administrador debe asignarte alumnos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {misAlumnos.map(alumno => {
                  const tareasPendientes = state.asignaciones.filter(
                    a => a.alumnoId === alumno.id && a.estado === 'pendiente'
                  ).length;
                  const tareasEntregadas = state.asignaciones.filter(
                    a => a.alumnoId === alumno.id && a.estado === 'entregada'
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
                      {alumno.bio && <p className="text-sm text-gray-600 mb-4">{alumno.bio}</p>}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-orange-600">{tareasPendientes}</span> pendientes
                          {tareasEntregadas > 0 && (
                            <span className="ml-2">
                              • <span className="font-medium text-blue-600">{tareasEntregadas}</span> por revisar
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clases' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mis Clases</h2>
              <button
                onClick={() => {
                  setEditingClass(null);
                  setShowClassForm(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
              >
                + Nueva Clase
              </button>
            </div>

            {/* Formulario de clase */}
            {showClassForm && (
              <div className="mb-6">
                <ClassForm
                  profesores={[currentUser]}
                  alumnos={misAlumnos}
                  clase={editingClass}
                  currentUser={currentUser}
                  onSave={(claseData) => {
                    if (editingClass) {
                      // Actualizar clase existente
                      dispatch({
                        type: 'UPDATE_CLASE',
                        payload: { ...claseData, id: editingClass.id, createdAt: editingClass.createdAt } as Clase,
                      });
                    } else {
                      // Crear nueva clase
                      const newClase: Clase = {
                        ...claseData,
                        id: `clase-${Date.now()}`,
                        createdAt: new Date().toISOString(),
                      };
                      dispatch({ type: 'ADD_CLASE', payload: newClase });
                    }
                    setShowClassForm(false);
                    setEditingClass(null);
                  }}
                  onCancel={() => {
                    setShowClassForm(false);
                    setEditingClass(null);
                  }}
                />
              </div>
            )}

            {/* Calendario */}
            <div className="mb-6">
              <CalendarView
                clases={misClases}
                onClassClick={(clase) => setSelectedClass(clase)}
              />
            </div>

            {/* Lista de próximas clases */}
            <div>
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
                    .map(clase => {
                      const alumno = state.users.find(u => u.id === clase.alumnoId);
                      return (
                        <div
                          key={clase.id}
                          onClick={() => setSelectedClass(clase)}
                          className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800">{clase.titulo}</h4>
                              <p className="text-sm text-gray-600">Alumno: {alumno?.fullName}</p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Programada
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>📅 {new Date(clase.fechaInicio).toLocaleDateString('es-ES')}</span>
                            <span>🕐 {new Date(clase.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Detalle de clase */}
            {selectedClass && (
              <ClassDetail
                clase={selectedClass}
                profesor={currentUser}
                alumno={state.users.find(u => u.id === selectedClass.alumnoId)}
                onClose={() => setSelectedClass(null)}
                onStartVideoCall={() => {
                  dispatch({ type: 'START_VIDEO_CALL', payload: selectedClass });
                  setSelectedClass(null);
                }}
                onEdit={() => {
                  setEditingClass(selectedClass);
                  setShowClassForm(true);
                  setSelectedClass(null);
                }}
                canEdit={true}
              />
            )}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consigna</label>
                    <textarea
                      value={taskForm.consigna}
                      onChange={(e) => setTaskForm({ ...taskForm, consigna: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                      <input
                        type="datetime-local"
                        value={taskForm.fechaLimite}
                        onChange={(e) => setTaskForm({ ...taskForm, fechaLimite: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Puntaje máximo</label>
                      <input
                        type="number"
                        value={taskForm.puntajeMaximo}
                        onChange={(e) => setTaskForm({ ...taskForm, puntajeMaximo: parseInt(e.target.value) || 100 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a alumnos</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
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
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">{alumno.fullName}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCreateTask} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium">
                      Crear Tarea
                    </button>
                    <button onClick={() => setShowTaskForm(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                                asig.estado === 'entregada' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {asig.estado}
                              </span>
                              {asig.puntaje !== undefined && (
                                <span className="ml-2 text-sm text-gray-500">({asig.puntaje}pts)</span>
                              )}
                            </div>
                            {asig.estado === 'entregada' && (
                              <button
                                onClick={() => setGradingAsignacion(asig)}
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

            {/* Panel de calificación */}
            {gradingAsignacion && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <GradePanel
                      asignacion={gradingAsignacion}
                      tarea={state.tareas.find(t => t.id === gradingAsignacion.tareaId)!}
                      onGrade={(puntaje, feedback, criterios) => {
                        dispatch({
                          type: 'UPDATE_ASIGNACION',
                          payload: {
                            ...gradingAsignacion,
                            estado: 'aprobada',
                            puntaje,
                            correccionTexto: feedback,
                          },
                        });
                        setGradingAsignacion(null);
                      }}
                      onCancel={() => setGradingAsignacion(null)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'evaluaciones' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Evaluaciones</h2>
              <button
                onClick={() => {
                  setSelectedAlumno(misAlumnos[0] || null);
                  setShowEvaluationForm(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                disabled={misAlumnos.length === 0}
              >
                + Nueva Evaluación
              </button>
            </div>

            {/* Selector de alumno */}
            {misAlumnos.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar alumno:
                </label>
                <select
                  value={selectedAlumno?.id || ''}
                  onChange={(e) => {
                    const alumno = misAlumnos.find(a => a.id === e.target.value);
                    setSelectedAlumno(alumno || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un alumno</option>
                  {misAlumnos.map(alumno => (
                    <option key={alumno.id} value={alumno.id}>{alumno.fullName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Lista de evaluaciones del alumno seleccionado */}
            {selectedAlumno && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Evaluaciones de {selectedAlumno.fullName}
                </h3>
                {state.evaluaciones.filter(e => e.alumnoId === selectedAlumno.id).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No hay evaluaciones para este alumno</p>
                    <p className="text-sm mt-2">Crea una nueva evaluación para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.evaluaciones
                      .filter(e => e.alumnoId === selectedAlumno.id)
                      .sort((a, b) => new Date(b.fechaEvaluacion).getTime() - new Date(a.fechaEvaluacion).getTime())
                      .map(evaluacion => {
                        const porcentaje = Math.round(((evaluacion.puntajeObtenido || 0) / evaluacion.puntajeTotal) * 100);
                        return (
                          <div key={evaluacion.id} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-gray-800">{evaluacion.titulo}</h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(evaluacion.fechaEvaluacion).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{porcentaje}%</div>
                                <div className="text-sm text-gray-500">
                                  {evaluacion.puntajeObtenido}/{evaluacion.puntajeTotal}
                                </div>
                              </div>
                            </div>
                            {evaluacion.observaciones && (
                              <p className="text-sm text-gray-600 mt-2">{evaluacion.observaciones}</p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Formulario de evaluación */}
            {showEvaluationForm && selectedAlumno && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <EvaluationForm
                      alumno={selectedAlumno}
                      onSave={(evaluacionData) => {
                        const nuevaEvaluacion = {
                          ...evaluacionData,
                          id: `eval-${Date.now()}`,
                          profesorId: currentUser.id,
                          createdAt: new Date().toISOString(),
                        };
                        dispatch({ type: 'ADD_EVALUACION', payload: nuevaEvaluacion });
                        setShowEvaluationForm(false);
                        setSelectedAlumno(null);
                      }}
                      onCancel={() => {
                        setShowEvaluationForm(false);
                        setSelectedAlumno(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
