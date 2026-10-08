// ============================================================
// DrumPro Academy - Pantalla del Metrónomo
// Fase 6: Biblioteca y Metrónomo
// Metrónomo profesional con controles completos
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { MetronomeEngine } from '../data/MetronomeEngine';

interface MetronomeScreenProps {
  initialBpm?: number;
  initialBeatsPerMeasure?: number;
  onBack?: () => void;
}

export default function MetronomeScreen({ 
  initialBpm = 120, 
  initialBeatsPerMeasure = 4,
  onBack 
}: MetronomeScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(initialBeatsPerMeasure);
  const [subdivision, setSubdivision] = useState(1);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [tapTempoTimes, setTapTempoTimes] = useState<number[]>([]);
  
  const metronomeRef = useRef<MetronomeEngine | null>(null);

  // Inicializar motor de audio
  useEffect(() => {
    metronomeRef.current = new MetronomeEngine();
    
    metronomeRef.current.onBeat((beat, isAccent) => {
      setCurrentBeat(beat);
    });

    return () => {
      metronomeRef.current?.destroy();
    };
  }, []);

  // Actualizar configuración del metrónomo
  useEffect(() => {
    if (metronomeRef.current) {
      metronomeRef.current.configure({
        bpm,
        beatsPerMeasure,
        subdivision,
      });
    }
  }, [bpm, beatsPerMeasure, subdivision]);

  // Toggle play/stop
  const togglePlay = () => {
    if (!metronomeRef.current) return;

    if (isPlaying) {
      metronomeRef.current.stop();
      setIsPlaying(false);
      setCurrentBeat(-1);
    } else {
      metronomeRef.current.start();
      setIsPlaying(true);
    }
  };

  // Tap tempo
  const handleTapTempo = () => {
    const now = Date.now();
    const newTimes = [...tapTempoTimes, now].filter(t => now - t < 3000); // Mantener últimos 3 segundos
    
    if (newTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTimes.length; i++) {
        intervals.push(newTimes[i] - newTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      
      if (calculatedBpm >= 40 && calculatedBpm <= 300) {
        setBpm(calculatedBpm);
      }
    }
    
    setTapTempoTimes(newTimes);
  };

  // Subdivisiones disponibles
  const subdivisions = [
    { value: 1, label: 'Negras' },
    { value: 2, label: 'Corcheas' },
    { value: 3, label: 'Tresillos' },
    { value: 4, label: 'Semicorcheas' },
  ];

  // Compases disponibles
  const timeSignatures = [2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">🎵 Metrónomo</h1>
            <p className="text-gray-400">Practica con precisión</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Display BPM */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 mb-6 text-center">
          <div className="text-7xl font-bold text-orange-500 mb-2">{bpm}</div>
          <div className="text-gray-400 text-lg">BPM</div>
        </div>

        {/* Indicador visual de pulso */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-6">
          <div className="flex justify-center gap-2">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => {
              const isActive = currentBeat >= 0 && Math.floor(currentBeat / subdivision) === i;
              const isAccent = i === 0;
              
              return (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full transition-all duration-75 ${
                    isActive
                      ? isAccent
                        ? 'bg-orange-500 scale-110'
                        : 'bg-blue-500 scale-105'
                      : 'bg-gray-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Controles principales */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-6">
          {/* Play/Stop y Tap Tempo */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={togglePlay}
              className={`flex-1 py-6 rounded-xl font-bold text-xl transition-all ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? '⏸ Detener' : '▶ Iniciar'}
            </button>
            <button
              onClick={handleTapTempo}
              className="flex-1 py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xl"
            >
              👆 Tap Tempo
            </button>
          </div>

          {/* Control de BPM */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">BPM: {bpm}</label>
            <input
              type="range"
              min="40"
              max="300"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>40</span>
              <span>300</span>
            </div>
          </div>

          {/* Compás */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium">Compás</label>
            <div className="grid grid-cols-6 gap-2">
              {timeSignatures.map(beats => (
                <button
                  key={beats}
                  onClick={() => setBeatsPerMeasure(beats)}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    beatsPerMeasure === beats
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {beats}/4
                </button>
              ))}
            </div>
          </div>

          {/* Subdivisión */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Subdivisión</label>
            <div className="grid grid-cols-4 gap-2">
              {subdivisions.map(sub => (
                <button
                  key={sub.value}
                  onClick={() => setSubdivision(sub.value)}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    subdivision === sub.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Presets rápidos */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">⚡ Presets Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setBpm(60);
                setBeatsPerMeasure(4);
                setSubdivision(1);
              }}
              className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Lento (60 BPM)
            </button>
            <button
              onClick={() => {
                setBpm(100);
                setBeatsPerMeasure(4);
                setSubdivision(1);
              }}
              className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Moderato (100 BPM)
            </button>
            <button
              onClick={() => {
                setBpm(140);
                setBeatsPerMeasure(4);
                setSubdivision(2);
              }}
              className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Rápido (140 BPM)
            </button>
            <button
              onClick={() => {
                setBpm(180);
                setBeatsPerMeasure(4);
                setSubdivision(2);
              }}
              className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Muy Rápido (180 BPM)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
