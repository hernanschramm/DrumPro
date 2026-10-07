// ============================================================
// DrumPro - Motor de audio del secuenciador de patrones
// Genera sonidos de batería sintéticos con Web Audio API
// ============================================================

import { PatternStep } from '../types';

/**
 * Motor de audio para el secuenciador de 16 pasos
 * Genera sonidos de batería sintéticos (kick, snare, hihat, etc.)
 */
export class SequencerEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private currentStep = 0;
  private timerID: number | null = null;
  private nextStepTime = 0;
  private bpm = 120;
  private steps: PatternStep[] = [];
  private volume = 0.8;
  
  private onStepCallback: ((step: number) => void) | null = null;
  
  private readonly scheduleAheadTime = 0.1;
  private readonly lookahead = 25;

  init(): void {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  onStep(cb: (step: number) => void): void {
    this.onStepCallback = cb;
  }

  configure(bpm: number, steps: PatternStep[], volume: number): void {
    this.bpm = bpm;
    this.steps = steps;
    this.volume = volume;
  }

  start(): void {
    if (this.isPlaying) return;
    this.init();
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextStepTime = this.audioCtx!.currentTime;
    this.scheduler();
  }

  stop(): void {
    this.isPlaying = false;
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.currentStep = 0;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduler(): void {
    if (!this.isPlaying || !this.audioCtx) return;

    while (this.nextStepTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.advance();
    }

    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  private advance(): void {
    const secondsPerStep = 60.0 / this.bpm / 4; // 16 pasos por compás
    this.nextStepTime += secondsPerStep;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  private scheduleStep(step: number, time: number): void {
    if (this.onStepCallback) {
      this.onStepCallback(step);
    }

    if (!this.audioCtx || step >= this.steps.length) return;
    const s = this.steps[step];

    if (s.kick) this.playKick(time);
    if (s.snare) this.playSnare(time);
    if (s.hihatClosed) this.playHihatClosed(time);
    if (s.hihatOpen) this.playHihatOpen(time);
    if (s.tom) this.playTom(time);
    if (s.cymbal) this.playCymbal(time);
  }

  // --- Sonidos de batería sintéticos ---

  private playKick(time: number): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    
    osc.start(time);
    osc.stop(time + 0.3);
  }

  private playSnare(time: number): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;

    // Cuerpo tonal
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.frequency.value = 200;
    osc.type = 'triangle';
    oscGain.gain.setValueAtTime(this.volume * 0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.start(time);
    osc.stop(time + 0.1);

    // Ruido (bordonera)
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 3000;
    const noiseGain = ctx.createGain();
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(this.volume * 0.6, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    noise.start(time);
    noise.stop(time + 0.15);
  }

  private playHihatClosed(time: number): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 9000;
    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(this.volume * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    noise.start(time);
    noise.stop(time + 0.05);
  }

  private playHihatOpen(time: number): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(this.volume * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    noise.start(time);
    noise.stop(time + 0.2);
  }

  private playTom(time: number): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.15);
    osc.type = 'sine';
    gain.gain.setValueAtTime(this.volume * 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private playCymbal(time: number): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 10000;
    filter.Q.value = 1;
    const gain = ctx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(this.volume * 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    noise.start(time);
    noise.stop(time + 0.4);
  }

  destroy(): void {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
