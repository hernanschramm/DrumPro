// ============================================================
// DrumPro - Modo Escenario
// Fuente grande, fondo oscuro, botones grandes
// Para usar en vivo con pantalla siempre encendida
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppState } from '../../store/AppContext';
import { MetronomeEngine } from '../../audio/MetronomeEngine';
import { AccentLevel } from '../../types';

interface StageModeProps {
  onExit: () => void;
}

export default function StageMode({ onExit }: StageModeProps) {
  const { state } = useAppState();
  const [currentSetlistIndex, setCurrentSetlistIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const [flash, setFlash] = useState(false);

  const engineRef = useRef<MetronomeEngine | null>(null);

  // Obtener el primer setlist o todas las canciones
  const songs = state.setlists.length > 0
    ? state.setlists[0].songIds.map(id => state.songs.find(s => s.id === id)).filter(Boolean)
    : state.songs;

  const currentSong = songs[currentSetlistIndex] || null;

  // Inicializar motor
  useEffect(() => {
    engineRef.current = new MetronomeEngine();
    engineRef.current.onBeat((beat: number, accent: AccentLevel) => {
      setCurrentBeat(beat);
      if (accent === 'strong') {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      }
    });
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  // Cargar configuración de la canción actual
  useEffect(() => {
    if (currentSong && engineRef.current) {
      const config = currentSong.metronomeConfig;
      setBpm(config?.bpm || currentSong.bpm);
      engineRef.current.configure({
        bpm: config?.bpm || currentSong.bpm,
        timeSignature: currentSong.timeSignature,
        subdivision: config?.subdivision || 'quarter',
        accents: config?.accents || ['strong', 'medium', 'medium', 'medium'],
        sound: config?.sound || 'click',
        volume: config?.volume || 0.8,
      });
    }
  }, [currentSong]);

  // Play/Stop
  const togglePlay = useCallback(() => {
    if (!engineRef.current) return;
    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setCurrentBeat(-1);
    } else {
      engineRef.current.start();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Siguiente canción
  const nextSong = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop();
      setIsPlaying(false);
    }
    setCurrentSetlistIndex(prev => Math.min(prev + 1, songs.length - 1));
    setCurrentBeat(-1);
  }, [isPlaying, songs.length]);

  // Canción anterior
  const prevSong = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop();
      setIsPlaying(false);
    }
    setCurrentSetlistIndex(prev => Math.max(prev - 1, 0));
    setCurrentBeat(-1);
  }, [isPlaying]);

  // Atajos de teclado (pedal Bluetooth = Page Up/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'PageDown' || e.code === 'ArrowRight') {
        e.preventDefault();
        nextSong();
      } else if (e.code === 'PageUp' || e.code === 'ArrowLeft') {
        e.preventDefault();
        prevSong();
      } else if (e.code === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextSong, prevSong, onExit]);

  // Wakelock (mantener pantalla encendida)
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (e) {
        console.log('Wake Lock no disponible');
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, []);

  const beatsPerMeasure = currentSong ? parseInt(currentSong.timeSignature.split('/')[0]) : 4;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-black ${flash ? 'bg-white' : 'bg-black'} transition-colors duration-75`}>
      {/* Header minimalista */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={onExit}
          className="text-gray-500 hover:text-white text-sm px-3 py-1 border border-gray-700 rounded"
        >
          ✕ Salir
        </button>
        <div className="text-gray-500 text-xs">
          {currentSetlistIndex + 1} / {songs.length}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Info de la canción */}
        {currentSong ? (
          <>
            <div className="text-white text-3xl sm:text-5xl font-bold text-center mb-2 truncate max-w-full">
              {currentSong.title}
            </div>
            <div className="text-gray-400 text-lg sm:text-xl text-center mb-6">
              {currentSong.artist}
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-2xl">Sin canciones</div>
        )}

        {/* BPM gigante */}
        <div className="text-7xl sm:text-9xl font-mono font-bold text-orange-500 mb-4">
          {bpm}
        </div>
        <div className="text-gray-500 text-sm mb-6">BPM</div>

        {/* Indicador de pulso */}
        <div className="flex gap-3 mb-8">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full transition-all duration-75
                ${currentBeat === i ? 'bg-orange-500 scale-125 shadow-lg shadow-orange-500/50' : 'bg-gray-800'}
              `}
            />
          ))}
        </div>

        {/* Botón Play/Stop gigante */}
        <button
          onClick={togglePlay}
          className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center text-5xl sm:text-6xl shadow-2xl transition-all active:scale-95
            ${isPlaying
              ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
              : 'bg-green-600 hover:bg-green-500 shadow-green-600/30'
            }
          `}
        >
          {isPlaying ? '⏹' : '▶'}
        </button>
      </div>

      {/* Navegación de canciones */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={prevSong}
          disabled={currentSetlistIndex === 0}
          className="px-6 py-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-xl text-white text-lg font-medium"
        >
          ← Anterior
        </button>
        
        <div className="text-center">
          {currentSong?.sections && currentSong.sections.length > 0 && (
            <div className="text-gray-500 text-xs">
              {currentSong.sections.map(s => s.name).join(' → ')}
            </div>
          )}
        </div>

        <button
          onClick={nextSong}
          disabled={currentSetlistIndex >= songs.length - 1}
          className="px-6 py-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-xl text-white text-lg font-medium"
        >
          Siguiente →
        </button>
      </div>

      {/* Footer con atajos */}
      <div className="text-center pb-2">
        <span className="text-[10px] text-gray-600">
          Espacio = Play | ← → = Cambiar canción | Esc = Salir
        </span>
      </div>
    </div>
  );
}


