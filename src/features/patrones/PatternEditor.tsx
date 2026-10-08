// ============================================================
// DrumPro - Editor de Patrones (Secuenciador de 16 pasos)
// Grilla para bombo, caja, hi-hat, tom y platillo
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { SequencerEngine } from '../../audio/SequencerEngine';
import { PatternStep, Pattern } from '../../types';
import { useAppState } from '../../store/AppContext';

// Instrumentos disponibles
const INSTRUMENTS = [
  { key: 'kick', label: 'Bombo', color: 'bg-red-500', emoji: '🥁' },
  { key: 'snare', label: 'Caja', color: 'bg-yellow-500', emoji: '🪘' },
  { key: 'hihatClosed', label: 'HH Cerrado', color: 'bg-blue-400', emoji: '🔔' },
  { key: 'hihatOpen', label: 'HH Abierto', color: 'bg-cyan-400', emoji: '🎐' },
  { key: 'tom', label: 'Tom', color: 'bg-purple-500', emoji: '🪇' },
  { key: 'cymbal', label: 'Platillo', color: 'bg-green-400', emoji: '✨' },
] as const;

type InstrumentKey = typeof INSTRUMENTS[number]['key'];

// Crear paso vacío
const emptyStep = (): PatternStep => ({
  kick: false,
  snare: false,
  hihatClosed: false,
  hihatOpen: false,
  tom: false,
  cymbal: false,
});

// Crear patrón vacío (16 pasos)
const emptyPattern = (): PatternStep[] => Array.from({ length: 16 }, emptyStep);

// Patrones predefinidos
const PRESETS: { name: string; steps: PatternStep[] }[] = [
  {
    name: 'Rock Básico',
    steps: Array.from({ length: 16 }, (_, i) => ({
      kick: i === 0 || i === 8,
      snare: i === 4 || i === 12,
      hihatClosed: i % 2 === 0,
      hihatOpen: false,
      tom: false,
      cymbal: false,
    })),
  },
  {
    name: 'Funk',
    steps: Array.from({ length: 16 }, (_, i) => ({
      kick: i === 0 || i === 6 || i === 10,
      snare: i === 4 || i === 12 || i === 14,
      hihatClosed: i % 2 === 0,
      hihatOpen: i === 3 || i === 11,
      tom: false,
      cymbal: false,
    })),
  },
  {
    name: 'Reggaeton',
    steps: Array.from({ length: 16 }, (_, i) => ({
      kick: i === 0 || i === 6 || i === 8 || i === 14,
      snare: i === 3 || i === 11,
      hihatClosed: i % 2 === 0,
      hihatOpen: false,
      tom: false,
      cymbal: false,
    })),
  },
];

export default function PatternEditor() {
  const { state, dispatch } = useAppState();
  const [steps, setSteps] = useState<PatternStep[]>(emptyPattern());
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [patternName, setPatternName] = useState('Mi Patrón');
  const [showPresets, setShowPresets] = useState(false);

  const engineRef = useRef<SequencerEngine | null>(null);

  // Inicializar motor del secuenciador
  useEffect(() => {
    engineRef.current = new SequencerEngine();
    engineRef.current.onStep((step: number) => {
      setCurrentStep(step);
    });
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  // Toggle un instrumento en un paso
  const toggleStep = (stepIndex: number, instrument: InstrumentKey) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = { ...newSteps[stepIndex], [instrument]: !newSteps[stepIndex][instrument] };
    setSteps(newSteps);
  };

  // Play/Stop
  const togglePlay = () => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setCurrentStep(-1);
    } else {
      engineRef.current.configure(bpm, steps, 0.8);
      engineRef.current.start();
      setIsPlaying(true);
    }
  };

  // Cargar preset
  const loadPreset = (preset: typeof PRESETS[number]) => {
    setSteps(preset.steps);
    setPatternName(preset.name);
    setShowPresets(false);
  };

  // Limpiar patrón
  const clearPattern = () => {
    setSteps(emptyPattern());
  };

  // Guardar patrón
  const savePattern = () => {
    const pattern: Pattern = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: patternName,
      bpm,
      steps: [...steps],
    };
    dispatch({ type: 'ADD_PATTERN', payload: pattern });
  };

  // Cargar patrón guardado
  const loadSavedPattern = (pattern: Pattern) => {
    setSteps([...pattern.steps]);
    setBpm(pattern.bpm);
    setPatternName(pattern.name);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      {/* Controles superiores */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
            className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm"
            placeholder="Nombre del patrón"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setBpm(Math.max(20, bpm - 5))}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
            >
              −
            </button>
            <span className="text-white font-mono w-10 text-center">{bpm}</span>
            <button
              onClick={() => setBpm(Math.min(400, bpm + 5))}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-lg font-bold text-sm ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isPlaying ? '⏹ Stop' : '▶ Play'}
          </button>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm"
          >
            📦 Presets
          </button>
          <button
            onClick={clearPattern}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm"
          >
            🗑️ Limpiar
          </button>
          <button
            onClick={savePattern}
            className="px-3 py-2 bg-orange-500 hover:bg-orange-400 rounded-lg text-white text-sm ml-auto"
          >
            💾 Guardar
          </button>
        </div>
      </div>

      {/* Presets */}
      {showPresets && (
        <div className="px-4 py-2 border-b border-gray-700">
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-white text-xs"
              >
                {preset.name}
              </button>
            ))}
          </div>
          {state.patterns.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-400 mb-1">Patrones guardados:</div>
              <div className="flex gap-1 flex-wrap">
                {state.patterns.map(p => (
                  <button
                    key={p.id}
                    onClick={() => loadSavedPattern(p)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-xs"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grilla del secuenciador */}
      <div className="px-2 py-3 overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Numeración de pasos */}
          <div className="flex mb-1">
            <div className="w-20 sm:w-24 flex-shrink-0" />
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 text-center text-[10px] ${
                  currentStep === i ? 'text-orange-400 font-bold' : 'text-gray-500'
                } ${i % 4 === 0 ? 'text-gray-400 font-medium' : ''}`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Filas de instrumentos */}
          {INSTRUMENTS.map(instrument => (
            <div key={instrument.key} className="flex items-center mb-1">
              <div className="w-20 sm:w-24 flex-shrink-0 text-xs text-gray-400 pr-1 truncate">
                <span className="mr-1">{instrument.emoji}</span>
                <span className="hidden sm:inline">{instrument.label}</span>
              </div>
              {steps.map((step, stepIndex) => (
                <button
                  key={stepIndex}
                  onClick={() => toggleStep(stepIndex, instrument.key)}
                  className={`flex-1 h-8 mx-0.5 rounded transition-all duration-75
                    ${step[instrument.key]
                      ? `${instrument.color} shadow-sm`
                      : currentStep === stepIndex
                        ? 'bg-gray-600'
                        : stepIndex % 4 === 0
                          ? 'bg-gray-700/80'
                          : 'bg-gray-700/40'
                    }
                    ${currentStep === stepIndex ? 'ring-1 ring-white/30' : ''}
                    hover:opacity-80 active:scale-95
                  `}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de posición */}
      <div className="px-4 py-2 text-center">
        <div className="flex justify-center gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-1 rounded-full transition-all duration-75
                ${currentStep === i ? 'bg-orange-500' : i % 4 === 0 ? 'bg-gray-500' : 'bg-gray-700'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
