# DrumPro Academy - Arquitectura del Sistema

## Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           APP MÓVIL (Flutter)                            │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Módulo   │  │ Módulo   │  │ Módulo   │  │ Módulo   │  │ Módulo   │  │
│  │ Auth     │  │ Clases   │  │ Tareas   │  │ Biblioteca│  │ Metrónomo│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │              │              │        │
│  ┌────┴──────────────┴──────────────┴──────────────┴──────────────┴────┐ │
│  │                    STATE MANAGEMENT (Riverpod)                       │ │
│  └────────────────────────────────┬────────────────────────────────────┘ │
│                                   │                                      │
│  ┌────────────────────────────────┴────────────────────────────────────┐ │
│  │                    DATA LAYER (Repositories)                        │ │
│  └────┬──────────────┬──────────────┬──────────────┬──────────────────┘ │
│       │              │              │              │                      │
└───────┼──────────────┼──────────────┼──────────────┼──────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌───────────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────────────┐
│  Supabase     │ │ Supabase │ │ Supabase │ │   SERVIDOR DE AUDIO        │
│  Auth         │ │ Postgres │ │ Storage  │ │   (FastAPI + Python)       │
│               │ │ + RLS    │ │          │ │                            │
│  - Login      │ │          │ │          │ │  ┌──────────────────────┐  │
│  - Roles      │ │ - profiles│ │ - avatars│ │  │ Cola de Trabajos     │  │
│  - JWT        │ │ - clases │ │ - entregas│ │  │ (Celery + Redis)     │  │
│  - Sessions   │ │ - tareas │ │ - materiales│ │  └──────────┬───────────┘  │
│               │ │ - evals  │ │ - stems  │ │             │              │
│               │ │ - progreso│ │ - audio  │ │  ┌──────────▼───────────┐  │
│               │ │ - canciones│ │          │ │  │ Demucs (stems)       │  │
│               │ │ - cola     │ │          │ │  │ Basic Pitch (notas)  │  │
│               │ │            │ │          │ │  │ librosa (BPM)        │  │
│               │ │ Realtime ◄──┤          │ │  │ pydub (procesamiento)│  │
│               │ │ (notific.) │ │          │ │  └──────────────────────┘  │
└───────────────┘ └──────────┘ └──────────┘ └────────────────────────────┘
        │                                              │
        │              ┌───────────────────────────────┘
        │              │
        ▼              ▼
┌───────────────────────────────┐
│   SERVICIOS EXTERNOS          │
│                               │
│  ┌─────────┐  ┌────────────┐  │
│  │ Firebase│  │ Videollama-│  │
│  │ Cloud   │  │ da (Jitsi/ │  │
│  │ Messaging│  │ LiveKit/   │  │
│  │ (Push)  │  │ Agora)     │  │
│  └─────────┘  └────────────┘  │
└───────────────────────────────┘
```

## Decisiones de Arquitectura

### 1. Frontend: Flutter + Riverpod

**Decisión:** Flutter con arquitectura limpia (data/domain/presentation) y Riverpod para state management.

**Justificación:**
- Un solo código para Android e iOS
- Material 3 nativo con buen rendimiento
- Riverpod es más testable y mantenible que Provider
- go_router para navegación declarativa

**Alternativas descartadas:**
- React Native: menor rendimiento en animaciones complejas
- Kotlin nativo: duplicar trabajo para iOS

### 2. Backend: Supabase

**Decisión:** Supabase como BaaS (Backend as a Service).

**Componentes usados:**
- **Auth**: Autenticación con email/password + magic links
- **Postgres**: Base de datos relacional con RLS
- **Storage**: Almacenamiento de archivos (videos, audios, stems)
- **Realtime**: Notificaciones en tiempo real (nueva tarea, corrección)
- **Edge Functions**: Lógica serverless para webhooks y triggers

**Justificación:**
- RLS integrado: seguridad a nivel de fila sin middleware
- Realtime incluido: no necesitamos WebSocket server propio
- Storage con CDN: entrega rápida de archivos pesados
- Plan gratuito generoso para MVP

**Alternativas descartadas:**
- Firebase: RLS menos flexible, menos control de datos
- Backend propio (Node/Django): más trabajo, más infraestructura

### 3. Servidor de Audio: FastAPI + Demucs

**Decisión:** Servidor Python separado para procesamiento pesado de audio.

**Componentes:**
- **FastAPI**: API REST asíncrona
- **Celery + Redis**: Cola de trabajos para procesamiento asíncrono
- **Demucs**: Separación de stems (batería, bajo, guitarra, voz)
- **Basic Pitch**: Detección de notas (pitch tracking)
- **librosa**: Análisis de audio (BPM, onset detection)
- **pydub**: Manipulación de audio (corte, conversión)

**Justificación:**
- Demucs requiere GPU para rendimiento aceptable
- El procesamiento puede tardar minutos → necesita cola asíncrona
- Python tiene el mejor ecosistema de audio/ML
- Separar del backend principal evita bloquear la app

**Arquitectura del servidor:**
```
POST /api/process
  → Crea trabajo en cola (Redis)
  → Retorna job_id
  
