// ============================================================
// DrumPro Academy - Componente de Progreso de Subida
// Fase 4: Tareas y Entregas
// Simula subida con progreso, compresión y reintentos
// ============================================================

import React, { useState, useEffect } from 'react';

interface UploadProgressProps {
  file: Blob;
  fileName: string;
  onComplete: (url: string) => void;
  onError: (error: string) => void;
}

export default function UploadProgress({ file, fileName, onComplete, onError }: UploadProgressProps) {
  const [stage, setStage] = useState<'compressing' | 'uploading' | 'complete' | 'error'>('compressing');
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState('');

  const maxRetries = 3;

  // Simular compresión
  useEffect(() => {
    if (stage === 'compressing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage('uploading');
            setProgress(0);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [stage]);

  // Simular subida
  useEffect(() => {
    if (stage === 'uploading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          // Simular error aleatorio en el intento 2
          if (retryCount === 1 && prev === 50) {
            clearInterval(interval);
            setStage('error');
            setError('Error de conexión. Reintentando...');
            return prev;
          }

          if (prev >= 100) {
            clearInterval(interval);
            setStage('complete');
            // Simular URL de Supabase Storage
            const fakeUrl = `https://storage.supabase.com/entregas/${Date.now()}_${fileName}`;
            onComplete(fakeUrl);
            return 100;
          }
          return prev + 3;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [stage, retryCount, fileName, onComplete]);

  // Reintentar
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError('');
      setStage('uploading');
      setProgress(0);
    } else {
      onError('Máximo de reintentos alcanzado. Intenta más tarde.');
    }
  };

  const getStageLabel = () => {
    switch (stage) {
      case 'compressing':
        return '🗜️ Comprimiendo video...';
      case 'uploading':
        return '📤 Subiendo archivo...';
      case 'complete':
        return '✅ Subida completada';
      case 'error':
        return '❌ Error de subida';
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'compressing':
        return 'bg-blue-500';
      case 'uploading':
        return 'bg-green-500';
      case 'complete':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-500';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="space-y-4">
        {/* Etapa actual */}
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">{getStageLabel()}</span>
          <span className="text-gray-400 text-sm">
            {retryCount > 0 && `Intento ${retryCount + 1}/${maxRetries + 1}`}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="relative">
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStageColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-400 mt-1">
            {progress}%
          </div>
        </div>

        {/* Info del archivo */}
        <div className="text-sm text-gray-400 space-y-1">
          <div>Archivo: {fileName}</div>
          <div>Tamaño original: {(file.size / 1024 / 1024).toFixed(2)} MB</div>
          {stage === 'compressing' && (
            <div>Tamaño estimado: {(file.size / 1024 / 1024 * 0.3).toFixed(2)} MB</div>
          )}
        </div>

        {/* Error con retry */}
        {stage === 'error' && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-200 text-sm mb-3">{error}</p>
            <button
              onClick={handleRetry}
              disabled={retryCount >= maxRetries}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
            >
              🔄 Reintentar ({maxRetries - retryCount} intentos restantes)
            </button>
          </div>
        )}

        {/* Completado */}
        {stage === 'complete' && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-200 text-sm">
              ✅ Archivo subido correctamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
