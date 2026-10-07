// ============================================================
// DrumPro - Tipos principales de la aplicación
// ============================================================

/** Compases disponibles */
export type TimeSignature = '2/4' | '3/4' | '4/4' | '5/4' | '6/8' | '7/8' | '9/8' | '12/8' | 'custom';

/** Subdivisiones del pulso */
export type Subdivision = 'quarter' | 'eighth' | 'triplet' | 'sixteenth' | 'swing';

/** Nivel de acento para cada pulso */
export type AccentLevel = 'strong' | 'medium' | 'soft' | 'mute';

/** Sonidos disponibles para el metrónomo */
export type MetronomeSound = 'click' | 'cowbell' | 'hihat' | 'wood';

/** Configuración del metrónomo */
export interface MetronomeConfig {
  bpm: number;
  timeSignature: TimeSignature;
  customBeats: number;
  subdivision: Subdivision;
  accents: AccentLevel[];
  sound: MetronomeSound;
  volume: number; // 0-1
  flashScreen: boolean;
}

/** Configuración del entrenador de práctica */
export interface PracticeConfig {
  muteBarsEnabled: boolean;
  playBars: number;   // N compases suenan
  restBars: number;   // M compases silenciosos
  gradualEnabled: boolean;
  startBpm: number;
  incrementBpm: number;
  everyBars: number;
  targetBpm: number;
}

/** Estructura de una sección de canción */
export interface SongSection {
  name: string; // Intro, Estrofa, Estribillo, Puente, etc.
  bars: number;
}

/** Canción en la biblioteca */
export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  timeSignature: TimeSignature;
  duration: string; // "3:45"
  notes: string;
  sections: SongSection[];
  metronomeConfig: MetronomeConfig;
}

/** Setlist para shows */
export interface Setlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

/** Patrón del secuenciador (16 pasos) */
export interface Pattern {
  id: string;
  name: string;
  songId?: string;
  bpm: number;
  steps: PatternStep[];
}

/** Paso del patrón */
export interface PatternStep {
  kick: boolean;
  snare: boolean;
  hihatClosed: boolean;
  hihatOpen: boolean;
  tom: boolean;
  cymbal: boolean;
}

/** Tema de la app */
export type Theme = 'dark' | 'light';

/** Idioma */
export type Language = 'es' | 'en';

/** Estado global de la app */
export interface AppState {
  theme: Theme;
  language: Language;
  songs: Song[];
  setlists: Setlist[];
  patterns: Pattern[];
  practiceTime: Record<string, number>; // fecha -> segundos
}
