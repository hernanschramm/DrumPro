// ============================================================
// DrumPro - Entrenador de Práctica
// Modos: silenciar compases, aumento gradual de tempo
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MetronomeEngine } from '../../audio/MetronomeEngine';
import { AccentLevel, TimeSignature } from '../../types';
import { useAppState } from '../../store/AppContext';

export default function PracticeTrainer() {
  const { dispatch } = useAppState();

  // Configuración del metrónomo base
  const [bpm, setBpm] = useState(100);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0]);

  // Modo silenciar compases
  const [muteBarsEnabled, setMuteBarsEnabled] = useState(false);
  const [playBars, setPlayBars] = useState(4);
  const [restBars, setRestBars] = useState(2);

  // Modo aumento gradual
  const [gradualEnabled, setGradualEnabled] = useState(false);
  const [startBpm, setStartBpm] = useState(80);
  const [incrementBpm, setIncrementBpm] = useState(5);
  const [everyBars, setEveryBars] = useState(8);
  const [targetBpm, setTargetBpm] = useState(160);

  // Estado de ejecución
  const [isRunning, setIsRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [currentBar, setCurrentBar] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(bpm);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  // Referencias
  const engineRef = useRef<MetronomeEngine | null>(null);
  const barCountRef = useRef(0);
  const sessionStartRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Inicializar motor
  useEffect(() => {
    engineRef.current = new MetronomeEngine();
    engineRef.current.onBeat((beat: number) => {
      setCurrentBeat(beat);
    });
    return () => {
      engineRef.current?.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Lógica de silenciar compases
  useEffect(() => {
    if (!isRunning || !muteBarsEnabled) return;

    const totalCycle = playBars + restBars;
    const barInCycle = barCountRef.current % totalCycle;
    const shouldBeMuted = barInCycle >= playBars;
    setIsMuted(shouldBeMuted);
  }, [currentBeat, isRunning, muteBarsEnabled, playBars, restBars]);

  // Detectar cambio de compás para actualizar barra
  useEffect(() => {
    if (!isRunning) return;
    const subdivisionsPerBeat = 1; // simplificado
    const totalSubdivisions = beatsPerMeasure * subdivisionsPerBeat;
    
    if (currentBeat === 0 && engineRef.current?.getIsPlaying()) {
      barCountRef.current += 1;
      setCurrentBar(barCountRef.current);

      // Lógica de silenciar
      if (muteBarsEnabled) {
        const totalCycle = playBars + restBars;
        const barInCycle = barCountRef.current % totalCycle;
        setIsMuted(barInCycle >= playBars);
      }

      // Lógica de aumento gradual
      if (gradualEnabled && barCountRef.current % everyBars === 0 && barCountRef.current > 0) {
        const newBpm = Math.min(targetBpm, startBpm + Math.floor(barCountRef.current / everyBars) * incrementBpm);
        setCurrentBpm(newBpm);
        if (engineRef.current) {
          engineRef.current.configure({ bpm: newBpm });
        }
      }
    }
  }, [currentBeat, isRunning, beatsPerMeasure, muteBarsEnabled, playBars, restBars, gradualEnabled, startBpm, incrementBpm, everyBars, targetBpm]);

  // Actualizar volumen según mute
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.configure({ volume: isMuted ? 0 : 0.8 });
    }
  }, [isMuted]);

  // Timer de sesión
  useEffect(() => {
    if (isRunning && !sessionActive) {
      setSessionActive(true);
      sessionStartRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        setSessionSeconds(Math.floor((Date.now() - sessionStartRef.current) / 1000));
      }, 1000);
    } else if (!isRunning && sessionActive) {
      setSessionActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Guardar tiempo de práctica
      const today = new Date().toISOString().split('T')[0];
      dispatch({ type: 'ADD_PRACTICE_TIME', payload: { date: today, seconds: sessionSeconds } });
    }
  }, [isRunning, sessionActive, dispatch, sessionSeconds]);

  // Configurar motor al iniciar
  const start = useCallback(() => {
    if (!engineRef.current) return;
    
    const initialBpm = gradualEnabled ? startBpm : bpm;
    setCurrentBpm(initialBpm);
    barCountRef.current = 0;
    setCurrentBar(0);
    setIsMuted(false);
    setSessionSeconds(0);

    const accents: AccentLevel[] = [];
    for (let i = 0; i < beatsPerMeasure; i++) {
      accents.push(i === 0 ? 'strong' : 'medium');
    }

    engineRef.current.configure({
      bpm: initialBpm,
      timeSignature,
      subdivision: 'quarter',
      accents,
      sound: 'click',
      volume: 0.8,
    });

    engineRef.current.start();
    setIsRunning(true);
  }, [bpm, timeSignature, beatsPerMeasure, gradualEnabled, startBpm]);

  const stop = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setIsRunning(false);
    setCurrentBeat(-1);
    setCurrentBar(0);
    setIsMuted(false);
  }, []);

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      {/* Timer de sesión */}
      <div className="text-center py-3 bg-gray-800/50">
        <div className="text-3xl font-mono text-green-400">{formatTime(sessionSeconds)}</div>
        <div className="text-xs text-gray-400">Tiempo de práctica</div>
      </div>

      {/* BPM actual */}
      <div className="text-center py-2">
        <div className="text-5xl font-mono font-bold text-white">{currentBpm}</div>
        <div className="text-xs text-gray-400">BPM actual</div>
      </div>

      {/* Indicador de compás */}
      <div className="flex justify-center gap-1 py-2">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full transition-all duration-75
              ${currentBeat === i ? (isMuted ? 'bg-gray-600' : 'bg-orange-500 scale-125') : 'bg-gray-700'}
              ${isMuted ? 'opacity-40' : ''}
            `}
          />
        ))}
      </div>

      {/* Estado de barra */}
      {isRunning && (
        <div className="text-center text-sm text-gray-400 py-1">
          Compás: {currentBar} {isMuted && <span className="text-red-400 font-bold">(SILENCIO)</span>}
        </div>
      )}

      {/* Botón Play/Stop */}
      <div className="flex justify-center py-3">
        <button
          onClick={isRunning ? stop : start}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg
            ${isRunning ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}
          `}
        >
          {isRunning ? '⏹' : '▶'}
        </button>
      </div>

      {/* Configuración base */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="text-xs text-gray-400 uppercase">BPM base</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="range"
              min={20}
              max={400}
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              disabled={isRunning}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <span className="text-white font-mono w-10 text-right">{bpm}</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase">Compás</label>
          <div className="flex gap-1 mt-1 flex-wrap">
            {['2/4', '3/4', '4/4', '5/4', '6/8', '7/8'].map(ts => (
              <button
                key={ts}
                onClick={() => !isRunning && setTimeSignature(ts as TimeSignature)}
                className={`px-2 py-1 rounded text-xs ${timeSignature === ts ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                {ts}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modo silenciar compases */}
      <div className="px-4 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white font-medium">🔇 Silenciar compases</span>
          <button
            onClick={() => !isRunning && setMuteBarsEnabled(!muteBarsEnabled)}
            className={`w-10 h-6 rounded-full transition-colors ${muteBarsEnabled ? 'bg-orange-500' : 'bg-gray-600'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${muteBarsEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
        
        {muteBarsEnabled && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs text-gray-400">Suenan (compases)</label>
              <input
                type="number"
                min={1}
                max={32}
                value={playBars}
                onChange={(e) => setPlayBars(parseInt(e.target.value) || 4)}
                disabled={isRunning}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Silencio (compases)</label>
              <input
                type="number"
                min={1}
                max={32}
                value={restBars}
                onChange={(e) => setRestBars(parseInt(e.target.value) || 2)}
                disabled={isRunning}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modo aumento gradual */}
      <div className="px-4 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white font-medium">📈 Aumento gradual</span>
          <button
            onClick={() => !isRunning && setGradualEnabled(!gradualEnabled)}
            className={`w-10 h-6 rounded-full transition-colors ${gradualEnabled ? 'bg-orange-500' : 'bg-gray-600'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${gradualEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
        
        {gradualEnabled && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs text-gray-400">BPM inicial</label>
              <input
                type="number"
                min={20}
                max={400}
                value={startBpm}
                onChange={(e) => setStartBpm(parseInt(e.target.value) || 80)}
                disabled={isRunning}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">BPM objetivo</label>
              <input
                type="number"
                min={20}
                max={400}
                value={targetBpm}
                onChange={(e) => setTargetBpm(parseInt(e.target.value) || 160)}
                disabled={isRunning}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Subir X BPM</label>
              <input
                type="number"
                min={1}
                max={50}
                value={incrementBpm}
                onChange={(e) => setIncrementBpm(parseInt(e.target.value) || 5)}
                disabled={isRunning}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Cada N compases</label>
              <input
                type="number"
                min={1}
                max={32}
                value={everyBars}
                onChange={(e) => setEveryBars(parseInt(e.target.value) || 8)}
                disabled={isRunning}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
