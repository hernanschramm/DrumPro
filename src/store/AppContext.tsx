// ============================================================
// DrumPro - Store de estado global (React Context + useReducer)
// Maneja persistencia en localStorage
// ============================================================

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Song, Setlist, Pattern, Theme, Language, MetronomeConfig } from '../types';

// --- Estado inicial ---
const defaultMetronomeConfig: MetronomeConfig = {
  bpm: 120,
  timeSignature: '4/4',
  customBeats: 4,
  subdivision: 'quarter',
  accents: ['strong', 'medium', 'medium', 'medium'],
  sound: 'click',
  volume: 0.8,
  flashScreen: false,
};

const initialState: AppState = {
  theme: 'dark',
  language: 'es',
  songs: [],
  setlists: [],
  patterns: [],
  practiceTime: {},
};

// --- Acciones ---
type Action =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'ADD_SONG'; payload: Song }
  | { type: 'UPDATE_SONG'; payload: Song }
  | { type: 'DELETE_SONG'; payload: string }
  | { type: 'ADD_SETLIST'; payload: Setlist }
  | { type: 'UPDATE_SETLIST'; payload: Setlist }
  | { type: 'DELETE_SETLIST'; payload: string }
  | { type: 'ADD_PATTERN'; payload: Pattern }
  | { type: 'UPDATE_PATTERN'; payload: Pattern }
  | { type: 'DELETE_PATTERN'; payload: string }
  | { type: 'ADD_PRACTICE_TIME'; payload: { date: string; seconds: number } }
  | { type: 'IMPORT_DATA'; payload: AppState }
  | { type: 'LOAD_STATE'; payload: AppState };

// --- Reducer ---
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'ADD_SONG':
      return { ...state, songs: [...state.songs, action.payload] };
    case 'UPDATE_SONG':
      return { ...state, songs: state.songs.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SONG':
      return { ...state, songs: state.songs.filter(s => s.id !== action.payload) };
    case 'ADD_SETLIST':
      return { ...state, setlists: [...state.setlists, action.payload] };
    case 'UPDATE_SETLIST':
      return { ...state, setlists: state.setlists.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SETLIST':
      return { ...state, setlists: state.setlists.filter(s => s.id !== action.payload) };
    case 'ADD_PATTERN':
      return { ...state, patterns: [...state.patterns, action.payload] };
    case 'UPDATE_PATTERN':
      return { ...state, patterns: state.patterns.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PATTERN':
      return { ...state, patterns: state.patterns.filter(p => p.id !== action.payload) };
    case 'ADD_PRACTICE_TIME': {
      const { date, seconds } = action.payload;
      const current = state.practiceTime[date] || 0;
      return { ...state, practiceTime: { ...state.practiceTime, [date]: current + seconds } };
    }
    case 'IMPORT_DATA':
      return action.payload;
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// --- Contexto ---
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType>({ state: initialState, dispatch: () => {} });

// --- Provider ---
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('drumpro_state');
      if (saved) {
        return { ...init, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error cargando estado:', e);
    }
    return init;
  });

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('drumpro_state', JSON.stringify(state));
    } catch (e) {
      console.error('Error guardando estado:', e);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// --- Hook personalizado ---
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState debe usarse dentro de AppProvider');
  }
  return context;
}

export { defaultMetronomeConfig };
