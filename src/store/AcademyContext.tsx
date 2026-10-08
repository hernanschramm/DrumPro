// ============================================================
// DrumPro Academy - Contexto global con datos de ejemplo
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
    fechaInicio: '2024-12-20T15:00:00Z',
    fechaFin: '2024-12-20T16:00:00Z',
    estado: 'programada',
    videollamadaUrl: 'https://meet.jit.si/DrumPro-Juan-201224',
    materiales: [],
    createdAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 'clase-2',
    profesorId: 'prof-1',
    alumnoId: 'alumno-2',
    titulo: 'Introducción al ritmo básico',
    descripcion: 'Primeros grooves de rock',
    fechaInicio: '2024-12-21T14:00:00Z',
    fechaFin: '2024-12-21T15:00:00Z',
    estado: 'programada',
    videollamadaUrl: 'https://meet.jit.si/DrumPro-Ana-211224',
    materiales: [],
    createdAt: '2024-12-16T00:00:00Z',
  },
];

const seedTareas: Tarea[] = [
  {
    id: 'tarea-1',
    profesorId: 'prof-1',
    titulo: 'Práctica de Single Stroke Roll',
    consigna: 'Practicar single stroke roll durante 15 minutos diarios durante una semana. Grabar video mostrando la técnica a 80, 100 y 120 BPM.',
    materialUrls: [],
    fechaLimite: '2024-12-25T23:59:59Z',
    puntajeMaximo: 100,
    createdAt: '2024-12-10T00:00:00Z',
  },
  {
    id: 'tarea-2',
    profesorId: 'prof-1',
    titulo: 'Groove de rock básico',
    consigna: 'Aprender el groove de rock básico (bombo en 1 y 3, caja en 2 y 4, hi-hat en corcheas). Grabar video tocando durante 1 minuto sin parar.',
    materialUrls: [],
    fechaLimite: '2024-12-28T23:59:59Z',
    puntajeMaximo: 100,
    createdAt: '2024-12-12T00:00:00Z',
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
  {
    id: 'asig-2',
    tareaId: 'tarea-2',
    alumnoId: 'alumno-1',
    estado: 'pendiente',
    correccionMediaUrls: [],
    createdAt: '2024-12-12T00:00:00Z',
  },
  {
    id: 'asig-3',
    tareaId: 'tarea-2',
    alumnoId: 'alumno-2',
    estado: 'pendiente',
    correccionMediaUrls: [],
    createdAt: '2024-12-12T00:00:00Z',
  },
];

const seedRudimentos: Rudimento[] = [
  {
    id: 'rud-1',
    nombre: 'Single Stroke Roll',
    categoria: 'Rolls',
    descripcion: 'Alternancia simple de manos: RLRL',
    bpmObjetivo: 120,
    dificultad: 'basico',
  },
  {
    id: 'rud-2',
    nombre: 'Double Stroke Roll',
    categoria: 'Rolls',
    descripcion: 'Dobles alternados: RRLL',
    bpmObjetivo: 100,
    dificultad: 'basico',
  },
  {
    id: 'rud-3',
    nombre: 'Single Paradiddle',
    categoria: 'Rolls',
    descripcion: 'RLRR LRLL',
    bpmObjetivo: 90,
    dificultad: 'basico',
  },
  {
    id: 'rud-4',
    nombre: 'Flam',
    categoria: 'Drum Solos',
    descripcion: 'Nota de gracia + nota principal',
    bpmObjetivo: 80,
    dificultad: 'basico',
  },
];

const seedGrooves: Groove[] = [
  {
    id: 'groove-1',
    nombre: 'Rock Básico',
    estilo: 'rock',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 100,
    descripcion: 'El groove de rock más básico',
  },
  {
    id: 'groove-2',
    nombre: 'Funk Básico',
    estilo: 'funk',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
      hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    },
    bpmSugerido: 90,
    descripcion: 'Groove funk con bombo sincopado',
  },
];

const seedNotificaciones: Notificacion[] = [
  {
    id: 'notif-1',
    usuarioId: 'alumno-1',
    titulo: 'Nueva tarea asignada',
    mensaje: 'Tu profesor Carlos te asignó una nueva tarea: "Práctica de Single Stroke Roll"',
    tipo: 'tarea',
    leida: false,
    createdAt: '2024-12-10T10:00:00Z',
  },
  {
    id: 'notif-2',
    usuarioId: 'alumno-1',
    titulo: 'Clase programada',
    mensaje: 'Tienes una clase programada para el 20/12 a las 15:00',
    tipo: 'clase',
    leida: false,
    createdAt: '2024-12-15T09:00:00Z',
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
  progresoRudimentos: [],
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
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AcademyState> };

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
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };
    case 'ADD_CLASE':
      return { ...state, clases: [...state.clases, action.payload] };
    case 'UPDATE_CLASE':
      return {
        ...state,
        clases: state.clases.map(c => c.id === action.payload.id ? action.payload : c),
      };
    case 'ADD_TAREA':
      return { ...state, tareas: [...state.tareas, action.payload] };
    case 'ADD_ASIGNACION':
      return { ...state, asignaciones: [...state.asignaciones, action.payload] };
    case 'UPDATE_ASIGNACION':
      return {
        ...state,
        asignaciones: state.asignaciones.map(a => a.id === action.payload.id ? action.payload : a),
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notificaciones: state.notificaciones.map(n =>
          n.id === action.payload ? { ...n, leida: true } : n
        ),
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Context
interface AcademyContextType {
  state: AcademyState;
  dispatch: React.Dispatch<AcademyAction>;
}

const AcademyContext = createContext<AcademyContextType>({
  state: initialState,
  dispatch: () => {},
});

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
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy debe usarse dentro de AcademyProvider');
  }
  return context;
}
