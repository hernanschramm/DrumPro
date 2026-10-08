// ============================================================
// DrumPro Academy - Componente Piano Roll
// Fase 9: Detección de Notas y Piano Roll
// Visualización profesional de notas detectadas
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { DetectedNote, midiToNoteName, getNoteColor } from '../data/NoteDetector';

interface PianoRollProps {
  notes: DetectedNote[];
  currentTime?: number;
  duration?: number;
  onNoteClick?: (note: DetectedNote) => void;
}

export default function PianoRoll({ notes, currentTime = 0, duration = 30, onNoteClick }: PianoRollProps) {
  const [zoom, setZoom] = useState(1);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [selectedNote, setSelectedNote] = useState<DetectedNote | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcular rango de notas
  const minNote = notes.length > 0 ? Math.min(...notes.map(n => n.pitchMidi)) - 2 : 24;
  const maxNote = notes.length > 0 ? Math.max(...notes.map(n => n.pitchMidi)) + 2 : 96;
  const noteRange = maxNote - minNote;

  // Dimensiones
  const pianoWidth = 60;
  const noteHeight = 8;
  const totalHeight = noteRange * noteHeight;
  const totalWidth = duration * 50 * zoom; // 50px por segundo * zoom

  // Dibujar piano roll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar líneas de octava
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    for (let note = minNote; note <= maxNote; note++) {
      const y = (maxNote - note) * noteHeight - scrollY;
      
      if (y < 0 || y > canvas.height) continue;

      // Línea de nota
      if (note % 12 === 0) {
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(pianoWidth, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Dibujar líneas de tiempo
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    const pixelsPerSecond = 50 * zoom;
    for (let time = 0; time <= duration; time++) {
      const x = pianoWidth + time * pixelsPerSecond - scrollX;
      
      if (x < pianoWidth || x > canvas.width) continue;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();

      // Etiqueta de tiempo
      if (time % 5 === 0) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px monospace';
        ctx.fillText(`${time}s`, x + 2, 12);
      }
    }

    // Dibujar notas
    notes.forEach(note => {
      const x = pianoWidth + note.startTime * pixelsPerSecond - scrollX;
      const y = (maxNote - note.pitchMidi) * noteHeight - scrollY;
      const width = note.duration * pixelsPerSecond;
      const height = noteHeight - 1;

      // Verificar si está visible
      if (x + width < pianoWidth || x > canvas.width) return;
      if (y + height < 0 || y > canvas.height) return;

      // Color según instrumento
      const colors: Record<string, string> = {
        guitar: '#10b981',
        bass: '#3b82f6',
        keys: '#f59e0b',
      };
      
      const color = colors[note.instrument || 'guitar'] || '#10b981';
      
      // Dibujar nota
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3 + note.amplitude * 0.7;
      ctx.fillRect(x, y, width, height);
      
      // Borde
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);

      // Nota seleccionada
      if (selectedNote && selectedNote.id === note.id) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 1, y - 1, width + 2, height + 2);
      }
    });

    // Dibujar playhead (indicador de tiempo actual)
    if (currentTime > 0) {
      const playheadX = pianoWidth + currentTime * pixelsPerSecond - scrollX;
      
      if (playheadX >= pianoWidth && playheadX <= canvas.width) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, canvas.height);
        ctx.stroke();
      }
    }

    // Dibujar piano (teclado vertical)
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, pianoWidth, canvas.height);

    // Teclas del piano
    for (let note = minNote; note <= maxNote; note++) {
      const y = (maxNote - note) * noteHeight - scrollY;
      
      if (y < 0 || y > canvas.height) continue;

      const isBlackKey = [1, 3, 6, 8, 10].includes(note % 12);
      
      ctx.fillStyle = isBlackKey ? '#1f2937' : '#f3f4f6';
      ctx.fillRect(0, y, pianoWidth - 2, noteHeight - 1);
      
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, y, pianoWidth - 2, noteHeight - 1);

      // Etiqueta de nota (solo en C)
      if (note % 12 === 0) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '9px monospace';
        ctx.fillText(midiToNoteName(note), 2, y + 6);
      }
    }

  }, [notes, currentTime, zoom, scrollX, scrollY, selectedNote, minNote, maxNote, duration]);

  // Manejar click en nota
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixelsPerSecond = 50 * zoom;

    // Buscar nota clickeada
    for (const note of notes) {
      const noteX = pianoWidth + note.startTime * pixelsPerSecond - scrollX;
      const noteY = (maxNote - note.pitchMidi) * noteHeight - scrollY;
      const noteWidth = note.duration * pixelsPerSecond;
      const noteHeightPx = noteHeight - 1;

      if (x >= noteX && x <= noteX + noteWidth && y >= noteY && y <= noteY + noteHeightPx) {
        setSelectedNote(note);
        onNoteClick?.(note);
        return;
      }
    }

    setSelectedNote(null);
  };

  // Scroll con rueda del mouse
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      // Zoom
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    } else {
      // Scroll
      setScrollX(prev => Math.max(0, prev + e.deltaX));
      setScrollY(prev => Math.max(0, Math.min(totalHeight - 400, prev + e.deltaY)));
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* Controles */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
        <div className="text-sm text-gray-400">
          {notes.length} notas detectadas
        </div>
      </div>

      {/* Piano Roll */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: '400px' }}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          width={1200}
          height={400}
          onClick={handleCanvasClick}
          className="cursor-crosshair"
        />
      </div>

      {/* Info de nota seleccionada */}
      {selectedNote && (
        <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">
              <span className="font-medium">Nota:</span> {midiToNoteName(selectedNote.pitchMidi)}
              <span className="ml-4">
                <span className="font-medium">Inicio:</span> {selectedNote.startTime.toFixed(2)}s
              </span>
              <span className="ml-4">
                <span className="font-medium">Duración:</span> {selectedNote.duration.toFixed(2)}s
              </span>
              <span className="ml-4">
                <span className="font-medium">Instrumento:</span> {selectedNote.instrument}
              </span>
            </div>
            <button
              onClick={() => setSelectedNote(null)}
              className="text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-gray-800/50 px-4 py-2 text-xs text-gray-500 border-t border-gray-700">
        💡 Ctrl + Scroll = Zoom | Scroll = Desplazar | Click = Seleccionar nota
      </div>
    </div>
  );
}