GET /api/status/{job_id}
  → Retorna progreso (0-100%) y estado
  
GET /api/result/{job_id}
  → Retorna URLs de los stems procesados
```

**Alternativas descartadas:**
- Procesar en el dispositivo: Demucs pesa ~500MB, requiere GPU
- Usar API de terceros (Lalal.ai): costo por procesamiento, dependencia externa
- Correr Demucs en Edge Functions: límite de tiempo y memoria de Supabase

### 4. Videollamada: Jitsi Meet (plan gratuito)

**Decisión:** Jitsi Meet embebido o por enlace externo.

**Justificación:**
- Gratuito y open source
- Sin límite de tiempo en reuniones
- SDK para Flutter disponible
- Alternativa: LiveKit (más control pero más complejo)

**Alternativas evaluadas:**
- Agora: mejor calidad pero costo por minuto
- Zoom SDK: restricciones de plan gratuito
- Google Meet: solo por enlace, no embebible

### 5. Almacenamiento de Archivos

**Decisión:** Supabase Storage con buckets separados por tipo.

**Buckets:**
- `avatars/`: Fotos de perfil (público)
- `entregas/{alumno_id}/`: Videos/audios de entregas (privado)
- `materiales/`: PDFs, audios de apoyo (privado)
- `audio-stems/`: Stems procesados (privado)
- `correcciones/`: Audios/videos de feedback del profesor

**Límites y compresión:**
- Videos: máx 100MB, comprimidos con ffmpeg antes de subir
- Audios: máx 50MB, convertidos a AAC 128kbps
- Imágenes: máx 5MB, redimensionadas a 1080px

### 6. Notificaciones Push

**Decisión:** Firebase Cloud Messaging (FCM) para Android.

**Eventos que disparan notificaciones:**
- Nueva clase programada
- Nueva tarea asignada
- Tarea corregida
- Evaluación disponible
- Stems procesados

**Implementación:**
- Supabase Edge Function dispara notificación al crear registro
- FCM envía push al dispositivo
- App muestra notificación local si está en foreground

## Flujo de Datos Principal

### Flujo de Entrega de Tarea

```
1. Profesor crea tarea
   → INSERT en tareas
   → INSERT en tarea_asignaciones (estado: pendiente)
   → Realtime notifica al alumno

2. Alumno graba video/audio
   → Comprime archivo localmente
   → Sube a Storage (entregas/{alumno_id}/)
   → INSERT en entregas
   → UPDATE tarea_asignaciones (estado: entregada)
   → Realtime notifica al profesor

3. Profesor revisa
   → Ve video/audio desde Storage
   → Escribe corrección (texto/audio/video)
   → UPDATE tarea_asignaciones (estado: aprobada/con_correcciones, puntaje)
   → Realtime notifica al alumno

4. Alumno ve corrección
   → Lee feedback
   → Si necesita corregir: graba nueva entrega
   → UPDATE entregas (intento + 1)
```

### Flujo de Procesamiento de Audio

```
1. Profesor/alumno sube canción (MP3/WAV)
   → Sube a Storage (materiales/)
   → INSERT en canciones_material (stems_status: pendiente)
   → INSERT en cola_procesamiento (tipo: bpm_detection)
   → POST a servidor de audio

