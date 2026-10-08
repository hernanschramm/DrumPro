// ============================================================
// DrumPro Academy - Tipos del dominio de la academia
// ============================================================

/** Roles de usuario */
export type UserRole = 'admin' | 'profesor' | 'alumno';

/** Perfil de usuario */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  profesorId?: string; // Solo alumnos
  isActive: boolean;
  createdAt: string;
}

/** Estado de una clase */
export type ClassStatus = 'programada' | 'en_curso' | 'finalizada' | 'cancelada';

/** Clase */
export interface Clase {
  id: string;
  profesorId: string;
  alumnoId: string;
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  estado: ClassStatus;
  videollamadaUrl?: string;
  notasProfesor?: string;
  materiales: string[];
  createdAt: string;
}

/** Estado de una tarea */
export type TaskStatus = 'pendiente' | 'entregada' | 'en_revision' | 'aprobada' | 'con_correcciones' | 'vencida';

/** Tarea */
export interface Tarea {
  id: string;
  profesorId: string;
  titulo: string;
  consigna: string;
  materialUrls: string[];
  fechaLimite: string;
  puntajeMaximo: number;
  createdAt: string;
}

/** Asignación de tarea a alumno */
export interface TareaAsignacion {
  id: string;
  tareaId: string;
  alumnoId: string;
  estado: TaskStatus;
  fechaEntrega?: string;
  puntaje?: number;
  correccionTexto?: string;
  correccionMediaUrls: string[];
  feedback?: string;
  createdAt: string;
}

/** Entrega del alumno */
export interface Entrega {
  id: string;
  asignacionId: string;
  alumnoId: string;
  tipo: 'video' | 'audio' | 'imagen' | 'otro';
  archivoUrl: string;
  duracionSegundos?: number;
  tamanoBytes?: number;
  notaAlumno?: string;
  intento: number;
  createdAt: string;
}

/** Evaluación */
export interface Evaluacion {
  id: string;
  profesorId: string;
  alumnoId: string;
  titulo: string;
  descripcion?: string;
  fechaEvaluacion: string;
  puntajeTotal: number;
  puntajeObtenido?: number;
  observaciones?: string;
  criterios: CriterioEvaluacion[];
  createdAt: string;
}

/** Criterio de evaluación */
export interface CriterioEvaluacion {
  id: string;
  nombre: string;
  puntajeMaximo: number;
  puntajeObtenido?: number;
  comentario?: string;
}

/** Sesión de práctica */
export interface SesionPractica {
  id: string;
  alumnoId: string;
  fecha: string;
  minutos: number;
  contenido?: string;
  bpmAlcanzado?: number;
  createdAt: string;
}

/** Rudimento */
export interface Rudimento {
  id: string;
  nombre: string;
  categoria: string;
  notacion?: string;
  videoUrl?: string;
  descripcion?: string;
  bpmObjetivo?: number;
  dificultad: 'basico' | 'intermedio' | 'avanzado';
}

/** Groove */
export interface Groove {
  id: string;
  nombre: string;
  estilo: string;
  dificultad: 'basico' | 'intermedio' | 'avanzado';
  compas: string;
  patron: {
    kick: number[];
    snare: number[];
    hihat: number[];
    ride?: number[];
  };
  bpmSugerido: number;
  descripcion?: string;
  videoUrl?: string;
}

/** Progreso de rudimento del alumno */
export interface ProgresoRudimento {
  id: string;
  alumnoId: string;
  rudimentoId: string;
  dominado: boolean;
  validadoPor?: string;
  bpmActual?: number;
  notas?: string;
}

/** Notificación */
export interface Notificacion {
  id: string;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'clase' | 'tarea' | 'evaluacion';
  datos?: Record<string, any>;
  leida: boolean;
  createdAt: string;
}

/** Estado global de la academia */
export interface AcademyState {
  currentUser: UserProfile | null;
  users: UserProfile[];
  clases: Clase[];
  tareas: Tarea[];
  asignaciones: TareaAsignacion[];
  entregas: Entrega[];
  evaluaciones: Evaluacion[];
  sesionesPractica: SesionPractica[];
  rudimentos: Rudimento[];
  grooves: Groove[];
  progresoRudimentos: ProgresoRudimento[];
  notificaciones: Notificacion[];
}
