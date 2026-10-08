# 🥁 DrumPro Academy - Fase 1: Modelo de Datos y Estructura Flutter

## ✅ Entregables de la Fase 1

### 1. Modelo de Datos Completo (SQL con RLS)
📄 **Archivo:** `docs/database.sql`

**16 tablas con Row Level Security:**
- `profiles` - Usuarios con roles (admin/profesor/alumno)
- `clases` - Clases en vivo con videollamada
- `tareas` - Tareas asignadas por profesores
- `tarea_asignaciones` - Relación N:N tareas ↔ alumnos
- `entregas` - Archivos subidos por alumnos
- `evaluaciones` - Evaluaciones periódicas
- `criterios_evaluacion` - Criterios configurables
- `sesiones_practica` - Registro de tiempo de práctica
- `rudimentos` - 40 rudimentos PAS
- `grooves` - Catálogo de grooves por estilo
- `progreso_rudimentos` - Dominio de rudimentos
- `progreso_grooves` - Dominio de grooves
- `canciones_material` - Material de estudio
- `cola_procesamiento` - Trabajos de audio
- `notificaciones` - Notificaciones push
- `rachas_estudio` - Gamificación

**Políticas RLS:**
- ✅ Admin: acceso total
- ✅ Profesor: solo sus alumnos
- ✅ Alumno: solo sus datos + profesor
- ✅ Un alumno NUNCA ve datos de otros alumnos

---

### 2. Diagrama de Arquitectura
📄 **Archivo:** `docs/ARQUITECTURA.md`

```
┌─────────────────────────────────────────────────────┐
│         APP MÓVIL FLUTTER (Android)                  │
│  Material 3 + Riverpod + go_router                  │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌──────────────────────────┐
│Supabase│ │Supabase│ │  SERVIDOR DE AUDIO       │
│ Auth   │ │Postgres│ │  FastAPI + Demucs        │
│        │ │+ RLS   │ │  Basic Pitch + librosa   │
│        │ │Storage │ │  Celery + Redis          │
└────────┘ └────────┘ └──────────────────────────┘
```

**Decisiones clave:**
- Flutter + Riverpod + go_router
- Supabase como BaaS
- Servidor Python separado para audio
- Jitsi Meet para videollamada
- Demucs para separación de stems

---

### 3. Riesgos Técnicos y Legales
📄 **Archivo:** `docs/RIESGOS.md`

**Críticos:**
1. 🔴 **Copyright** - Solo archivos propios/licenciados
2. 🔴 **Privacidad de menores** - Edad mínima 16+
3. 🔴 **Demucs lento** - Requiere GPU, 2-5 min por canción

---

### 4. Estructura del Proyecto Flutter
📄 **Carpeta:** `flutter_reference/lib/`

**Archivos de referencia completos:**
- `main.dart` - Punto de entrada
- `app.dart` - Widget principal con router
- `core/config/supabase_config.dart` - Configuración Supabase
- `core/config/app_config.dart` - Configuración general
- `core/constants/app_routes.dart` - Rutas de navegación
- `core/constants/app_strings.dart` - Cadenas de texto
- `core/theme/app_theme.dart` - Tema Material 3
- `features/auth/domain/auth_state.dart` - Estado de autenticación
- `features/auth/presentation/auth_provider.dart` - Provider de auth
- `features/auth/presentation/login_screen.dart` - Pantalla de login
- `features/admin/presentation/admin_dashboard.dart` - Panel admin
- `features/profesor/presentation/profesor_dashboard.dart` - Panel profesor
- `features/alumno/presentation/alumno_dashboard.dart` - Panel alumno

---

## 🚀 Cómo Usar Estos Archivos

### Paso 1: Crear proyecto Flutter en tu máquina
```bash
flutter create drumpro_academy --org com.drumpro --platforms android
cd drumpro_academy
```

### Paso 2: Copiar archivos de referencia
```bash
# Copiar pubspec.yaml
cp ../drumpro-academy-reference/flutter_reference/pubspec.yaml .

# Copiar estructura lib/
cp -r ../drumpro-academy-reference/flutter_reference/lib/* lib/

# Copiar documentación
cp -r ../drumpro-academy-reference/docs/ .
```

