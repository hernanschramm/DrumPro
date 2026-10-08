# 🥁 DrumPro Academy - Fase 1: Modelo de Datos y Estructura

## ✅ Entregables de la Fase 1

### 1. Modelo de Datos Completo (SQL)
📄 **Archivo:** `docs/database.sql`

**Tablas creadas (16 tablas):**
- `profiles` - Extiende auth.users con roles (admin/profesor/alumno)
- `clases` - Clases en vivo con videollamada
- `tareas` - Tareas asignadas por profesores
- `tarea_asignaciones` - Relación N:N tareas ↔ alumnos con estado y calificación
- `entregas` - Archivos subidos por alumnos (video/audio)
- `evaluaciones` - Evaluaciones periódicas
- `criterios_evaluacion` - Criterios configurables (tiempo, limpieza, etc.)
- `sesiones_practica` - Registro de tiempo de práctica
- `rudimentos` - Catálogo de los 40 rudimentos PAS (40 insertados)
- `grooves` - Catálogo de grooves por estilo (6 insertados)
- `progreso_rudimentos` - Dominio de rudimentos por alumno
- `progreso_grooves` - Dominio de grooves por alumno
- `canciones_material` - Material de estudio con canciones
- `cola_procesamiento` - Trabajos de audio (BPM, stems, notas)
- `notificaciones` - Notificaciones push
- `rachas_estudio` - Gamificación (racha de días)

**Políticas RLS implementadas:**
- ✅ Admin: acceso total a todo
- ✅ Profesor: solo ve datos de sus alumnos asignados
- ✅ Alumno: solo ve sus propios datos + datos de su profesor
- ✅ Un alumno NUNCA ve datos de otros alumnos
- ✅ Funciones auxiliares: `is_admin()`, `is_profesor_of()`

**Triggers:**
- `updated_at` automático en todas las tablas
- `handle_new_user()` crea profile al registrarse

**Vistas útiles:**
- `v_alumnos_profesor` - Resumen de alumnos para el profesor
- `v_progreso_alumno` - Progreso general del alumno

**Storage Buckets:**
- `avatars/` (público)
- `entregas/` (privado, solo alumno + profesor)
- `materiales/` (privado)
- `audio-stems/` (privado)
- `correcciones/` (privado)

---

### 2. Diagrama de Arquitectura
📄 **Archivo:** `docs/ARQUITECTURA.md`

**Componentes principales:**
```
┌─────────────────────────────────────────────────────┐
│              APP MÓVIL (Flutter)                     │
│  Auth │ Clases │ Tareas │ Biblioteca │ Metrónomo    │
│  State: Riverpod | Data: Repositories              │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌──────────────────────────┐
│Supabase│ │Supabase│ │  SERVIDOR DE AUDIO       │
│ Auth   │ │Postgres│ │  FastAPI + Demucs        │
│        │ │+ RLS   │ │  Basic Pitch + librosa   │
│        │ │        │ │  Celery + Redis          │
│        │ │Storage │ │                          │
└────────┘ └────────┘ └──────────────────────────┘
```

**Decisiones clave:**
- Flutter + Riverpod (no React Native)
- Supabase como BaaS (no Firebase, no backend propio)
- Servidor Python separado para audio (no edge functions)
- Jitsi Meet para videollamada (no Agora)
- Demucs para separación de stems (requiere GPU)

---

### 3. Riesgos Técnicos y Legales
📄 **Archivo:** `docs/RIESGOS.md`

**Riesgos críticos identificados:**
1. 🔴 **Copyright de música** - Los usuarios NO deben subir canciones con copyright
2. 🔴 **Privacidad de menores** - Consentimiento parental para <16 años
3. 🔴 **Procesamiento de audio lento** - Demucs requiere GPU, puede tardar minutos
4. 🟡 **Latencia en videollamada** - Jitsi puede tener lag
5. 🟡 **Almacenamiento de videos** - Crecimiento de storage
6. 🟡 **Contenido inapropiado** - Videos privados, solo profesor ve

**Mitigaciones propuestas:**
- Términos de servicio claros sobre copyright
- Aviso de "solo archivos con licencia"
- Edad mínima 16+ o consentimiento parental
- Cola de trabajos asíncrona (Celery)
- Compresión de videos antes de subir
- RLS garantiza que solo el profesor ve los videos del alumno

