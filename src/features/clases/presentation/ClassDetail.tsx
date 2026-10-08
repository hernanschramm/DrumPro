// ============================================================
// DrumPro Academy - Pantalla de Detalle de Clase
// Fase 3: Clases y Calendario
// ============================================================

import React from 'react';
import { Clase, UserProfile } from '../../../types/academy';

interface ClassDetailProps {
  clase: Clase;
  profesor?: UserProfile;
  alumno?: UserProfile;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

export default function ClassDetail({ 
  clase, 
  profesor, 
  alumno, 
  onClose, 
  onEdit,
  canEdit = false 
}: ClassDetailProps) {
  const inicio = new Date(clase.fechaInicio);
  const fin = new Date(clase.fechaFin);
  const duracionMinutos = Math.round((fin.getTime() - inicio.getTime()) / 60000);
  
  const isUpcoming = inicio > new Date();
  const isLive = clase.estado === 'en_curso' || 
    (new Date() >= inicio && new Date() <= fin);

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' a las ' + date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'programada': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_curso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'finalizada': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'programada': return '📅 Programada';
      case 'en_curso': return '🔴 En curso';
      case 'finalizada': return '✅ Finalizada';
      case 'cancelada': return '❌ Cancelada';
      default: return estado;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Detalle de Clase</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Título y estado */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-bold text-gray-900">{clase.titulo}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(clase.estado)}`}>
                {getStatusLabel(clase.estado)}
              </span>
            </div>
            {clase.descripcion && (
              <p className="text-gray-600 mt-2">{clase.descripcion}</p>
            )}
          </div>

          {/* Info de participantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profesor && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-1">PROFESOR</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {profesor.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{profesor.fullName}</div>
                    <div className="text-xs text-gray-500">{profesor.email}</div>
                  </div>
                </div>
              </div>
            )}
            {alumno && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-xs text-green-600 font-medium mb-1">ALUMNO</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {alumno.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{alumno.fullName}</div>
                    <div className="text-xs text-gray-500">{alumno.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fecha y hora */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-xs text-gray-500 font-medium mb-2">FECHA Y HORA</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-800">
                <span className="text-lg">🕐</span>
                <div>
                  <div className="font-medium">Inicio</div>
                  <div className="text-sm text-gray-600">{formatDateTime(inicio)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <span className="text-lg">🏁</span>
                <div>
                  <div className="font-medium">Fin</div>
                  <div className="text-sm text-gray-600">{formatDateTime(fin)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm pt-2 border-t border-gray-200">
                <span>⏱️</span>
                <span>Duración: {duracionMinutos} minutos</span>
              </div>
            </div>
          </div>

          {/* Videollamada */}
          {clase.videollamadaUrl && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="text-xs text-purple-600 font-medium mb-2">VIDEOLLAMADA</div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600 truncate">
                    {clase.videollamadaUrl}
                  </div>
                </div>
                {(isUpcoming || isLive) && clase.estado !== 'cancelada' && (
                  <a
                    href={clase.videollamadaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm whitespace-nowrap transition-colors"
                  >
                    {isLive ? '🔴 Unirse ahora' : '📹 Abrir sala'}
                  </a>
                )}
              </div>
              {isLive && (
                <div className="mt-2 text-xs text-purple-700 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  La clase está en curso
                </div>
              )}
            </div>
          )}

          {/* Materiales */}
          {clase.materiales.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 font-medium mb-2">MATERIALES ADJUNTOS</div>
              <div className="space-y-2">
                {clase.materiales.map((material, index) => (
                  <a
                    key={index}
                    href={material}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📎</span>
                    <span className="text-sm text-blue-600 truncate flex-1">
                      {material}
                    </span>
                    <span className="text-gray-400">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Notas del profesor (solo visible para el profesor) */}
          {clase.notasProfesor && canEdit && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="text-xs text-yellow-600 font-medium mb-2">NOTAS PRIVADAS</div>
              <p className="text-sm text-gray-700">{clase.notasProfesor}</p>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          {canEdit && onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              ✏️ Editar
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