### Paso 3: Instalar dependencias
```bash
flutter pub get
```

### Paso 4: Configurar Supabase
Editar `lib/core/config/supabase_config.dart`:
```dart
static const String url = 'https://TU_PROYECTO.supabase.co';
static const String anonKey = 'TU_ANON_KEY';
```

### Paso 5: Ejecutar SQL en Supabase
1. Ir a Supabase Dashboard → SQL Editor
2. Copiar y ejecutar `docs/database.sql`

### Paso 6: Ejecutar la app
```bash
# En emulator
flutter run

# En dispositivo físico
flutter run -d <device_id>
```

---

## 📋 Guía Completa de Instalación
📄 **Archivo:** `FLUTTER_SETUP_GUIDE.md`

Incluye:
- Requisitos previos (Flutter, Android Studio, Java JDK)
- Comandos para crear proyecto
- Configuración de Supabase
- Cómo probar en dispositivo real
- Cómo generar APK/AAB para Google Play
- Debugging y troubleshooting

---

## 🎯 Próximas Fases

### Fase 2: Autenticación Completa
- Registro de usuarios
- Recuperación de contraseña
- Validación de email
- Perfiles con avatar

### Fase 3: Clases y Calendario
- Calendario visual
- Creación de clases
- Recordatorios con notificaciones
- Adjuntar materiales

### Fase 4: Tareas y Entregas
- Grabación de video/audio
- Compresión y subida
- Sistema de correcciones
- Rúbricas de calificación

---

## ⚠️ Suposiciones Tomadas

1. **Edad mínima:** 16 años
2. **Videollamada:** Jitsi Meet por enlace externo
3. **Archivos:** Solo propios/licenciados (NO Spotify/YouTube)
4. **Stems:** Se procesan en servidor con GPU
5. **Notificaciones:** FCM para Android
6. **Idioma:** Solo español en MVP

---

## 📁 Archivos Entregados

| Archivo | Descripción |
|---------|-------------|
| `docs/database.sql` | Modelo de datos completo con RLS |
| `docs/ARQUITECTURA.md` | Diagrama y decisiones de arquitectura |
| `docs/RIESGOS.md` | Análisis de riesgos técnicos y legales |
| `flutter_reference/pubspec.yaml` | Dependencias de Flutter |
| `flutter_reference/lib/main.dart` | Punto de entrada |
| `flutter_reference/lib/app.dart` | Widget principal con router |
| `flutter_reference/lib/core/*` | Configuración, tema, constantes |
| `flutter_reference/lib/features/auth/*` | Autenticación completa |
| `flutter_reference/lib/features/admin/*` | Panel de administrador |
| `flutter_reference/lib/features/profesor/*` | Panel de profesor |
| `flutter_reference/lib/features/alumno/*` | Panel de alumno |
| `FLUTTER_SETUP_GUIDE.md` | Guía completa de instalación |

---

## 🎯 Validación de la Fase 1

**Checklist:**
- ✅ Modelo de datos normalizado (3NF)
- ✅ RLS implementado en todas las tablas
- ✅ Índices para queries frecuentes
- ✅ Triggers de updated_at automático
- ✅ Datos seed (40 rudimentos, 6 grooves, 6 usuarios)
- ✅ Diagrama de arquitectura claro
- ✅ Riesgos identificados y mitigados
- ✅ Estructura Flutter completa con archivos de referencia
- ✅ Código comentado en español
- ✅ Material 3 con tema oscuro por defecto
- ✅ Riverpod para state management
- ✅ go_router para navegación
- ✅ Supabase integrado

---

## 🚀 Siguiente Paso: Fase 2

Cuando confirmes, construyo la **Fase 2: Autenticación Completa**:
- Registro de usuarios con validación
- Recuperación de contraseña por email
- Perfiles con avatar y bio
- Asignación de alumnos a profesores desde admin
- Verificación de email con Supabase Auth

---

**DrumPro Academy - Fase 1 Completada ✅**

**¿Listo para la Fase 2?**
