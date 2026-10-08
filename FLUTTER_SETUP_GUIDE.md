# 🥁 DrumPro Academy - Guía de Instalación Flutter

## ⚠️ IMPORTANTE: Este proyecto requiere Flutter local

Los archivos `.dart` en este repositorio son **código de referencia**. Debes crear el proyecto Flutter en tu máquina local.

## 📋 Requisitos Previos

### 1. Flutter SDK
```bash
# Verificar instalación
flutter --version

# Debe mostrar: Flutter 3.x.x • channel stable
```

**Instalar Flutter:** https://docs.flutter.dev/get-started/install

### 2. Android Studio
- Descargar: https://developer.android.com/studio
- Instar SDK de Android (API 24+)
- Configurar emulator o conectar dispositivo físico

### 3. Java JDK 17
```bash
java --version
# Debe mostrar: openjdk 17.x.x
```

### 4. Supabase Account
- Crear cuenta: https://supabase.com
- Crear proyecto nuevo
- Obtener URL y ANON KEY

## 🚀 Pasos para Crear el Proyecto

### Paso 1: Crear proyecto Flutter
```bash
flutter create drumpro_academy --org com.drumpro --platforms android
cd drumpro_academy
```

### Paso 2: Copiar archivos de este repositorio
```bash
# Copiar estructura de carpetas
cp -r ../drumpro-academy-reference/lib/* lib/
cp ../drumpro-academy-reference/pubspec.yaml pubspec.yaml
```

### Paso 3: Instalar dependencias
```bash
flutter pub get
```

### Paso 4: Configurar Supabase
Crear archivo `lib/core/config/supabase_config.dart`:
```dart
class SupabaseConfig {
  static const String url = 'TU_SUPABASE_URL';
  static const String anonKey = 'TU_SUPABASE_ANON_KEY';
}
```

### Paso 5: Ejecutar SQL en Supabase
1. Ir a Supabase Dashboard → SQL Editor
2. Copiar y ejecutar el contenido de `docs/database.sql`
3. Verificar que se crearon todas las tablas

### Paso 6: Ejecutar la app
```bash
# En emulator
flutter run

# En dispositivo físico (con USB debugging activado)
flutter run -d <device_id>

# Ver dispositivos conectados
flutter devices
```

## 📁 Estructura del Proyecto Flutter

```
lib/
├── core/
│   ├── config/              # Configuraciones
│   │   ├── supabase_config.dart
│   │   ├── app_config.dart
│   │   └── theme_config.dart
│   ├── constants/           # Constantes
│   │   ├── app_colors.dart
│   │   ├── app_strings.dart
│   │   └── app_routes.dart
│   ├── theme/               # Tema Material 3
│   │   ├── app_theme.dart
│   │   └── color_scheme.dart
│   ├── utils/               # Utilidades
│   │   ├── date_utils.dart
│   │   ├── file_utils.dart
│   │   └── audio_utils.dart
│   └── widgets/             # Widgets reutilizables
│       ├── custom_button.dart
│       ├── loading_indicator.dart
│       └── error_message.dart
│
├── features/
│   ├── auth/                # Autenticación
│   │   ├── data/
│   │   │   ├── auth_repository.dart
│   │   │   └── auth_service.dart
│   │   ├── domain/
│   │   │   └── auth_state.dart
│   │   └── presentation/
│   │       ├── login_screen.dart
│   │       ├── register_screen.dart
│   │       └── auth_provider.dart
│   │
│   ├── admin/               # Panel de administrador
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── admin_dashboard.dart
│   │       ├── users_management.dart
│   │       └── metrics_screen.dart
│   │
│   ├── profesor/            # Panel de profesor
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── profesor_dashboard.dart
│   │       ├── students_list.dart
│   │       └── create_task_screen.dart
│   │
│   ├── alumno/              # Panel de alumno
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── alumno_dashboard.dart
│   │       ├── tasks_screen.dart
│   │       └── progress_screen.dart
│   │
│   ├── clases/              # Clases en vivo
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── calendar_screen.dart
│   │       ├── class_detail.dart
│   │       └── video_call_screen.dart
│   │
│   ├── tareas/              # Tareas y entregas
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── task_list.dart
│   │       ├── task_detail.dart
│   │       ├── record_video_screen.dart
│   │       └── upload_screen.dart
│   │
│   ├── evaluaciones/        # Evaluaciones
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   ├── progreso/            # Evolución del alumno
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── progress_dashboard.dart
│   │       ├── charts_screen.dart
│   │       └── achievements_screen.dart
│   │
│   ├── biblioteca/          # Biblioteca de estudio
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── rudimentos_screen.dart
│   │       ├── grooves_screen.dart
│   │       └── practice_screen.dart
│   │
│   ├── multitrack/          # Mixer multitrack
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── multitrack_player.dart
│   │       ├── stems_mixer.dart
│   │       └── bpm_detector.dart
│   │
│   ├── redes/               # Contenido para redes
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── record_social_video.dart
│   │       └── export_screen.dart
│   │
│   ├── metronomo/           # Metrónomo de baja latencia
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── metronome_screen.dart
│   │       ├── metronome_service.dart
│   │       └── metronome_provider.dart
│   │
│   ├── midi/                # Soporte MIDI
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   └── gamificacion/        # Gamificación
│       ├── data/
│       ├── domain/
│       └── presentation/
│           ├── achievements_screen.dart
│           ├── points_system.dart
│           └── weekly_challenges.dart
│
├── main.dart                # Entry point
└── app.dart                 # App widget con Router
```

