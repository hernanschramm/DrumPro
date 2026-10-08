// ============================================================
// DrumPro Academy - Reproductor Multitrack
// Fase 8: Servidor de Audio
// Interfaz completa para mixer multitrack con stems
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { MultitrackEngine, StemTrack } from '../data/MultitrackEngine';
import { BpmDetector, BpmDetectionResult } from '../data/BpmDetector';
import { NoteDetector, DetectedNote } from '../data/NoteDetector';
import PianoRoll from './PianoRoll';
import SocialRecorder from '../../redes/presentation/SocialRecorder';

interface MultitrackPlayerProps {
  songTitle: string;
  artist?: string;
  stems?: Array<{
    id: string;
    name: string;
    url: string;
    color: string;
  }>;
  onClose?: () => void;
}

export default function MultitrackPlayer({ songTitle, artist, stems = [], onClose }: MultitrackPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [tracks, setTracks] = useState<StemTrack[]>([]);
  const [bpmResult, setBpmResult] = useState<BpmDetectionResult | null>(null);
  const [isDetectingBpm, setIsDetectingBpm] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Estados para detección de notas
  const [detectedNotes, setDetectedNotes] = useState<DetectedNote[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<'guitar' | 'bass' | 'keys'>('guitar');
  const [isDetectingNotes, setIsDetectingNotes] = useState(false);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  
  // Estados para grabación de video
  const [showSocialRecorder, setShowSocialRecorder] = useState(false);

  const engineRef = useRef<MultitrackEngine | null>(null);
  const bpmDetectorRef = useRef<BpmDetector | null>(null);
  const noteDetectorRef = useRef<NoteDetector | null>(null);

  // Inicializar motores
  useEffect(() => {
    engineRef.current = new MultitrackEngine();
    bpmDetectorRef.current = new BpmDetector();
    noteDetectorRef.current = new NoteDetector();

    // Registrar callback de actualización de tiempo
    engineRef.current.onTimeUpdate((time) => {
      setCurrentTime(time);
    });

    // Cargar stems si hay
    if (stems.length > 0) {
      loadStems();
    } else {
      // Cargar stems de demostración
      loadDemoStems();
    }

    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  // Cargar stems de demostración
  const loadDemoStems = async () => {
    const demoStems = [
      { id: 'drums', name: 'Batería', url: 'demo://drums', color: '#EF4444' },
      { id: 'bass', name: 'Bajo', url: 'demo://bass', color: '#3B82F6' },
      { id: 'guitar', name: 'Guitarra', url: 'demo://guitar', color: '#10B981' },
      { id: 'vocals', name: 'Voz', url: 'demo://vocals', color: '#F59E0B' },
    ];

    for (const stem of demoStems) {
      await engineRef.current?.loadStem({
        ...stem,
        volume: 0.8,
        muted: false,
        solo: false,
      });
    }

    updateTracks();
  };

  // Cargar stems reales
  const loadStems = async () => {
    for (const stem of stems) {
      await engineRef.current?.loadStem({
        ...stem,
        volume: 0.8,
        muted: false,
        solo: false,
      });
    }
    updateTracks();
  };

  // Actualizar estado de tracks
  const updateTracks = () => {
    if (engineRef.current) {
      setTracks([...engineRef.current.getTracks()]);
      setDuration(engineRef.current.getDuration());
      setLoopEnd(engineRef.current.getDuration());
    }
  };

  // Play/Pause
  const togglePlay = () => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.pause();
      setIsPlaying(false);
    } else {
      engineRef.current.play();
      setIsPlaying(true);
    }
  };

  // Stop
  const stop = () => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Cambiar velocidad
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    engineRef.current?.setPlaybackRate(rate);
  };

  // Cambiar volumen de track
  const handleVolumeChange = (trackId: string, volume: number) => {
    engineRef.current?.setTrackVolume(trackId, volume);
    updateTracks();
  };

  // Mute track
  const handleMuteToggle = (trackId: string) => {
    engineRef.current?.toggleMute(trackId);
    updateTracks();
  };

  // Solo track
  const handleSoloToggle = (trackId: string) => {
    engineRef.current?.toggleSolo(trackId);
    updateTracks();
  };

  // Mute batería (para tocar encima)
  const muteDrums = () => {
    const drumsTrack = tracks.find(t => t.name.toLowerCase().includes('batería') || t.name.toLowerCase().includes('drums'));
    if (drumsTrack && !drumsTrack.muted) {
      engineRef.current?.toggleMute(drumsTrack.id);
      updateTracks();
    }
  };

  // Detectar BPM
  const detectBpm = async () => {
    if (!bpmDetectorRef.current) return;

    setIsDetectingBpm(true);
    try {
      const result = await bpmDetectorRef.current.detectBpm('demo://song');
      setBpmResult(result);
    } catch (error) {
      console.error('Error detectando BPM:', error);
    } finally {
      setIsDetectingBpm(false);
    }
  };

  // Detectar notas
  const detectNotes = async () => {
    if (!noteDetectorRef.current) return;

    setIsDetectingNotes(true);
    try {
      const result = await noteDetectorRef.current.detectNotes('demo://song', selectedInstrument);
      setDetectedNotes(result.notes);
      setShowPianoRoll(true);
    } catch (error) {
      console.error('Error detectando notas:', error);
    } finally {
      setIsDetectingNotes(false);
    }
  };

  // Configurar loop A-B
  const updateLoop = () => {
    engineRef.current?.setLoopRegion(loopStart, loopEnd, loopEnabled);
  };

  // Formatear tiempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular progreso
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">🎛️ Multitrack Player</h1>
            <p className="text-gray-400">{songTitle}{artist && ` - ${artist}`}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Controles principales */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-6">
          {/* Barra de progreso */}
          <div className="mb-4">
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                style={{ width: `${progress}%` }}
              />
              {loopEnabled && (
                <div
                  className="absolute h-full bg-yellow-500/30 border-l-2 border-r-2 border-yellow-500"
                  style={{
                    left: `${(loopStart / duration) * 100}%`,
                    width: `${((loopEnd - loopStart) / duration) * 100}%`,
                  }}
                />
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Botones de control */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={stop}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white text-xl"
            >
              ⏹
            </button>
            <button
              onClick={togglePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${
                isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

          {/* Control de velocidad */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-sm">
              Velocidad: {playbackRate.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>1.5x</span>
            </div>
          </div>

          {/* Botones especiales */}
          <div className="flex gap-3">
            <button
              onClick={muteDrums}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              🔇 Mute Batería (para tocar encima)
            </button>
            <button
              onClick={detectBpm}
              disabled={isDetectingBpm}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium"
            >
              {isDetectingBpm ? '⏳ Detectando...' : '🎵 Detectar BPM'}
            </button>
          </div>

          {/* Botón para grabar video para redes */}
          <button
            onClick={() => setShowSocialRecorder(true)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
          >
            📱 Grabar Video para Redes Sociales
          </button>

          {/* Resultado de BPM */}
          {bpmResult && (
            <div className="mt-4 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300 font-medium">BPM Detectado:</span>
                <span className="text-3xl font-bold text-blue-400">{bpmResult.bpm}</span>
              </div>
              <div className="text-sm text-blue-300">
                Confianza: {Math.round(bpmResult.confidence * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* Mixer de tracks */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">🎚️ Mixer de Stems</h3>
          <div className="space-y-4">
            {tracks.map(track => (
              <div key={track.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {/* Color indicator */}
                  <div
                    className="w-4 h-12 rounded"
                    style={{ backgroundColor: track.color }}
                  />

                  {/* Track info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{track.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMuteToggle(track.id)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            track.muted
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                        >
                          M
                        </button>
                        <button
                          onClick={() => handleSoloToggle(track.id)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            track.solo
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                        >
                          S
                        </button>
                      </div>
                    </div>

                    {/* Volume slider */}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={track.volume}
                      onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      disabled={track.muted}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>{Math.round(track.volume * 100)}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loop A-B (Advanced) */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-left text-white font-bold mb-4 flex items-center justify-between"
          >
            <span>⚙️ Configuración Avanzada</span>
            <span>{showAdvanced ? '▼' : '▶'}</span>
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Loop A-B */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  <input
                    type="checkbox"
                    checked={loopEnabled}
                    onChange={(e) => {
                      setLoopEnabled(e.target.checked);
                      setTimeout(updateLoop, 0);
                    }}
                    className="w-4 h-4"
                  />
                  <span>Loop A-B</span>
                </label>

                {loopEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">
                        Inicio (A): {formatTime(loopStart)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.1"
                        value={loopStart}
                        onChange={(e) => {
                          setLoopStart(parseFloat(e.target.value));
                          setTimeout(updateLoop, 0);
                        }}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">
                        Fin (B): {formatTime(loopEnd)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.1"
                        value={loopEnd}
                        onChange={(e) => {
                          setLoopEnd(parseFloat(e.target.value));
                          setTimeout(updateLoop, 0);
                        }}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-gray-700/50 rounded-lg p-4 text-sm text-gray-400">
                <p className="font-medium text-gray-300 mb-2">💡 Consejos:</p>
                <ul className="space-y-1">
                  <li>• Usa "Mute Batería" para tocar encima de la canción</li>
                  <li>• Ajusta la velocidad para practicar lento o rápido</li>
                  <li>• Usa "Solo" para escuchar una pista individual</li>
                  <li>• Configura Loop A-B para practicar secciones específicas</li>
                  <li>• Detecta el BPM automáticamente para sincronizar con metrónomo</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Detección de Notas y Piano Roll */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">🎼 Detección de Notas</h3>
          
          {/* Selector de instrumento */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-sm">Instrumento a analizar:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedInstrument('guitar')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  selectedInstrument === 'guitar'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎸 Guitarra
              </button>
              <button
                onClick={() => setSelectedInstrument('bass')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  selectedInstrument === 'bass'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎸 Bajo
              </button>
              <button
                onClick={() => setSelectedInstrument('keys')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  selectedInstrument === 'keys'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎹 Teclado
              </button>
            </div>
          </div>

          {/* Botón de detección */}
          <button
            onClick={detectNotes}
            disabled={isDetectingNotes}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium mb-4"
          >
            {isDetectingNotes ? '⏳ Detectando notas...' : '🎼 Detectar Notas'}
          </button>

          {/* Piano Roll */}
          {showPianoRoll && detectedNotes.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">
                  Piano Roll - {selectedInstrument === 'guitar' ? 'Guitarra' : selectedInstrument === 'bass' ? 'Bajo' : 'Teclado'}
                </h4>
                <button
                  onClick={() => setShowPianoRoll(false)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕ Cerrar
                </button>
              </div>
              <PianoRoll
                notes={detectedNotes}
                currentTime={currentTime}
                duration={duration}
              />
              <div className="mt-2 text-xs text-gray-400">
                {detectedNotes.length} notas detectadas • 
                Duración: {duration.toFixed(1)}s • 
                Rango: {detectedNotes.length > 0 ? `${Math.min(...detectedNotes.map(n => n.pitchMidi))} - ${Math.max(...detectedNotes.map(n => n.pitchMidi))} MIDI` : 'N/A'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Recorder Modal */}
      {showSocialRecorder && (
        <SocialRecorder
          songTitle={songTitle}
          audioUrl={stems?.[0]?.url}
          onClose={() => setShowSocialRecorder(false)}
        />
      )}
    </div>
  );
}
