// ============================================================
// DrumPro Academy - Detector de Notas
// Fase 9: Detección de Notas y Piano Roll
// Simula la detección de notas (en producción usaría Basic Pitch)
// ============================================================

/** Nota musical detectada */
export interface DetectedNote {
  id: string;
  pitchMidi: number; // 0-127 (MIDI)
  startTime: number; // segundos
  duration: number; // segundos
  amplitude: number; // 0-1 (volumen)
  instrument?: string; // guitarra, bajo, teclado
}

/** Resultado de detección de notas */
export interface NoteDetectionResult {
  notes: DetectedNote[];
  instrument: string;
  processingTime: number;
  confidence: number;
}

/**
 * Simulador de detección de notas
 * En producción: usaría Basic Pitch de Spotify (Python)
 * API: POST /api/detect-notes con archivo de audio
 */
export class NoteDetector {
  /**
   * Detecta notas de un instrumento en un archivo de audio
   */
  async detectNotes(
    audioUrl: string,
    instrument: 'guitar' | 'bass' | 'keys'
  ): Promise<NoteDetectionResult> {
    // Simular tiempo de procesamiento
    await this.simulateProcessing(3000);

    // Generar notas simuladas según el instrumento
    const notes = this.generateRealisticNotes(instrument, 30); // 30 segundos

    return {
      notes,
      instrument,
      processingTime: 3000 + Math.random() * 1000,
      confidence: 0.75 + Math.random() * 0.2,
    };
  }

  /**
   * Genera notas realistas según el tipo de instrumento
   */
  private generateRealisticNotes(
    instrument: string,
    durationSeconds: number
  ): DetectedNote[] {
    const notes: DetectedNote[] = [];
    let currentTime = 0;

    // Rangos de notas MIDI por instrumento
    const ranges: Record<string, { min: number; max: number }> = {
      guitar: { min: 40, max: 76 }, // E2 a G5
      bass: { min: 28, max: 52 }, // E1 a E3
      keys: { min: 36, max: 84 }, // C2 a C6
    };

    const range = ranges[instrument] || ranges.guitar;
    const scales = this.getCommonScales();
    const scale = scales[Math.floor(Math.random() * scales.length)];

    while (currentTime < durationSeconds) {
      // Duración variable de notas
      const noteDuration = this.getRandomNoteDuration();
      
      // Seleccionar nota de la escala
      const pitchMidi = this.getNoteFromScale(scale, range.min, range.max);
      
      // Amplitud variable
      const amplitude = 0.4 + Math.random() * 0.6;

      notes.push({
        id: `note-${notes.length}-${Date.now()}`,
        pitchMidi,
        startTime: currentTime,
        duration: noteDuration,
        amplitude,
        instrument,
      });

      // Avanzar tiempo con pausa variable
      currentTime += noteDuration + this.getRandomPause();
    }

    return notes;
  }

  /**
   * Escalas comunes para generar notas realistas
   */
  private getCommonScales(): number[][] {
    return [
      // Escala de Do mayor (C D E F G A B)
      [60, 62, 64, 65, 67, 69, 71],
      // Escala de La menor (A B C D E F G)
      [57, 59, 60, 62, 64, 65, 67],
      // Escala pentatónica menor
      [48, 51, 53, 55, 58],
      // Escala de blues
      [48, 51, 53, 54, 55, 58],
    ];
  }

  /**
   * Obtiene una nota aleatoria de una escala dentro del rango
   */
  private getNoteFromScale(scale: number[], min: number, max: number): number {
    const octaves = Math.floor((max - min) / 12);
    const octaveOffset = Math.floor(Math.random() * octaves) * 12;
    const noteInScale = scale[Math.floor(Math.random() * scale.length)];
    
    let result = min + octaveOffset + (noteInScale - scale[0]);
    
    // Asegurar que está en el rango
    while (result > max) result -= 12;
    while (result < min) result += 12;
    
    return result;
  }

  /**
   * Duración aleatoria de nota (realista)
   */
  private getRandomNoteDuration(): number {
    const durations = [0.125, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0];
    const weights = [0.1, 0.25, 0.3, 0.15, 0.1, 0.05, 0.05];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < durations.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return durations[i];
      }
    }
    
    return 0.5;
  }

  /**
   * Pausa aleatoria entre notas
   */
  private getRandomPause(): number {
    return Math.random() * 0.3; // 0-300ms de pausa
  }

  /**
   * Simula tiempo de procesamiento
   */
  private simulateProcessing(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Convierte MIDI pitch a nombre de nota
 */
export function midiToNoteName(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const note = noteNames[midi % 12];
  return `${note}${octave}`;
}

/**
 * Convierte MIDI pitch a frecuencia en Hz
 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Obtiene el color de una nota según su altura
 */
export function getNoteColor(midi: number): string {
  const noteInOctave = midi % 12;
  const isBlackKey = [1, 3, 6, 8, 10].includes(noteInOctave);
  return isBlackKey ? '#1f2937' : '#f3f4f6';
}
