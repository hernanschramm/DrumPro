# 🥁 DrumPro - Metrónomo Profesional para Bateristas

Aplicación profesional para bateristas que practican, ensayan y tocan en vivo. Construida con React + Capacitor para funcionar como PWA web y app nativa Android.

![DrumPro](https://img.shields.io/badge/version-1.0.0-orange)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

## ✨ Características

### 🎵 Metrónomo Profesional
- BPM de 20 a 400 con precisión de audio (Web Audio API)
- Compases: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, 12/8 y personalizado
- Subdivisiones: negras, corcheas, tresillos, semicorcheas y swing
- 4 sonidos: click, cowbell, hi-hat, madera
- Acentos configurables por pulso (fuerte, medio, suave, silencio)
- Tap tempo y flash visual en pulso fuerte
- Funciona con pantalla apagada

### 🏋️ Entrenador de Práctica
- **Modo silenciar compases**: suena N compases y descansa M compases
- **Aumento gradual de tempo**: sube X BPM cada N compases automáticamente
- Temporizador de sesión con registro diario del tiempo de práctica

### 🎸 Biblioteca de Canciones y Setlists
- CRUD completo de canciones con BPM, compás, duración y notas
- Estructura de canción (intro, estrofa, estribillo, puente)
- Setlists para shows con reordenamiento
- Duración total estimada del setlist
- **Modo escenario**: fuente grande, fondo oscuro, botones gigantes, pantalla siempre encendida

### 🥁 Editor de Patrones (Secuenciador)
- Grilla de 16 pasos
- 6 instrumentos: bombo, caja, hi-hat cerrado, hi-hat abierto, tom, platillo
- Patrones predefinidos: rock, funk, reggaeton
- Reproducción en loop con BPM configurable
- Guardado y carga de patrones

### ⚙️ Ajustes
- Tema claro y oscuro
- Exportar/importar biblioteca en JSON
- Estadísticas de tiempo de práctica
- 100% offline - todos los datos se guardan localmente

## 🚀 Instalación Rápida

### Como PWA (Web)

1. Abre la URL en Chrome/Edge
2. Menú → "Añadir a pantalla de inicio"
3. ¡Listo! Funciona offline

### Como APK Android

```bash
# Clonar repositorio
git clone <tu-repo>
cd drumpro

# Instalar dependencias
npm install

# Compilar y abrir en Android Studio
bash build-android.sh
```

O manualmente:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Luego en Android Studio: Build → Build APK

📖 **Guía completa**: Ver [QUICK_START_APK.md](QUICK_START_APK.md)

## 📱 Capturas de Pantalla

| Metrónomo | Entrenador | Canciones | Patrones |
|-----------|------------|-----------|----------|
| ![Metronome](screenshots/metronome.png) | ![Practice](screenshots/practice.png) | ![Songs](screenshots/songs.png) | ![Patterns](screenshots/patterns.png) |

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Audio**: Web Audio API (baja latencia)
- **Estado**: React Context + useReducer
- **Persistencia**: localStorage
- **Nativo**: Capacitor (Android)
- **Build**: Vite

## 📂 Estructura del Proyecto

```
drumpro/
├── android/                    # Proyecto Android nativo (Capacitor)
├── public/
│   ├── icon.svg               # Icono SVG
│   ├── icon-192.png           # Icono PWA 192px
│   ├── icon-512.png           # Icono PWA 512px
│   ├── manifest.json          # Manifiesto PWA
│   ├── sw.js                  # Service Worker
│   └── generate-icons.html    # Generador de iconos
├── src/
│   ├── audio/
│   │   ├── MetronomeEngine.ts     # Motor de audio del metrónomo
│   │   └── SequencerEngine.ts     # Motor de audio del secuenciador
│   ├── features/
│   │   ├── metronome/         # Módulo del metrónomo
│   │   ├── entrenador/        # Entrenador de práctica
│   │   ├── canciones/         # Biblioteca de canciones y setlists
│   │   ├── patrones/          # Editor de patrones
│   │   ├── setlists/          # Modo escenario
│   │   └── ajustes/           # Configuración
│   ├── store/
│   │   └── AppContext.tsx     # Estado global
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globales
├── capacitor.config.ts       # Configuración Capacitor
├── build-android.sh          # Script de build automático
├── QUICK_START_APK.md        # Guía rápida para APK
├── ANDROID_BUILD_GUIDE.md    # Guía completa para Google Play
└── package.json
```

## 🎯 Uso

### Metrónomo
1. Selecciona BPM (20-400)
2. Elige compás (4/4, 3/4, etc.)
3. Selecciona subdivisión
4. Elige sonido (click, cowbell, hi-hat, madera)
5. Configura acentos si es necesario
6. Presiona ▶️ para iniciar

**Atajos de teclado:**
- `Espacio`: Play/Stop
- `T`: Tap Tempo

### Entrenador de Práctica
1. Configura BPM base
2. Activa "Silenciar compases" para trabajar tiempo interno
3. O activa "Aumento gradual" para subir tempo automáticamente
4. Presiona ▶️ para iniciar sesión

### Modo Escenario
1. Crea un setlist con tus canciones
2. Presiona el botón "🎤 Escenario"
3. Navega entre canciones con ← →
4. Play/Stop con Espacio
5. Pantalla siempre encendida automáticamente

## 📦 Publicar en Google Play

### Requisitos
- Cuenta de desarrollador de Google Play ($25 USD)
- Android Studio instalado
- Keystore de firma creado

### Pasos
1. Genera iconos (512x512, 192x192, feature graphic 1024x500)
2. Crea keystore de firma
3. Configura firma en `android/app/build.gradle`
4. Genera AAB firmado
5. Sube a Google Play Console
6. Completa ficha de la tienda

📖 **Guía detallada**: Ver [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)

## 🔧 Comandos

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Build
npm run build            # Compilar para producción

# Android
bash build-android.sh    # Build completo + abrir Android Studio
npx cap sync android     # Sincronizar cambios
npx cap open android     # Abrir en Android Studio

# Iconos
# Abre public/generate-icons.html en el navegador
```

## 🐛 Debugging

### Ver logs en tiempo real
```bash
adb logcat | grep -i "capacitor\|chromium"
```

### Debug remoto con Chrome
1. Activa "Modo desarrollador" y "Depuración USB" en Android
2. Conecta por USB
3. Chrome → `chrome://inspect`
4. Selecciona tu dispositivo

## 📊 Roadmap

- [ ] Agregar sonidos personalizados (importar .wav/.mp3)
- [ ] Modo metrónomo con vibración
- [ ] Exportar patrones como MIDI
- [ ] Sincronización con otros dispositivos (Bluetooth)
- [ ] Estadísticas avanzadas de práctica
- [ ] Tutoriales interactivos
- [ ] Modo nocturno automático
- [ ] Backup en la nube (opcional)

## 📄 Licencia

Todos los derechos reservados.

## 🤝 Contribuciones

Este es un proyecto privado. Para reportar bugs o sugerir mejoras, contacta al desarrollador.

## 📞 Soporte

Si tienes problemas:
1. Revisa [QUICK_START_APK.md](QUICK_START_APK.md)
2. Verifica que Android Studio esté actualizado
3. Asegúrate de tener Java JDK 17 instalado
4. Limpia el proyecto: Build → Clean Project

---

**Hecho con 🥁 para bateristas por bateristas**

**DrumPro v1.0.0** - 2026
