# 🥁 DrumPro Academy

**Plataforma Profesional de Enseñanza de Batería**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue.svg)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-5-purple.svg)](https://capacitorjs.com/)

## 📖 Descripción

DrumPro Academy es una plataforma web progresiva (PWA) diseñada para la enseñanza de batería, que conecta profesores con alumnos a través de herramientas profesionales de práctica, evaluación y seguimiento del progreso.

### Características Principales

- 👥 **Sistema multi-rol**: Administrador, Profesor y Alumno
- 📅 **Gestión de clases**: Calendario, videollamadas, materiales
- 📝 **Sistema de tareas**: Grabación de video/audio, calificación con rúbricas
- 📊 **Evaluaciones**: Seguimiento del progreso con gráficos
- 📚 **Biblioteca**: 40 rudimentos PAS + 22 grooves por estilo
- 🎵 **Metrónomo profesional**: Baja latencia, múltiples subdivisiones
- 🎛️ **Multitrack Player**: Reproducción de stems, detección de BPM
- 🎼 **Piano Roll**: Visualización de notas detectadas
- 📱 **Contenido para redes**: Grabación vertical 9:16

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+ y npm
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Para Android: Android Studio + dispositivo/emulador

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd drumpro-academy

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`

### Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@drumpro.com | cualquier |
| Profesor | carlos@drumpro.com | cualquier |
| Alumno | juan@drumpro.com | cualquier |

## 📱 Probar en Android

### Opción 1: Script Automático (Recomendado)

```bash
chmod +x build-android.sh
./build-android.sh
```

### Opción 2: Manual

```bash
# Compilar aplicación
npm run build

# Instalar Capacitor
npm install @capacitor/core @capacitor/android
npx cap add android

# Sincronizar y abrir en Android Studio
npx cap sync android
npx cap open android
```

Luego en Android Studio:
1. Espera a que indexe los archivos
2. Conecta tu dispositivo o inicia emulador
3. Click en ▶️ (Run) o Shift+F10

📖 **Guía completa**: [GUIA_ANDROID.md](GUIA_ANDROID.md)

## 📊 Estado del Proyecto

**Progreso: 10/13 fases completadas (77%)**

### ✅ Fases Completadas

1. ✅ Modelo de datos y autenticación
2. ✅ Gestión de clases y calendario
3. ✅ Sistema de tareas y entregas
4. ✅ Evaluaciones y progreso
5. ✅ Biblioteca y metrónomo
6. ✅ Videollamadas
7. ✅ Multitrack player
8. ✅ Detección de notas y piano roll
9. ✅ Contenido para redes sociales
10. ✅ Configuración para Android

### 🔄 Fases Pendientes

11. ⏳ Evaluador de tiempo y MIDI
12. ⏳ Gamificación y modo offline
13. ⏳ Pruebas finales y publicación

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         Frontend (React + TypeScript)   │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │  Auth    │  │  Clases  │  │ Tareas│ │
│  └──────────┘  └──────────┘  └──────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │Biblioteca│  │Multitrack│  │Redes │ │
│  └──────────┘  └──────────┘  └──────┘ │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Backend (Supabase)              │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │   Auth   │  │Database  │  │Storage│ │
│  └──────────┘  └──────────┘  └──────┘ │
└─────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
drumpro-academy/
├── src/
│   ├── features/          # Módulos de la aplicación
│   │   ├── auth/         # Autenticación
│   │   ├── admin/        # Panel administrador
│   │   ├── profesor/     # Panel profesor
│   │   ├── alumno/       # Panel alumno
│   │   ├── clases/       # Clases y videollamadas
│   │   ├── tareas/       # Tareas y entregas
│   │   ├── evaluaciones/ # Evaluaciones
│   │   ├── progreso/     # Panel de progreso
│   │   ├── biblioteca/   # Biblioteca y metrónomo
│   │   ├── multitrack/   # Multitrack y piano roll
│   │   └── redes/        # Grabación para redes
│   ├── store/            # Estado global
│   ├── types/            # Tipos TypeScript
│   └── App.tsx           # Componente principal
├── docs/                 # Documentación técnica
├── FASE*_ENTREGABLES.md  # Documentación por fase
├── GUIA_ANDROID.md       # Guía para Android
└── build-android.sh      # Script de build
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Compilar para producción
npm run preview          # Vista previa de producción

# Android
./build-android.sh       # Build automático para Android
npx cap sync android     # Sincronizar archivos
npx cap open android     # Abrir en Android Studio

# Utilidades
npm run lint             # Ejecutar linter
npm run format           # Formatear código
```

## 🎯 Características Detalladas

### Para Profesores
- Crear y gestionar clases con calendario
- Asignar tareas con consignas detalladas
- Calificar entregas con rúbricas configurables
- Realizar videollamadas con chat integrado
- Seguimiento del progreso de alumnos
- Crear evaluaciones periódicas

### Para Alumnos
- Ver clases programadas y unirse a videollamadas
- Entregar tareas con grabación de video/audio
- Ver calificaciones y feedback de profesores
- Practicar con metrónomo profesional
- Estudiar biblioteca de rudimentos y grooves
- Practicar con multitrack player
- Analizar notas con piano roll
- Grabar videos para redes sociales

### Para Administradores
- Gestionar usuarios (profesores y alumnos)
- Asignar alumnos a profesores
- Ver métricas globales de la plataforma
- Moderar contenido

## 📚 Documentación

- [Resumen del Proyecto](RESUMEN_PROYECTO.md) - Estado general
- [Guía para Android](GUIA_ANDROID.md) - Instalación en móvil
- [Fase 1](FASE1_ENTREGABLES.md) - Autenticación
- [Fase 2](FASE2_ENTREGABLES.md) - Clases
- [Fase 3](FASE3_ENTREGABLES.md) - Tareas
- [Fase 4](FASE4_ENTREGABLES.md) - Evaluaciones
- [Fase 5](FASE5_ENTREGABLES.md) - Biblioteca
- [Fase 6](FASE6_ENTREGABLES.md) - Videollamadas
- [Fase 7](FASE7_ENTREGABLES.md) - Multitrack
- [Fase 8](FASE8_ENTREGABLES.md) - Piano Roll
- [Fase 9](FASE9_ENTREGABLES.md) - Redes Sociales
- [Arquitectura](docs/ARQUITECTURA.md) - Diagrama técnico
- [Base de Datos](docs/database.sql) - Schema SQL
- [Riesgos](docs/RIESGOS.md) - Análisis de riesgos

## 🔧 Tecnologías

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router** - Navegación

### Audio/Video
- **Web Audio API** - Audio de baja latencia
- **MediaRecorder API** - Grabación
- **Canvas API** - Visualizaciones

### Backend (Simulado)
- **Supabase** - Autenticación y BD
- **LocalStorage** - Persistencia

### Mobile
- **Capacitor** - Wrapper nativo
- **Web Share API** - Compartir

## 📱 Plataformas Soportadas

- ✅ Web (Chrome, Firefox, Edge, Safari)
- ✅ Android (vía Capacitor)
- 🔄 iOS (pendiente de pruebas)
- 🔄 PWA (instalable en móvil)

## 🤝 Contribuciones

Este es un proyecto de demostración. Para sugerencias o mejoras:

1. Revisa las fases pendientes
2. Reporta bugs con detalles
3. Sugiere nuevas funcionalidades

## 📄 Licencia

Este proyecto es una demostración educativa.

## 📞 Contacto

Para más información sobre el proyecto, consulta la [documentación completa](RESUMEN_PROYECTO.md).

---

**Desarrollado con ❤️ para la comunidad de bateristas**

🥁 **DrumPro Academy** - Aprende, practica, mejora
