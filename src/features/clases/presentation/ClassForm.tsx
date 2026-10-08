// ============================================================
// DrumPro Academy - Formulario de Creación/Edición de Clase
// Fase 3: Clases y Calendario
// ============================================================

import React, { useState, useEffect } from 'react';
import { Clase, ClassStatus, UserProfile } from '../../../types/academy';

interface ClassFormProps {
  profesores: UserProfile[];
  alumnos: UserProfile[];
  clase?: Clase | null;
  currentUser: UserProfile;
  onSave: (clase: Omit<Clase, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function ClassForm({ 
  profesores, 
  alumnos, 
  clase, 
  currentUser,
  onSave, 
  onCancel 
}: ClassFormProps) {
  const [formData, setFormData] = useState({
    profesorId: currentUser.role === 'profesor' ? currentUser.id : '',
    alumnoId: '',
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'programada' as ClassStatus,
    videollamadaUrl: '',
    notasProfesor: '',
    materiales: [] as string[],
  });

  const [error, setError] = useState('');

  // Si estamos editando una clase, cargar los datos
  useEffect(() => {
    if (clase) {
      setFormData({
        profesorId: clase.profesorId,
        alumnoId: clase.alumnoId,
        titulo: clase.titulo,
        descripcion: clase.descripcion || '',
        fechaInicio: clase.fechaInicio.slice(0, 16), // Formato para input datetime-local
        fechaFin: clase.fechaFin.slice(0, 16),
        estado: clase.estado,
        videollamadaUrl: clase.videollamadaUrl || '',
        notasProfesor: clase.notasProfesor || '',
        materiales: clase.materiales,
      });
    }
  }, [clase]);

  // Filtrar alumnos según el profesor seleccionado
  const alumnosDelProfesor = alumnos.filter(a => 
    currentUser.role === 'admin' 
      ? a.profesorId === formData.profesorId
      : a.profesorId === currentUser.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!formData.alumnoId) {
      setError('Selecciona un alumno');
      return;
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      setError('La fecha y hora son obligatorias');
      return;
    }

    const inicio = new Date(formData.fechaInicio);
    const fin = new Date(formData.fechaFin);

    if (fin <= inicio) {
      setError('La fecha de fin debe ser posterior a la de inicio');
      return;
    }

    // Generar URL de videollamada si no se proporcionó
    const videollamadaUrl = formData.videollamadaUrl.trim() || 
      `https://meet.jit.si/DrumPro-${Date.now()}`;

    onSave({
      profesorId: formData.profesorId,
      alumnoId: formData.alumnoId,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fechaInicio: new Date(formData.fechaInicio).toISOString(),
      fechaFin: new Date(formData.fechaFin).toISOString(),
      estado: formData.estado,
      videollamadaUrl,
      notasProfesor: formData.notasProfesor,
      materiales: formData.materiales,
    });
  };

  const handleAddMaterial = () => {
    const url = prompt('URL del material (PDF, audio, video, enlace):');
    if (url && url.trim()) {
      setFormData({
        ...formData,
        materiales: [...formData.materiales, url.trim()],
      });
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materiales: formData.materiales.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {clase ? 'Editar Clase' : 'Nueva Clase'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profesor (solo visible para admin) */}
        {currentUser.role === 'admin' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profesor *
            </label>
            <select
              value={formData.profesorId}
              onChange={(e) => setFormData({ ...formData, profesorId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un profesor</option>
              {profesores.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>
        )}

        {/* Alumno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alumno *
          </label>
          <select
            value={formData.alumnoId}
            onChange={(e) => setFormData({ ...formData, alumnoId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un alumno</option>
            {alumnosDelProfesor.map(a => (
              <option key={a.id} value={a.id}>{a.fullName}</option>
            ))}
          </select>
          {alumnosDelProfesor.length === 0 && (
            <p className="text-sm text-orange-600 mt-1">
              No hay alumnos asignados a este profesor
            </p>
          )}
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la clase *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Técnica de redobles"
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
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe el contenido de la clase..."
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y hora de inicio *
            </label>
            <input
              type="datetime-local"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y hora de fin *
            </label>
            <input
              type="datetime-local"
              value={formData.fechaFin}
              onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as ClassStatus })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="programada">Programada</option>
            <option value="en_curso">En curso</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* URL de videollamada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de videollamada
          </label>
          <input
            type="url"
            value={formData.videollamadaUrl}
            onChange={(e) => setFormData({ ...formData, videollamadaUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://meet.jit.si/... (se genera automáticamente si se deja vacío)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Se generará automáticamente una sala de Jitsi Meet si se deja vacío
          </p>
        </div>

        {/* Materiales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Materiales adjuntos
          </label>
          <div className="space-y-2">
            {formData.materiales.map((material, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1 text-sm text-gray-600 truncate">
                  {material}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMaterial}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Agregar material
            </button>
          </div>
        </div>

        {/* Notas del profesor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas del profesor (privadas)
          </label>
          <textarea
            value={formData.notasProfesor}
            onChange={(e) => setFormData({ ...formData, notasProfesor: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notas privadas para el profesor..."
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
            {clase ? 'Actualizar Clase' : 'Crear Clase'}
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
