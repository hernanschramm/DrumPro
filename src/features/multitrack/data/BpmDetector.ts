// ============================================================
// DrumPro Academy - Detector de BPM
// Fase 8: Servidor de Audio
// Simula la detección de BPM (en producción usaría librosa en servidor)
// ============================================================

export interface BpmDetectionResult {
  bpm: number;
  confidence: number; // 0-1
  tempoMap: Array<{
    time: number; // segundos
    bpm: number;
  }>;
  processingTime: number; // ms
}

export class BpmDetector {
  /**
   * Detecta el BPM de un archivo de audio
   * En producción: enviaría el archivo al servidor Python con librosa
   */
  async detectBpm(audioUrl: string): Promise<BpmDetectionResult> {
    // Simular tiempo de procesamiento
    await this.simulateProcessing(2000);

    // Simular detección de BPM
    // En producción: POST /api/detect-bpm con el archivo de audio
    const bpm = this.generateRealisticBpm();
    const confidence = 0.7 + Math.random() * 0.3; // 0.7-1.0
    
    // Generar mapa de tempo (simulando variaciones)
    const tempoMap = this.generateTempoMap(bpm, 180); // 3 minutos

    return {
      bpm,
      confidence,
      tempoMap,
      processingTime: 2000 + Math.random() * 1000,
    };
  }

  /**
   * Genera un BPM realista para simulación
   */
  private generateRealisticBpm(): number {
    // Distribución realista de BPMs en música popular
    const ranges = [
      { min: 60, max: 80, weight: 0.1 },   // Lento
      { min: 80, max: 100, weight: 0.2 },  // Moderado
      { min: 100, max: 130, weight: 0.4 }, // Pop/Rock común
      { min: 130, max: 160, weight: 0.2 }, // Rápido
      { min: 160, max: 200, weight: 0.1 }, // Muy rápido
    ];

    const random = Math.random();
    let cumulative = 0;

    for (const range of ranges) {
      cumulative += range.weight;
      if (random <= cumulative) {
        return Math.round(range.min + Math.random() * (range.max - range.min));
      }
    }

    return 120; // Fallback
  }

  /**
   * Genera un mapa de tempo con variaciones realistas
   */
  private generateTempoMap(baseBpm: number, durationSeconds: number): Array<{ time: number; bpm: number }> {
    const tempoMap: Array<{ time: number; bpm: number }> = [];
    const interval = 10; // Cada 10 segundos

    for (let time = 0; time < durationSeconds; time += interval) {
      // Variación sutil del BPM (±3%)
      const variation = (Math.random() - 0.5) * 0.06;
      const bpm = Math.round(baseBpm * (1 + variation));
      tempoMap.push({ time, bpm });
    }

    return tempoMap;
  }

  /**
   * Simula el tiempo de procesamiento
   */
  private simulateProcessing(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Genera un click track sincronizado con el BPM detectado
 */
export function generateClickTrack(bpm: number, durationSeconds: number): AudioBuffer | null {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * durationSeconds;
  const buffer = audioContext.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  const secondsPerBeat = 60 / bpm;
  const samplesPerBeat = Math.floor(secondsPerBeat * sampleRate);

  // Generar clicks en cada pulso
  for (let i = 0; i < length; i += samplesPerBeat) {
    const isDownbeat = (i / samplesPerBeat) % 4 === 0;
    const clickDuration = Math.floor(0.01 * sampleRate); // 10ms
    
    for (let j = 0; j < clickDuration && i + j < length; j++) {
      const t = j / sampleRate;
      const frequency = isDownbeat ? 1500 : 1000;
      const envelope = Math.exp(-t * 100); // Envelope rápido
      data[i + j] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }
  }

  audioContext.close();
  return buffer;
}
