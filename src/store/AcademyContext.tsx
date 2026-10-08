// ============================================================
// DrumPro Academy - Contexto global con datos de ejemplo
// Fase 2: Autenticación y gestión de usuarios
// ============================================================

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AcademyState, UserProfile, Clase, Tarea, TareaAsignacion, Rudimento, Groove, Notificacion } from '../types/academy';

// Datos de ejemplo (seed)
const seedUsers: UserProfile[] = [
  {
    id: 'admin-1',
    email: 'admin@drumpro.com',
    fullName: 'Administrador',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prof-1',
    email: 'carlos@drumpro.com',
    fullName: 'Carlos Rodríguez',
    role: 'profesor',
    bio: 'Baterista profesional con 15 años de experiencia. Especialista en rock y jazz.',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'prof-2',
    email: 'maria@drumpro.com',
    fullName: 'María González',
    role: 'profesor',
    bio: 'Especialista en música latina y fusión. 10 años enseñando.',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'alumno-1',
    email: 'juan@drumpro.com',
    fullName: 'Juan Pérez',
    role: 'alumno',
    profesorId: 'prof-1',
    bio: 'Estudiante intermedio. 1 año practicando.',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'alumno-2',
    email: 'ana@drumpro.com',
    fullName: 'Ana Martínez',
    role: 'alumno',
    profesorId: 'prof-1',
    bio: 'Principiante. Empecé hace 3 meses.',
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'alumno-3',
    email: 'pedro@drumpro.com',
    fullName: 'Pedro Sánchez',
    role: 'alumno',
    profesorId: 'prof-2',
    bio: 'Nivel avanzado. Toco en una banda.',
    isActive: true,
    createdAt: '2024-03-10T00:00:00Z',
  },
];

const seedClases: Clase[] = [
  {
    id: 'clase-1',
    profesorId: 'prof-1',
    alumnoId: 'alumno-1',
    titulo: 'Técnica de redobles',
    descripcion: 'Trabajaremos paradiddles y sus variaciones',
    fechaInicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 días
    fechaFin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    estado: 'programada',
    videollamadaUrl: 'https://meet.jit.si/DrumPro-Juan-Paradiddles',
    materiales: ['https://example.com/paradiddles.pdf'],
    createdAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'clase-2',
    profesorId: 'prof-1',
    alumnoId: 'alumno-2',
    titulo: 'Introducción al ritmo básico',
    descripcion: 'Primeros grooves de rock y coordinación básica',
    fechaInicio: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // En 3 días
    fechaFin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    estado: 'programada',
    videollamadaUrl: 'https://meet.jit.si/DrumPro-Ana-Basico',
    materiales: [],
    createdAt: '2024-12-16T00:00:00Z',
  },
  {
    id: 'clase-3',
    profesorId: 'prof-2',
    alumnoId: 'alumno-3',
    titulo: 'Grooves latinos',
    descripcion: 'Ritmos de salsa y bossa nova',
    fechaInicio: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // En 5 días
    fechaFin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    estado: 'programada',
    videollamadaUrl: 'https://meet.jit.si/DrumPro-Pedro-Latino',
    materiales: ['https://example.com/salsa-patterns.pdf', 'https://example.com/bossa.mp3'],
    createdAt: '2024-12-17T00:00:00Z',
  },
  {
    id: 'clase-4',
    profesorId: 'prof-1',
    alumnoId: 'alumno-1',
    titulo: 'Repaso de técnica',
    descripcion: 'Clase de seguimiento',
    fechaInicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
    fechaFin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    estado: 'finalizada',
    videollamadaUrl: 'https://meet.jit.si/DrumPro-Juan-Repaso',
    materiales: [],
    createdAt: '2024-12-10T00:00:00Z',
  },
];

const seedTareas: Tarea[] = [
  {
    id: 'tarea-1',
    profesorId: 'prof-1',
    titulo: 'Práctica de Single Stroke Roll',
    consigna: 'Practicar single stroke roll durante 15 minutos diarios. Grabar video a 80, 100 y 120 BPM.',
    materialUrls: [],
    fechaLimite: '2024-12-25T23:59:59Z',
    puntajeMaximo: 100,
    createdAt: '2024-12-10T00:00:00Z',
  },
];

