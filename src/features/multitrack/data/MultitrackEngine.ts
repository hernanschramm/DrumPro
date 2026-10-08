// ============================================================
// DrumPro Academy - Motor de Audio Multitrack
// Fase 8: Servidor de Audio
// Reproduce múltiples stems sincronizados con control de volumen/mute
// ============================================================

export interface StemTrack {
  id: string;
  name: string;
  url: string;
  color: string;
  volume: number; // 0-1
  muted: boolean;
  solo: boolean;
  audioBuffer?: AudioBuffer;
  sourceNode?: AudioBufferSourceNode;
  gainNode?: GainNode;
}

export interface LoopRegion {
  start: number; // segundos
  end: number; // segundos
  enabled: boolean;
}

export class MultitrackEngine {
  private audioContext: AudioContext | null = null;
  private tracks: StemTrack[] = [];
  private isPlaying = false;
  private startTime = 0;
  private pauseTime = 0;
  private playbackRate = 1.0;
  private loopRegion: LoopRegion = { start: 0, end: 0, enabled: false };
  private masterGain: GainNode | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private animationFrameId: number | null = null;
  private duration = 0;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
    }
  }

  /**
   * Carga un stem desde una URL
   * En producción: descarga desde Supabase Storage
   */
  async loadStem(track: Omit<StemTrack, 'audioBuffer' | 'sourceNode' | 'gainNode'>): Promise<void> {
    this.initAudioContext();
    if (!this.audioContext) return;

    // En producción: fetch real del archivo
    // const response = await fetch(track.url);
    // const arrayBuffer = await response.arrayBuffer();
    // const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    // Simulación: crear un buffer de audio sintético
    const audioBuffer = this.createSyntheticBuffer(track.name);
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = track.muted ? 0 : track.volume;
    gainNode.connect(this.masterGain!);

    const stemTrack: StemTrack = {
      ...track,
      audioBuffer,
      gainNode,
    };

    // Reemplazar si ya existe
    const existingIndex = this.tracks.findIndex(t => t.id === track.id);
    if (existingIndex >= 0) {
      this.tracks[existingIndex] = stemTrack;
    } else {
      this.tracks.push(stemTrack);
    }

    // Actualizar duración
    if (audioBuffer.duration > this.duration) {
      this.duration = audioBuffer.duration;
      this.loopRegion.end = audioBuffer.duration;
    }
  }

  /**
   * Crea un buffer de audio sintético para simulación
   * En producción: se usaría audio real descargado
   */
  private createSyntheticBuffer(name: string): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext no inicializado');

    const sampleRate = this.audioContext.sampleRate;
    const duration = 30; // 30 segundos de audio simulado
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    // Generar audio diferente según el tipo de stem
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        let sample = 0;

        switch (name.toLowerCase()) {
          case 'batería':
          case 'drums':
            // Simular bombo y caja
            const beatTime = t % 0.5; // 120 BPM
            if (beatTime < 0.01) sample = Math.random() * 0.5;
            if (Math.abs(beatTime - 0.25) < 0.01) sample = Math.random() * 0.3;
            break;
          case 'bajo':
          case 'bass':
            // Simular bajo
            sample = Math.sin(2 * Math.PI * 110 * t) * 0.3;
            sample += Math.sin(2 * Math.PI * 55 * t) * 0.2;
            break;
          case 'guitarra':
          case 'guitar':
            // Simular guitarra
            sample = Math.sin(2 * Math.PI * 220 * t) * 0.2;
            sample += Math.sin(2 * Math.PI * 330 * t) * 0.15;
            sample += Math.sin(2 * Math.PI * 440 * t) * 0.1;
            break;
          case 'voz':
          case 'vocals':
            // Simular voz
            sample = Math.sin(2 * Math.PI * 440 * t) * 0.2;
            sample *= (Math.sin(2 * Math.PI * 3 * t) + 1) / 2; // Modulación
            break;
          default:
            // Ruido suave
            sample = Math.random() * 0.1;
        }

        data[i] = sample;
      }
    }

    return buffer;
  }

  /**
   * Inicia la reproducción de todos los stems sincronizados
   */
  play(): void {
    if (this.isPlaying || this.tracks.length === 0) return;
    this.initAudioContext();
    if (!this.audioContext) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    this.startTime = this.audioContext!.currentTime - this.pauseTime;

    this.tracks.forEach(track => {
      if (!track.audioBuffer || !track.gainNode || !this.audioContext) return;

      const source = this.audioContext.createBufferSource();
      source.buffer = track.audioBuffer;
      source.playbackRate.value = this.playbackRate;
      source.connect(track.gainNode);

      const offset = this.pauseTime * this.playbackRate;
      source.start(0, offset % track.audioBuffer.duration);

      track.sourceNode = source;

      // Loop handling
      if (this.loopRegion.enabled) {
        source.loop = true;
        source.loopStart = this.loopRegion.start;
        source.loopEnd = this.loopRegion.end;
      }
    });

    this.startTimeUpdate();
  }

  /**
   * Pausa la reproducción
   */
  pause(): void {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.pauseTime = (this.audioContext!.currentTime - this.startTime) * this.playbackRate;

    this.tracks.forEach(track => {
      if (track.sourceNode) {
        try {
          track.sourceNode.stop();
        } catch (e) {
          // Ignorar errores al detener
        }
        track.sourceNode = undefined;
      }
    });

    this.stopTimeUpdate();
  }

  /**
   * Detiene y reinicia la reproducción
   */
  stop(): void {
    this.pause();
    this.pauseTime = 0;
  }

  /**
   * Actualiza el volumen de una pista
   */
  setTrackVolume(trackId: string, volume: number): void {
    const track = this.tracks.find(t => t.id === trackId);
    if (track?.gainNode) {
      track.volume = volume;
      track.gainNode.gain.value = track.muted ? 0 : volume;
    }
  }

  /**
   * Mutea/desmutea una pista
   */
  toggleMute(trackId: string): void {
    const track = this.tracks.find(t => t.id === trackId);
    if (track?.gainNode) {
      track.muted = !track.muted;
      track.gainNode.gain.value = track.muted ? 0 : track.volume;
    }
  }

  /**
   * Solo: silencia todas las demás pistas
   */
  toggleSolo(trackId: string): void {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;

    track.solo = !track.solo;

    if (track.solo) {
      // Silenciar todas las demás
      this.tracks.forEach(t => {
        if (t.id !== trackId && t.gainNode) {
          t.gainNode.gain.value = 0;
        }
      });
      if (track.gainNode) {
        track.gainNode.gain.value = track.volume;
      }
    } else {
      // Restaurar volúmenes
      this.tracks.forEach(t => {
        if (t.gainNode) {
          t.gainNode.gain.value = t.muted ? 0 : t.volume;
        }
      });
    }
  }

  /**
   * Cambia la velocidad de reproducción (sin cambiar tono en producción)
   */
  setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    if (this.isPlaying) {
      // Actualizar playbackRate de todas las fuentes
      this.tracks.forEach(track => {
        if (track.sourceNode) {
          track.sourceNode.playbackRate.value = rate;
        }
      });
    }
  }

  /**
   * Configura región de loop A-B
   */
  setLoopRegion(start: number, end: number, enabled: boolean): void {
    this.loopRegion = { start, end, enabled };
    
    // Si está reproduciendo, reiniciar con loop
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  /**
   * Obtiene el tiempo actual de reproducción
   */
  getCurrentTime(): number {
    if (!this.audioContext) return 0;
    if (this.isPlaying) {
      return ((this.audioContext.currentTime - this.startTime) * this.playbackRate) % this.duration;
    }
    return this.pauseTime % this.duration;
  }

  /**
   * Obtiene la duración total
   */
  getDuration(): number {
    return this.duration;
  }

  /**
   * Obtiene las pistas
   */
  getTracks(): StemTrack[] {
    return this.tracks;
  }

  /**
   * Registra callback para actualizaciones de tiempo
   */
  onTimeUpdate(callback: (time: number) => void): void {
    this.onTimeUpdateCallback = callback;
  }

  /**
   * Inicia actualización de tiempo
   */
  private startTimeUpdate(): void {
    const update = () => {
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.getCurrentTime());
      }
      if (this.isPlaying) {
        this.animationFrameId = requestAnimationFrame(update);
      }
    };
    update();
  }

  /**
   * Detiene actualización de tiempo
   */
  private stopTimeUpdate(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Limpieza
   */
  destroy(): void {
    this.stop();
    this.tracks = [];
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
