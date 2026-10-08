// ============================================================
// DrumPro - Componente del Metrónomo Profesional
// Función principal: BPM, compás, subdivisiones, acentos, tap tempo
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MetronomeEngine } from '../../audio/MetronomeEngine';
import { AccentLevel, MetronomeSound, Subdivision, TimeSignature } from '../../types';

// --- Constantes ---
const TIME_SIGNATURES: { value: TimeSignature; label: string }[] = [
  { value: '2/4', label: '2/4' },
  { value: '3/4', label: '3/4' },
  { value: '4/4', label: '4/4' },
  { value: '5/4', label: '5/4' },
  { value: '6/8', label: '6/8' },
  { value: '7/8', label: '7/8' },
  { value: '9/8', label: '9/8' },
  { value: '12/8', label: '12/8' },
  { value: 'custom', label: 'Personalizado' },
];

const SUBDIVISIONS: { value: Subdivision; label: string }[] = [
  { value: 'quarter', label: 'Negras' },
  { value: 'eighth', label: 'Corcheas' },
  { value: 'triplet', label: 'Tresillos' },
  { value: 'sixteenth', label: 'Semicorcheas' },
  { value: 'swing', label: 'Swing' },
];

const SOUNDS: { value: MetronomeSound; label: string; icon: string }[] = [
  { value: 'click', label: 'Click', icon: '🔊' },
  { value: 'cowbell', label: 'Cowbell', icon: '🔔' },
  { value: 'hihat', label: 'Hi-Hat', icon: '🥁' },
  { value: 'wood', label: 'Madera', icon: '🪵' },
];

const ACCENT_LABELS: Record<AccentLevel, string> = {
  strong: 'Fuerte',
  medium: 'Medio',
  soft: 'Suave',
  mute: 'Silencio',
};

const ACCENT_COLORS: Record<AccentLevel, string> = {
  strong: 'bg-red-500',
  medium: 'bg-yellow-500',
  soft: 'bg-blue-400',
  mute: 'bg-gray-600',
};

interface MetronomeProps {
  config?: {
    bpm: number;
    timeSignature: TimeSignature;
    customBeats: number;
    subdivision: Subdivision;
    accents: AccentLevel[];
    sound: MetronomeSound;
    volume: number;
    flashScreen: boolean;
  };
  onConfigChange?: (config: any) => void;
}