const seedAsignaciones: TareaAsignacion[] = [
  {
    id: 'asig-1',
    tareaId: 'tarea-1',
    alumnoId: 'alumno-1',
    estado: 'pendiente',
    correccionMediaUrls: [],
    createdAt: '2024-12-10T00:00:00Z',
  },
];

const seedRudimentos: Rudimento[] = [
  { id: 'rud-1', nombre: 'Single Stroke Roll', categoria: 'Rolls', descripcion: 'RLRL', bpmObjetivo: 120, dificultad: 'basico' },
  { id: 'rud-2', nombre: 'Double Stroke Roll', categoria: 'Rolls', descripcion: 'RRLL', bpmObjetivo: 100, dificultad: 'basico' },
  { id: 'rud-3', nombre: 'Single Paradiddle', categoria: 'Rolls', descripcion: 'RLRR LRLL', bpmObjetivo: 90, dificultad: 'basico' },
  { id: 'rud-4', nombre: 'Flam', categoria: 'Drum Solos', descripcion: 'Nota de gracia + principal', bpmObjetivo: 80, dificultad: 'basico' },
];

const seedGrooves: Groove[] = [
  {
    id: 'groove-1', nombre: 'Rock Básico', estilo: 'rock', dificultad: 'basico', compas: '4/4',
    patron: { kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0] },
    bpmSugerido: 100, descripcion: 'El groove de rock más básico',
  },
];

const seedNotificaciones: Notificacion[] = [
  {
    id: 'notif-1', usuarioId: 'alumno-1', titulo: 'Nueva tarea', mensaje: 'Tu profesor Carlos te asignó una nueva tarea',
    tipo: 'tarea', leida: false, createdAt: '2024-12-10T10:00:00Z',
  },
];

// Estado inicial
const initialState: AcademyState = {
  currentUser: null,
  users: seedUsers,
  clases: seedClases,
  tareas: seedTareas,
  asignaciones: seedAsignaciones,
  entregas: [],
  evaluaciones: [],
  sesionesPractica: [],
  rudimentos: seedRudimentos,
  grooves: seedGrooves,
  notificaciones: seedNotificaciones,
};

// Acciones
type AcademyAction =
  | { type: 'LOGIN'; payload: UserProfile }
  | { type: 'LOGOUT' }
  | { type: 'ADD_USER'; payload: UserProfile }
  | { type: 'UPDATE_USER'; payload: UserProfile }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_CLASE'; payload: Clase }
  | { type: 'UPDATE_CLASE'; payload: Clase }
  | { type: 'ADD_TAREA'; payload: Tarea }
  | { type: 'ADD_ASIGNACION'; payload: TareaAsignacion }
  | { type: 'UPDATE_ASIGNACION'; payload: TareaAsignacion }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

// Reducer
function academyReducer(state: AcademyState, action: AcademyAction): AcademyState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };
    case 'ADD_CLASE':
      return { ...state, clases: [...state.clases, action.payload] };
    case 'UPDATE_CLASE':
      return { ...state, clases: state.clases.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'ADD_TAREA':
      return { ...state, tareas: [...state.tareas, action.payload] };
    case 'ADD_ASIGNACION':
      return { ...state, asignaciones: [...state.asignaciones, action.payload] };
    case 'UPDATE_ASIGNACION':
      return { ...state, asignaciones: state.asignaciones.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notificaciones: state.notificaciones.map(n => n.id === action.payload ? { ...n, leida: true } : n) };
    default:
      return state;
  }
}

// Context
interface AcademyContextType {
  state: AcademyState;
  dispatch: React.Dispatch<AcademyAction>;
}

const AcademyContext = createContext<AcademyContextType>({ state: initialState, dispatch: () => {} });

// Provider
export function AcademyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(academyReducer, initialState);
  return (
    <AcademyContext.Provider value={{ state, dispatch }}>
      {children}
    </AcademyContext.Provider>
  );
}

// Hook
export function useAcademy() {
  return useContext(AcademyContext);
}
