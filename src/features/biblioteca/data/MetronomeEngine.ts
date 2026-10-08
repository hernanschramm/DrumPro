// ============================================================
// DrumPro Academy - Motor de Audio del Metrónomo
// Fase 6: Biblioteca y Metrónomo
// Usa Web Audio API para baja latencia (<10ms)
// ============================================================

export class MetronomeEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private bpm = 120;
  private nextNoteTime = 0;
  private currentBeat = 0;
  private timerID: number | null = null;
  private lookahead = 25; // ms
  private scheduleAheadTime = 0.1; // seconds
  private beatsPerMeasure = 4;
  private subdivision = 1; // 1 = negras, 2 = corcheas, 3 = tresillos, 4 = semicorcheas
  
  // Callbacks
  private onBeatCallback: ((beat: number, isAccent: boolean) => void) | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Configura el metrónomo
   */
  configure(config: {
    bpm?: number;
    beatsPerMeasure?: number;
    subdivision?: number;
  }) {
    if (config.bpm !== undefined) this.bpm = config.bpm;
    if (config.beatsPerMeasure !== undefined) this.beatsPerMeasure = config.beatsPerMeasure;
    if (config.subdivision !== undefined) this.subdivision = config.subdivision;
  }

  /**
   * Registra callback para cada pulso
   */
  onBeat(callback: (beat: number, isAccent: boolean) => void) {
    this.onBeatCallback = callback;
  }

  /**
   * Inicia el metrónomo
   */
  start() {
    if (this.isPlaying) return;
    
    this.initAudioContext();
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioContext!.currentTime;
    this.scheduler();
  }

  /**
   * Detiene el metrónomo
   */
  stop() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.currentBeat = 0;
  }

  /**
   * Scheduler de alta precisión
   * Usa lookahead para mantener timing preciso
   */
  private scheduler() {
    if (!this.isPlaying || !this.audioContext) return;

    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextNote();
    }

    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  /**
   * Avanza al siguiente pulso
   */
  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    const subdivisionDuration = secondsPerBeat / this.subdivision;
    this.nextNoteTime += subdivisionDuration;
    this.currentBeat = (this.currentBeat + 1) % (this.beatsPerMeasure * this.subdivision);
  }

  /**
   * Programa una nota en el tiempo dado
   */
  private scheduleNote(beat: number, time: number) {
    if (!this.audioContext) return;

    const isMainBeat = beat % this.subdivision === 0;
    const mainBeatNumber = Math.floor(beat / this.subdivision);
    const isAccent = mainBeatNumber === 0; // Primer pulso del compás

    // Solo reproducir sonido en subdivisiones principales
    if (isMainBeat) {
      this.playClick(time, isAccent);
    }

    // Callback visual en cada subdivisión
    if (this.onBeatCallback) {
      this.onBeatCallback(beat, isAccent);
    }
  }

  /**
   * Reproduce el sonido del click
   */
  private playClick(time: number, isAccent: boolean) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Frecuencia diferente para acento
    oscillator.frequency.value = isAccent ? 1500 : 1000;
    oscillator.type = 'sine';

    // Envelope rápido para click preciso
    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    oscillator.start(time);
    oscillator.stop(time + 0.05);
  }

  /**
   * Obtiene el estado actual
   */
  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentBeat() {
    return this.currentBeat;
  }

  /**
   * Limpieza
   */
  destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
