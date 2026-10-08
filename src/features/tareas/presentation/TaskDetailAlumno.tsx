// ============================================================
// DrumPro Academy - Detalle de Tarea para Alumno
// Fase 4: Tareas y Entregas
// Integra grabación, subida y visualización de entregas
// ============================================================

import React, { useState } from 'react';
import { Tarea, TareaAsignacion, Entrega } from '../../../types/academy';
import RecordScreen from './RecordScreen';
import UploadProgress from './UploadProgress';

interface TaskDetailAlumnoProps {
  tarea: Tarea;
  asignacion: TareaAsignacion;
  entregas: Entrega[];
  onDeliver: (entrega: Entrega) => void;
  onClose: () => void;
}

export default function TaskDetailAlumno({ tarea, asignacion, entregas, onDeliver, onClose }: TaskDetailAlumnoProps) {
  const [showRecord, setShowRecord] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<{ blob: Blob; type: 'video' | 'audio' } | null>(null);

  const handleRecordComplete = (blob: Blob, type: 'video' | 'audio', duration: number) => {
    setCurrentFile({ blob, type });
    setShowRecord(false);
    setUploading(true);
  };

  const handleUploadComplete = (url: string) => {
    if (currentFile) {
      const nuevaEntrega: Entrega = {
        id: `entrega-${Date.now()}`,
        asignacionId: asignacion.id,
        alumnoId: asignacion.alumnoId,
        tipo: currentFile.type,
        archivoUrl: url,
        duracionSegundos: 0, // Se calcularía del blob
        tamanoBytes: currentFile.blob.size,
        intento: entregas.length + 1,
        createdAt: new Date().toISOString(),
      };
      onDeliver(nuevaEntrega);
      setUploading(false);
      setCurrentFile(null);
    }
  };

  const handleUploadError = (error: string) => {
    console.error('Error en subida:', error);
    setUploading(false);
    alert('Error al subir el archivo: ' + error);
  };

  const fechaLimite = new Date(tarea.fechaLimite);
  const esVencida = new Date() > fechaLimite;
  const puedeEntregar = !esVencida && (asignacion.estado === 'pendiente' || asignacion.estado === 'con_correcciones');

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Detalle de Tarea</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Info de la tarea */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{tarea.titulo}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                <span className={`px-3 py-1 rounded-full ${
                  asignacion.estado === 'aprobada' ? 'bg-green-600/20 text-green-400' :
                  asignacion.estado === 'entregada' ? 'bg-blue-600/20 text-blue-400' :
                  asignacion.estado === 'con_correcciones' ? 'bg-yellow-600/20 text-yellow-400' :
                  esVencida ? 'bg-red-600/20 text-red-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {asignacion.estado === 'pendiente' && !esVencida && '⏳ Pendiente'}
                  {asignacion.estado === 'pendiente' && esVencida && '⏰ Vencida'}
                  {asignacion.estado === 'entregada' && '📤 Entregada'}
                  {asignacion.estado === 'aprobada' && '✅ Aprobada'}
                  {asignacion.estado === 'con_correcciones' && '⚠️ Con correcciones'}
                </span>
                <span>📅 Límite: {fechaLimite.toLocaleDateString('es-ES')}</span>
                <span>🏆 Máx: {tarea.puntajeMaximo} pts</span>
              </div>
            </div>

            {/* Consigna */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">📝 Consigna:</h4>
              <p className="text-gray-300">{tarea.consigna}</p>
            </div>

            {/* Corrección del profesor */}
            {asignacion.correccionTexto && (
              <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">💬 Corrección del profesor:</h4>
                <p className="text-gray-300">{asignacion.correccionTexto}</p>
                {asignacion.puntaje !== undefined && (
                  <div className="mt-3 text-2xl font-bold text-orange-500">
                    Puntaje: {asignacion.puntaje} / {tarea.puntajeMaximo}
                  </div>
                )}
              </div>
            )}

            {/* Entregas anteriores */}
            {entregas.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">📹 Tus entregas:</h4>
                <div className="space-y-3">
                  {entregas.map((entrega, index) => (
                    <div key={entrega.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Intento {entrega.intento}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(entrega.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{entrega.tipo === 'video' ? '📹' : '🎤'}</span>
                        <span>{entrega.tipo === 'video' ? 'Video' : 'Audio'}</span>
                        <span>•</span>
                        <span>{(entrega.tamanoBytes! / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón de grabar */}
            {puedeEntregar && !uploading && (
              <button
                onClick={() => setShowRecord(true)}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-lg transition-colors"
              >
                🎬 Grabar nueva entrega
              </button>
            )}

            {/* Progreso de subida */}
            {uploading && currentFile && (
              <UploadProgress
                file={currentFile.blob}
                fileName={`entrega_${Date.now()}.${currentFile.type === 'video' ? 'webm' : 'webm'}`}
                onComplete={handleUploadComplete}
                onError={handleUploadError}
              />
            )}

            {/* Info */}
            <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-400">
              <p className="font-medium text-gray-300 mb-2">💡 Recuerda:</p>
              <ul className="space-y-1">
                <li>• Puedes grabar varias veces antes de la fecha límite</li>
                <li>• El profesor verá todas tus entregas</li>
                <li>• Máximo 3 minutos por entrega</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pantalla de grabación */}
      {showRecord && (
        <RecordScreen
          taskTitle={tarea.titulo}
          onRecordComplete={handleRecordComplete}
          onCancel={() => setShowRecord(false)}
        />
      )}
    </>
  );
}
