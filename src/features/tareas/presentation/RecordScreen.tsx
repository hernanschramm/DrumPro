// ============================================================
// DrumPro Academy - Pantalla de Grabación de Video/Audio
// Fase 4: Tareas y Entregas
// Usa MediaRecorder API del navegador para grabación real
// ============================================================

import React, { useState, useRef, useEffect } from 'react';

interface RecordScreenProps {
  taskTitle: string;
  onRecordComplete: (file: Blob, type: 'video' | 'audio', duration: number) => void;
  onCancel: () => void;
}

export default function RecordScreen({ taskTitle, onRecordComplete, onCancel }: RecordScreenProps) {
  const [mode, setMode] = useState<'video' | 'audio'>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Solicitar permisos de cámara/micrófono
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const constraints = mode === 'video'
          ? { video: true, audio: true }
          : { audio: true };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setHasPermission(true);

        if (mode === 'video' && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error al solicitar permisos:', err);
        setHasPermission(false);
        setError('No se pudo acceder a la cámara/micrófono. Verifica los permisos del navegador.');
      }
    };

    requestPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);

  // Timer de grabación
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Iniciar grabación
  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: mode === 'video' ? 'video/webm' : 'audio/webm',
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mode === 'video' ? 'video/webm' : 'audio/webm',
      });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedUrl(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Recopilar datos cada segundo
    setIsRecording(true);
    setRecordingTime(0);
  };

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Confirmar y enviar
  const handleConfirm = () => {
    if (recordedBlob) {
      onRecordComplete(recordedBlob, mode, recordingTime);
    }
  };

  // Re-grabar
  const handleReRecord = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl('');
    setRecordingTime(0);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Grabar Entrega</h2>
            <p className="text-sm text-gray-400">{taskTitle}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error de permisos */}
          {hasPermission === false && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="text-red-200 font-medium mb-2">⚠️ Permisos requeridos</div>
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Selector de modo */}
          {!recordedBlob && hasPermission && (
            <div className="flex gap-2">
              <button
                onClick={() => setMode('video')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  mode === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📹 Video
              </button>
              <button
                onClick={() => setMode('audio')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  mode === 'audio'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎤 Solo Audio
              </button>
            </div>
          )}

          {/* Vista de cámara / preview */}
          {hasPermission && !recordedBlob && (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {mode === 'video' ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎤</div>
                    <div className="text-gray-400">Modo solo audio</div>
                  </div>
                </div>
              )}

              {/* Indicador de grabación */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-sm font-mono">{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Límite de tiempo (3 minutos) */}
              {recordingTime >= 180 && isRecording && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">⏱️</div>
                    <p>Límite de 3 minutos alcanzado</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview de grabación */}
          {recordedBlob && recordedUrl && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Vista previa:</div>
              {mode === 'video' ? (
                <video
                  src={recordedUrl}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                <audio
                  src={recordedUrl}
                  controls
                  className="w-full"
                />
              )}
              <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                <span>Duración: {formatTime(recordingTime)}</span>
                <span>Tamaño: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          )}

          {/* Controles de grabación */}
          {hasPermission && !recordedBlob && (
            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={recordingTime >= 180}
                  className="w-20 h-20 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-full flex items-center justify-center text-white text-3xl transition-colors shadow-lg"
                >
                  ●
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white text-2xl transition-colors shadow-lg"
                >
                  ⏹
                </button>
              )}
            </div>
          )}

          {/* Acciones después de grabar */}
          {recordedBlob && (
            <div className="flex gap-3">
              <button
                onClick={handleReRecord}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                🔄 Grabar de nuevo
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
              >
                ✅ Enviar entrega
              </button>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-2">💡 Consejos:</p>
            <ul className="space-y-1">
              <li>• Máximo 3 minutos de grabación</li>
              <li>• Asegúrate de tener buena iluminación (video)</li>
              <li>• Coloca el micrófono cerca del instrumento</li>
              <li>• Puedes grabar varias veces antes de enviar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