export default function Metronome({ config: externalConfig, onConfigChange }: MetronomeProps) {
  // Estado local
  const [bpm, setBpm] = useState(externalConfig?.bpm || 120);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>(externalConfig?.timeSignature || '4/4');
  const [customBeats, setCustomBeats] = useState(externalConfig?.customBeats || 4);
  const [subdivision, setSubdivision] = useState<Subdivision>(externalConfig?.subdivision || 'quarter');
  const [sound, setSound] = useState<MetronomeSound>(externalConfig?.sound || 'click');
  const [volume, setVolume] = useState(externalConfig?.volume || 0.8);
  const [flashScreen, setFlashScreen] = useState(externalConfig?.flashScreen || false);
  const [accents, setAccents] = useState<AccentLevel[]>(
    externalConfig?.accents || ['strong', 'medium', 'medium', 'medium']
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [flash, setFlash] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Tap tempo
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  // Referencias
  const engineRef = useRef<MetronomeEngine | null>(null);

  // Número de pulsos según el compás
  const beatsPerMeasure = timeSignature === 'custom' ? customBeats :
    parseInt(timeSignature.split('/')[0]);

  // Inicializar motor de audio
  useEffect(() => {
    engineRef.current = new MetronomeEngine();
    
    engineRef.current.onBeat((beat: number, _accent: AccentLevel, _sub: number) => {
      setCurrentBeat(beat);
    });

    engineRef.current.onFlash(() => {
      if (flashScreen) {
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }
    });

    return () => {
      engineRef.current?.destroy();
    };
  }, [flashScreen]);

  // Sincronizar configuración con el motor
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.configure({
        bpm,
        timeSignature,
        customBeats,
        subdivision,
        accents,
        sound,
        volume,
      });
    }
  }, [bpm, timeSignature, customBeats, subdivision, accents, sound, volume]);

  // Notificar cambios de config al padre
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({ bpm, timeSignature, customBeats, subdivision, accents, sound, volume, flashScreen });
    }
  }, [bpm, timeSignature, customBeats, subdivision, accents, sound, volume, flashScreen, onConfigChange]);

  // Ajustar acentos cuando cambia el compás
  useEffect(() => {
    const newAccents: AccentLevel[] = [];
    for (let i = 0; i < beatsPerMeasure; i++) {
      if (i === 0) newAccents.push('strong');
      else if (i === Math.floor(beatsPerMeasure / 2)) newAccents.push('medium');
      else newAccents.push('medium');
    }
    setAccents(newAccents);
  }, [beatsPerMeasure]);

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

  // Tap Tempo
  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    setTapTimes(prev => {
      const recent = prev.filter(t => now - t < 3000); // descartar taps viejos
      const newTaps = [...recent, now];
      
      if (newTaps.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < newTaps.length; i++) {
          intervals.push(newTaps[i] - newTaps[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const calculatedBpm = Math.round(60000 / avgInterval);
        const clampedBpm = Math.max(20, Math.min(400, calculatedBpm));
        setBpm(clampedBpm);
      }
      
      return newTaps;
    });
  }, []);

  // Cambiar acento de un pulso
  const cycleAccent = (index: number) => {
    const order: AccentLevel[] = ['strong', 'medium', 'soft', 'mute'];
    const current = accents[index] || 'medium';
    const nextIndex = (order.indexOf(current) + 1) % order.length;
    const newAccents = [...accents];
    newAccents[index] = order[nextIndex];
    setAccents(newAccents);
  };

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyT') {
        handleTapTempo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleTapTempo]);

  return (
    <div className={`flex flex-col h-full ${flash ? 'bg-white' : ''} transition-colors duration-75`}>
      {/* --- Indicador visual de pulso --- */}
      <div className="flex justify-center items-center py-4">
        <div className="flex gap-2">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-75
                ${currentBeat === i 
                  ? `${ACCENT_COLORS[accents[i]] || 'bg-blue-400'} scale-125 shadow-lg` 
                  : 'bg-gray-700 scale-100'
                }
                ${accents[i] === 'mute' ? 'opacity-40' : ''}
              `}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* --- BPM Display --- */}
      <div className="text-center py-2">
        <div className="text-6xl sm:text-7xl font-mono font-bold text-white">
          {bpm}
        </div>
        <div className="text-gray-400 text-sm mt-1">BPM</div>
      </div>

      {/* --- Controles de BPM --- */}
      <div className="flex items-center justify-center gap-3 px-4 py-2">
        <button
          onClick={() => setBpm(Math.max(20, bpm - 1))}
          className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-xl font-bold flex items-center justify-center"
        >
          −
        </button>
        
        <input
          type="range"
          min={20}
          max={400}
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="flex-1 max-w-[200px] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        
        <button
          onClick={() => setBpm(Math.min(400, bpm + 1))}
          className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-xl font-bold flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* --- Botones principales --- */}
      <div className="flex justify-center gap-4 px-4 py-3">
        <button
          onClick={handleTapTempo}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-xl text-white font-bold text-sm"
        >
          TAP TEMPO
        </button>
        
        <button
          onClick={togglePlay}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg transition-all
            ${isPlaying 
              ? 'bg-red-500 hover:bg-red-400 active:bg-red-600 animate-pulse' 
              : 'bg-green-500 hover:bg-green-400 active:bg-green-600'
            }
          `}
        >
          {isPlaying ? '⏹' : '▶'}
        </button>
      </div>

      {/* --- Compás --- */}
      <div className="px-4 py-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Compás</label>
        <div className="flex flex-wrap gap-1 mt-1">
          {TIME_SIGNATURES.map(ts => (
            <button
              key={ts.value}
              onClick={() => setTimeSignature(ts.value)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors
                ${timeSignature === ts.value 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {ts.label}
            </button>
          ))}
        </div>
        {timeSignature === 'custom' && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 text-sm">Pulsos:</span>
            <input
              type="number"
              min={1}
              max={16}
              value={customBeats}
              onChange={(e) => setCustomBeats(parseInt(e.target.value) || 4)}
              className="w-16 bg-gray-700 text-white rounded px-2 py-1 text-center"
            />
          </div>
        )}
      </div>

      {/* --- Subdivisiones --- */}
      <div className="px-4 py-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Subdivisión</label>
        <div className="flex flex-wrap gap-1 mt-1">
          {SUBDIVISIONS.map(sub => (
            <button
              key={sub.value}
              onClick={() => setSubdivision(sub.value)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors
                ${subdivision === sub.value 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- Sonido --- */}
      <div className="px-4 py-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Sonido</label>
        <div className="flex gap-2 mt-1">
          {SOUNDS.map(s => (
            <button
              key={s.value}
              onClick={() => setSound(s.value)}
              className={`flex-1 py-2 rounded text-xs font-medium transition-colors
                ${sound === s.value 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <span className="text-lg">{s.icon}</span>
              <div>{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* --- Volumen --- */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400 uppercase tracking-wide">Volumen</label>
          <span className="text-xs text-gray-400">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume * 100}
          onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 mt-1"
        />
      </div>

      {/* --- Acentos (avanzado) --- */}
      <div className="px-4 py-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
        >
          <span>{showAdvanced ? '▼' : '▶'}</span>
          Acentos por pulso
        </button>
        
        {showAdvanced && (
          <div className="flex flex-wrap gap-2 mt-2">
            {accents.map((accent, i) => (
              <button
                key={i}
                onClick={() => cycleAccent(i)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${ACCENT_COLORS[accent]} text-white
                `}
              >
                <div className="font-bold">{i + 1}</div>
                <div className="text-[10px]">{ACCENT_LABELS[accent]}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- Flash de pantalla --- */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">Flash en pulso fuerte</span>
        <button
          onClick={() => setFlashScreen(!flashScreen)}
          className={`w-10 h-6 rounded-full transition-colors ${flashScreen ? 'bg-orange-500' : 'bg-gray-600'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${flashScreen ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* --- Atajos --- */}
      <div className="px-4 py-2 text-center">
        <span className="text-[10px] text-gray-500">Espacio = Play/Stop | T = Tap Tempo</span>
      </div>
    </div>
  );
}