## 🔧 Comandos Útiles

```bash
# Análisis estático
flutter analyze

# Formatear código
flutter format lib/

# Ejecutar tests
flutter test

# Build APK debug
flutter build apk --debug

# Build APK release
flutter build apk --release

# Build AAB para Google Play
flutter build appbundle --release

# Limpiar build
flutter clean

# Regenerar código (después de cambiar pubspec.yaml)
flutter pub get
```

## 📱 Probar en Dispositivo Real

### 1. Activar modo desarrollador en Android
- Ajustes → Acerca del teléfono → 7 clicks en "Número de compilación"

### 2. Activar depuración USB
- Ajustes → Opciones de desarrollador → Depuración USB

### 3. Conectar por USB
```bash
flutter devices
# Debe mostrar tu dispositivo

flutter run
```

### 4. Hot reload
```bash
# Mientras la app está corriendo, presiona 'r' en la terminal
# para recargar cambios sin reiniciar
```

## 🐛 Debugging

### Ver logs en tiempo real
```bash
flutter logs
```

### Debug con Android Studio
1. Abrir carpeta `android/` en Android Studio
2. Esperar a que indexe
3. Run → Debug

### Inspeccionar widget tree
```bash
# Con la app corriendo, presiona 'w' en la terminal
# para ver el widget tree
```

## 📦 Publicar en Google Play

### 1. Crear keystore de firma
```bash
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload
```

### 2. Configurar firma en `android/app/build.gradle`
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../upload-keystore.jks')
            storePassword 'TU_PASSWORD'
            keyAlias 'upload'
            keyPassword 'TU_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. Build AAB firmado
```bash
flutter build appbundle --release
```

### 4. Subir a Google Play Console
- Archivo: `build/app/outputs/bundle/release/app-release.aab`

## 🎯 Próximos Pasos

1. ✅ Crear proyecto Flutter local
2. ✅ Copiar archivos de referencia
3. ✅ Configurar Supabase
4. ✅ Ejecutar SQL en Supabase
5. ✅ Probar en dispositivo real
6. ✅ Avanzar a Fase 2 (Autenticación)

## 📞 Soporte

Si tienes problemas:
- Documentación Flutter: https://docs.flutter.dev
- Supabase Flutter: https://supabase.com/docs/reference/flutter
- Riverpod: https://riverpod.dev

---

**¡Listo para comenzar! 🥁**
