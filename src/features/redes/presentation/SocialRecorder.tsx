// ============================================================
// DrumPro Academy - Grabador de Video para Redes Sociales
// Fase 10: Contenido para Redes
// Grabación vertical 9:16 con sincronización de audio
// ============================================================

import React, { useState, useRef, useEffect } from 'react';

interface SocialRecorderProps {
  songTitle: string;
  audioUrl?: string;
  onClose?: () => void;
}

export default function SocialRecorder({ songTitle, audioUrl, onClose }: SocialRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  // Solicitar permisos de cámara
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1080 },
            height: { ideal: 1920 }
          },
          audio: true
        });
        streamRef.current = stream;
        setHasPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error al solicitar permisos:', err);
        setHasPermission(false);
        setError('No se pudo acceder a la cámara. Verifica los permisos.');
      }
    };

    requestPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000 // 2.5 Mbps
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        const blob = new Blob([e.data], { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(blob);
        setRecordedUrl(url);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000);
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

  // Re-grabar
  const handleReRecord = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedVideo(null);
    setRecordedUrl('');
    setRecordingTime(0);
  };

  // Compartir
  const handleShare = async () => {
    if (!recordedVideo) return;

    const file = new File([recordedVideo], `drumpro_${Date.now()}.webm`, {
      type: 'video/webm'
    });

    if (navigator.share) {
      try {
        await navigator.share({
          files: [file],
          title: 'DrumPro - Mi práctica',
          text: `Practicando con DrumPro Academy: ${songTitle}`
        });
      } catch (err) {
        console.error('Error al compartir:', err);
        // Fallback: descargar
        downloadVideo();
      }
    } else {
      downloadVideo();
    }
  };

  // Descargar video
  const downloadVideo = () => {
    if (!recordedUrl) return;
    const a = document.createElement('a');
    a.href = recordedUrl;
    a.download = `drumpro_${Date.now()}.webm`;
    a.click();
  };

  // Dimensiones según aspect ratio
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '9:16': return 'aspect-[9/16] max-h-[80vh]';
      case '1:1': return 'aspect-square max-h-[80vh]';
      case '16:9': return 'aspect-video max-h-[80vh]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">📱 Grabar para Redes</h2>
            <p className="text-sm text-gray-400">{songTitle}</p>
          </div>
          <button
            onClick={onClose}
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

          {/* Selector de aspect ratio */}
          {!recordedVideo && hasPermission && (
            <div className="flex gap-2">
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  aspectRatio === '9:16'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📱 9:16 (TikTok/Reels)
              </button>
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  aspectRatio === '1:1'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⬜ 1:1 (Instagram)
              </button>
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  aspectRatio === '16:9'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🖥️ 16:9 (YouTube)
              </button>
            </div>
          )}

          {/* Vista de cámara / preview */}
          {hasPermission && !recordedVideo && (
            <div className={`relative bg-black rounded-lg overflow-hidden mx-auto ${getAspectRatioClass()}`}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Indicador de grabación */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-sm font-mono">{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Overlay de marco */}
              <div className="absolute inset-0 border-4 border-white/20 pointer-events-none" />
            </div>
          )}

          {/* Preview de grabación */}
          {recordedVideo && recordedUrl && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Vista previa:</div>
              <video
                src={recordedUrl}
                controls
                className={`w-full rounded-lg mx-auto ${getAspectRatioClass()}`}
              />
              <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                <span>Duración: {formatTime(recordingTime)}</span>
                <span>Tamaño: {(recordedVideo.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>Formato: {aspectRatio}</span>
              </div>
            </div>
          )}

          {/* Controles de grabación */}
          {hasPermission && !recordedVideo && (
            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-3xl transition-colors shadow-lg"
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
          {recordedVideo && (
            <div className="flex gap-3">
              <button
                onClick={handleReRecord}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                🔄 Grabar de nuevo
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
              >
                📤 Compartir
              </button>
              <button
                onClick={downloadVideo}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium"
              >
                💾 Descargar
              </button>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-2">💡 Consejos para redes:</p>
            <ul className="space-y-1">
              <li>• Usa formato 9:16 para TikTok e Instagram Reels</li>
              <li>• Usa formato 1:1 para posts de Instagram</li>
              <li>• Usa formato 16:9 para YouTube</li>
              <li>• Buena iluminación es clave para videos de calidad</li>
              <li>• Coloca la cámara a la altura de los ojos</li>
              <li>• Asegúrate de que tu batería sea visible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
