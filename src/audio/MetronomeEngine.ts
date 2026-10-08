// ============================================================
// DrumPro - Motor de audio del metrónomo
// Usa Web Audio API con scheduling preciso para baja latencia
// ============================================================

import { AccentLevel, MetronomeSound, Subdivision, TimeSignature } from '../types';

/**
 * Motor de audio que genera los clicks del metrónomo
 * con timing preciso usando AudioContext scheduling
 */
export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private nextNoteTime = 0;
  private currentBeat = 0;
  private timerID: number | null = null;
  private startTime = 0;
  
  // Callbacks
  private onBeatCallback: ((beat: number, accent: AccentLevel, subdivision: number) => void) | null = null;
  private onFlashCallback: (() => void) | null = null;

  // Configuración
  private bpm = 120;
  private beatsPerMeasure = 4;
  private subdivision: Subdivision = 'quarter';
  private accents: AccentLevel[] = ['strong', 'medium', 'medium', 'medium'];
  private sound: MetronomeSound = 'click';
  private volume = 0.8;

  // Precisión de scheduling (ms)
  private readonly scheduleAheadTime = 0.1;
  private readonly lookahead = 25;

  /** Inicializa el AudioContext (debe llamarse tras interacción del usuario) */
  init(): void {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /** Configura el callback de pulso visual */
  onBeat(cb: (beat: number, accent: AccentLevel, subdivision: number) => void): void {
    this.onBeatCallback = cb;
  }

  /** Configura el callback de flash de pantalla */
  onFlash(cb: () => void): void {
    this.onFlashCallback = cb;
  }

  /** Actualiza la configuración del metrónomo */
  configure(config: {
    bpm?: number;
    timeSignature?: TimeSignature;
    customBeats?: number;
    subdivision?: Subdivision;
    accents?: AccentLevel[];
    sound?: MetronomeSound;
    volume?: number;
  }): void {
    if (config.bpm !== undefined) this.bpm = config.bpm;
    if (config.timeSignature !== undefined) {
      this.beatsPerMeasure = this.getTimeSignatureBeats(config.timeSignature, config.customBeats);
    }
    if (config.customBeats !== undefined && config.timeSignature === 'custom') {
      this.beatsPerMeasure = config.customBeats;
    }
    if (config.subdivision !== undefined) this.subdivision = config.subdivision;
    if (config.accents !== undefined) this.accents = config.accents;
    if (config.sound !== undefined) this.sound = config.sound;
    if (config.volume !== undefined) this.volume = config.volume;
  }

  /** Obtiene el número de pulsos según el compás */
  private getTimeSignatureBeats(ts: TimeSignature, custom?: number): number {
    const map: Record<string, number> = {
      '2/4': 2, '3/4': 3, '4/4': 4, '5/4': 5,
      '6/8': 6, '7/8': 7, '9/8': 9, '12/8': 12
    };
    if (ts === 'custom') return custom || 4;
    return map[ts] || 4;
  }

  /** Inicia la reproducción */
  start(): void {
    if (this.isPlaying) return;
    this.init();
    this.isPlaying = true;
    this.currentBeat = 0;
    this.startTime = this.audioCtx!.currentTime;
    this.nextNoteTime = this.audioCtx!.currentTime;
    this.scheduler();
  }

  /** Detiene la reproducción */
  stop(): void {
    this.isPlaying = false;
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.currentBeat = 0;
  }

  /** ¿Está reproduciendo? */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /** Pulso actual */
  getCurrentBeat(): number {
    return this.currentBeat;
  }

  /**
   * Scheduler principal - usa lookahead para precisión
   * Este patrón es el estándar para metrónomos web precisos
   */
  private scheduler(): void {
    if (!this.isPlaying || !this.audioCtx) return;

    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.advanceNote();
    }

    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  /** Avanza al siguiente pulso */
  private advanceNote(): void {
    const subdivisionsPerBeat = this.getSubdivisionsPerBeat();
    const secondsPerBeat = 60.0 / this.bpm;
    const secondsPerSubdivision = secondsPerBeat / subdivisionsPerBeat;
    
    this.nextNoteTime += secondsPerSubdivision;
    this.currentBeat = (this.currentBeat + 1) % (this.beatsPerMeasure * subdivisionsPerBeat);
  }

  /** Obtiene las subdivisiones por pulso */
  private getSubdivisionsPerBeat(): number {
    switch (this.subdivision) {
      case 'quarter': return 1;
      case 'eighth': return 2;
      case 'triplet': return 3;
      case 'sixteenth': return 4;
      case 'swing': return 2; // swing usa corcheas con timing modificado
      default: return 1;
    }
  }

  /** Programa un sonido en el tiempo dado */
  private scheduleNote(beat: number, time: number): void {
    if (!this.audioCtx) return;

    const subdivisionsPerBeat = this.getSubdivisionsPerBeat();
    const mainBeat = Math.floor(beat / subdivisionsPerBeat);
    const subBeat = beat % subdivisionsPerBeat;
    
    // Determinar el acento
    const accent = this.accents[mainBeat % this.accents.length] || 'medium';
    
    // Si es silencio, no reproducir
    if (accent === 'mute') {
      this.triggerVisualBeat(mainBeat, accent, subBeat);
      return;
    }

    // Solo reproducir sonido en subdivisiones principales o todas según config
    const shouldPlay = subBeat === 0 || this.subdivision !== 'quarter';
    
    if (shouldPlay) {
      const isMainBeat = subBeat === 0;
      const effectiveAccent = isMainBeat ? accent : 'soft';
      this.playSound(time, effectiveAccent, isMainBeat);
    }

    // Callback visual en el pulso principal
    if (subBeat === 0) {
      this.triggerVisualBeat(mainBeat, accent, subBeat);
    }
  }

  /** Dispara los callbacks visuales */
  private triggerVisualBeat(beat: number, accent: AccentLevel, subBeat: number): void {
    if (this.onBeatCallback) {
      this.onBeatCallback(beat, accent, subBeat);
    }
    if (accent === 'strong' && subBeat === 0 && this.onFlashCallback) {
      this.onFlashCallback();
    }
  }

  /** Genera y reproduce el sonido del click */
  private playSound(time: number, accent: AccentLevel, isMainBeat: boolean): void {
    if (!this.audioCtx) return;

    const volumeMultiplier = this.getAccentVolume(accent);
    const finalVolume = this.volume * volumeMultiplier;

    switch (this.sound) {
      case 'click':
        this.playClick(time, finalVolume, isMainBeat);
        break;
      case 'cowbell':
        this.playCowbell(time, finalVolume, isMainBeat);
        break;
      case 'hihat':
        this.playHihat(time, finalVolume, isMainBeat);
        break;
      case 'wood':
        this.playWood(time, finalVolume, isMainBeat);
        break;
    }
  }

  /** Obtiene el multiplicador de volumen según el acento */
  private getAccentVolume(accent: AccentLevel): number {
    switch (accent) {
      case 'strong': return 1.0;
      case 'medium': return 0.7;
      case 'soft': return 0.4;
      case 'mute': return 0;
    }
  }

  /** Sonido de click (tono sinusoidal corto) */
  private playClick(time: number, volume: number, isAccent: boolean): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = isAccent ? 1500 : 1000;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    
    osc.start(time);
    osc.stop(time + 0.03);
  }

  /** Sonido de cowbell (dos osciladores cuadrados) */
  private playCowbell(time: number, volume: number, isAccent: boolean): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);
    
    const baseFreq = isAccent ? 800 : 600;
    osc1.frequency.value = baseFreq;
    osc2.frequency.value = baseFreq * 1.5;
    osc1.type = 'square';
    osc2.type = 'square';
    
    filter.type = 'bandpass';
    filter.frequency.value = baseFreq;
    filter.Q.value = 5;
    
    gain.gain.setValueAtTime(volume * 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.08);
    osc2.stop(time + 0.08);
  }

  /** Sonido de hi-hat (ruido filtrado) */
  private playHihat(time: number, volume: number, isAccent: boolean): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = isAccent ? 8000 : 6000;
    
    const gain = ctx.createGain();
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(volume * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    
    noise.start(time);
    noise.stop(time + 0.05);
  }

  /** Sonido de madera (tono con ruido) */
  private playWood(time: number, volume: number, isAccent: boolean): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = isAccent ? 400 : 300;
    osc.type = 'triangle';
    
    filter.type = 'bandpass';
    filter.frequency.value = isAccent ? 2000 : 1500;
    filter.Q.value = 10;
    
    gain.gain.setValueAtTime(volume * 0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
    
    osc.start(time);
    osc.stop(time + 0.025);
  }

  /** Limpieza */
  destroy(): void {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