---

### 4. Aplicación Web Funcional (Demo)

**Estructura implementada:**
```
src/
├── types/academy.ts          # Tipos TypeScript del dominio
├── store/AcademyContext.tsx   # Estado global con datos seed
├── features/
│   ├── auth/Login.tsx         # Login con 3 roles
│   ├── admin/AdminPanel.tsx   # CRUD de usuarios, métricas
│   ├── profesor/ProfesorPanel.tsx  # Clases, tareas, calificar
│   └── alumno/AlumnoPanel.ts  # Tareas, biblioteca, progreso
└── App.tsx                    # Router según rol
```

**Funcionalidades demo:**
- ✅ Login con 3 roles (admin, profesor, alumno)
- ✅ Admin: crear/editar/eliminar usuarios, asignar alumnos a profesores
- ✅ Profesor: ver alumnos, crear tareas, calificar entregas
- ✅ Alumno: ver tareas pendientes, biblioteca de rudimentos/grooves
- ✅ Notificaciones simuladas
- ✅ Datos seed (usuarios, clases, tareas, rudimentos, grooves)

**Usuarios de demo:**
- Admin: `admin@drumpro.com`
- Profesor: `carlos@drumpro.com`
- Alumno: `juan@drumpro.com`
- (Cualquier contraseña funciona en la demo)

---

## 🚀 Cómo Probar

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build
```

Abre el navegador y usa los botones de "Acceso rápido" para probar cada rol.

---

## 📋 Próximas Fases

### Fase 2: Autenticación Real con Supabase
- Integrar Supabase Auth (email/password + magic link)
- Migrar datos seed a Supabase
- Implementar RLS en queries reales
- Panel de admin completo con métricas de Supabase

### Fase 3: Clases y Calendario
- Calendario visual con react-big-calendar
- Creación de clases con fecha/hora
- Recordatorios con notificaciones push
- Adjuntar materiales (PDF, audio, video)

### Fase 4: Tareas y Entregas
- Grabación de video/audio dentro de la app
- Compresión y subida a Supabase Storage
- Sistema de correcciones (texto, audio, video)
- Rúbricas de calificación configurables

---

## ⚠️ Suposiciones Tomadas

1. **Edad mínima:** 16 años (para evitar complejidad de COPPA/GDPR-K)
2. **Videollamada:** Jitsi Meet por enlace externo (no embebido en MVP)
3. **Archivos de audio:** Solo archivos propios con licencia (NO Spotify/YouTube)
4. **Stems:** Se procesan en servidor, no en dispositivo
5. **Notificaciones:** FCM para Android (no iOS en MVP)
6. **Idioma:** Solo español en MVP

---

## 📁 Archivos Entregados

| Archivo | Descripción |
|---------|-------------|
| `docs/database.sql` | Modelo de datos completo con RLS (600+ líneas) |
| `docs/ARQUITECTURA.md` | Diagrama y decisiones de arquitectura |
| `docs/RIESGOS.md` | Análisis de riesgos técnicos y legales |
| `src/types/academy.ts` | Tipos TypeScript del dominio |
| `src/store/AcademyContext.tsx` | Estado global con datos seed |
| `src/features/auth/Login.tsx` | Pantalla de login |
| `src/features/admin/AdminPanel.tsx` | Panel de administrador |
| `src/features/profesor/ProfesorPanel.tsx` | Panel de profesor |
| `src/features/alumno/AlumnoPanel.tsx` | Panel de alumno |
| `src/App.tsx` | Router principal según rol |

---

## 🎯 Validación de la Fase 1

**Checklist:**
- ✅ Modelo de datos normalizado (3NF)
- ✅ RLS implementado en todas las tablas
- ✅ Índices para queries frecuentes
- ✅ Triggers de updated_at automático
- ✅ Datos seed (rudimentos PAS, grooves, usuarios)
- ✅ Diagrama de arquitectura claro
- ✅ Riesgos identificados y mitigados
- ✅ App demo funcional con 3 roles
- ✅ Código comentado en español

**Recomendación:**
Revisar el archivo `docs/database.sql` con calma antes de avanzar. Si el modelo de datos queda bien, el resto de las fases fluirá naturalmente.

---

**DrumPro Academy - Fase 1 Completada ✅**

¿Listo para la Fase 2 (Autenticación con Supabase)?