2. Servidor procesa BPM
   → Descarga archivo de Storage
   → librosa.analyze(tempo=True)
   → UPDATE canciones_material (bpm_detectado)
   → UPDATE cola_procesamiento (estado: completado, progreso: 100)
   → Realtime notifica a la app

3. Usuario solicita separación de stems
   → INSERT en cola_procesamiento (tipo: stems_separation)
   → POST a servidor de audio
   
4. Servidor separa stems
   → Descarga archivo
   → Demucs.process(audio_file)
   → Sube stems a Storage (audio-stems/{cancion_id}/)
   → UPDATE canciones_material (stems_urls, stems_status: completado)
   → Realtime notifica a la app

5. Usuario usa mixer multitrack
   → Carga stems desde Storage
   → Reproduce con flutter_sound o just_audio
   → Ajusta volumen/mute por pista
   → Mutea batería para tocar encima
```

## Seguridad

### Autenticación
- Email + password con verificación
- Magic link como alternativa
- Sesiones con JWT (refresh tokens)
- Biometría opcional (huella/face ID)

### Autorización (RLS)
- Admin: acceso total
- Profesor: solo sus alumnos asignados
- Alumno: solo sus propios datos + profesor
- Validación en cada query a nivel de base de datos

### Protección de Datos
- Videos/audios en buckets privados
- URLs firmadas con expiración (1 hora)
- No se almacenan datos de tarjetas (si hay pagos)
- Encriptación en tránsito (TLS) y en reposo (Supabase)

### Cumplimiento Legal
- Política de privacidad clara
- Términos de servicio
- Consentimiento para menores de edad
- Aviso de copyright para archivos subidos
- GDPR compliance (derecho al olvido)

## Escalabilidad

### Corto Plazo (MVP - 100 usuarios)
- Supabase plan gratuito: suficiente
- Servidor de audio: 1 instancia con GPU (AWS g4dn.xlarge o similar)
- Storage: ~50GB estimado

### Mediano Plazo (1000 usuarios)
- Supabase Pro: $25/mes
- Servidor de audio: autoescalado con múltiples workers
- CDN para stems (CloudFront o Cloudflare R2)
- Cache de stems frecuentes

### Largo Plazo (10000+ usuarios)
- Supabase Team: $599/mes
- Servidor de audio: Kubernetes con autoescalado
- Base de datos: read replicas
- Microservicios separados (auth, audio, notificaciones)

## Monitoreo y Logs

- **Supabase Dashboard**: métricas de base de datos y auth
- **Sentry**: errores de la app Flutter
- **Servidor de audio**: logs de Celery + Prometheus/Grafana
- **Analytics**: Firebase Analytics (eventos de uso)

## Testing

- **Unit tests**: Riverpod providers, repositories
- **Widget tests**: componentes UI críticos
- **Integration tests**: flujos completos (login → entrega)
- **E2E tests**: Flutter Driver para flujos críticos
- **Audio tests**: validación de calidad de stems

## Costos Estimados (Mensual)

### MVP (100 usuarios activos)
- Supabase Free: $0
- Servidor audio (1x GPU): ~$150/mes (AWS/Azure)
- Firebase (push): $0 (hasta 10K mensajes/día)
- Dominio + SSL: ~$15/año
- **Total: ~$150/mes**

### Escalado (1000 usuarios)
- Supabase Pro: $25/mes
- Servidor audio (autoescalado): ~$500/mes
- Storage (~500GB): ~$50/mes
- CDN: ~$30/mes
- **Total: ~$600/mes**

## Roadmap Técnico

### Fase 1-3: Core (2 meses)
- Auth + 3 roles
- Clases y calendario
- Tareas y entregas básicas

### Fase 4-6: Contenido (2 meses)
- Evaluaciones y progreso
- Biblioteca de rudimentos/grooves
- Metrónomo integrado

### Fase 7-9: Audio Avanzado (3 meses)
- Videollamada
- Servidor de audio (BPM, stems)
- Mixer multitrack + detección de notas

### Fase 10-11: Pulido (1 mes)
- Contenido para redes
- Testing y publicación

**Total estimado: 8 meses de desarrollo**
