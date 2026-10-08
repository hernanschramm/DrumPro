# DrumPro - Guía de Instalación y Generación de APK

## 🎵 Descripción

DrumPro es una aplicación profesional para bateristas que incluye:
- Metrónomo con baja latencia (Web Audio API)
- Entrenador de práctica con modos avanzados
- Biblioteca de canciones y setlists
- Editor de patrones (secuenciador de 16 pasos)
- Modo escenario para shows en vivo

## 📱 Instalación como PWA (Web)

La app ya funciona como Progressive Web App:

1. Abre la URL en Chrome/Edge en tu móvil
2. Toca el menú → "Añadir a pantalla de inicio"
3. La app se instala y funciona offline

## 🤖 Generar APK para Android

### Requisitos previos

1. **Node.js 18+** instalado
2. **Android Studio** instalado con SDK
3. **Java JDK 17** configurado

### Pasos para generar el APK

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Compilar la app web

```bash
npm run build
```

#### 3. Inicializar Capacitor para Android

```bash
npx cap add android
```

#### 4. Sincronizar archivos web con Android

```bash
npx cap sync android
```

#### 5. Abrir en Android Studio

```bash
npx cap open android
```

#### 6. Generar APK de prueba (debug)

En Android Studio:
- Menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
- El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

#### 7. Generar APK firmado (release)

**Crear keystore de firma:**

```bash
keytool -genkey -v -keystore drumpro-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias drumpro
```

**Configurar firma en `android/app/build.gradle`:**

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../drumpro-release-key.jks')
            storePassword 'TU_PASSWORD'
            keyAlias 'drumpro'
            keyPassword 'TU_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Generar APK firmado:**

En Android Studio:
- Menu: Build → Generate Signed Bundle / APK
- Seleccionar "APK"
- Seleccionar el keystore creado
- Seleccionar "release"
- Build

#### 8. Generar AAB para Google Play

En Android Studio:
- Menu: Build → Generate Signed Bundle / APK
- Seleccionar "Android App Bundle"
- Usar el mismo keystore
- Build

El archivo estará en: `android/app/build/outputs/bundle/release/app-release.aab`

## 🎨 Personalizar Iconos

### Reemplazar iconos de la app

1. Genera iconos en estos tamaños:
   - 512x512 px (Google Play Store)
   - 192x192 px (PWA)
   - 1024x500 px (Feature graphic para Play Store)

2. Reemplaza los archivos en:
   - `public/icon-192.png`
   - `public/icon-512.png`
   - `android/app/src/main/res/mipmap-*/ic_launcher.png`

3. Usa [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) para generar todos los tamaños automáticamente

### Generar Splash Screen

1. Crea una imagen de 2732x2732 px
2. Colócala en: `android/app/src/main/res/drawable/splash.png`
3. Actualiza `capacitor.config.ts` si es necesario

## 📋 Publicar en Google Play

### 1. Crear cuenta de desarrollador

- Ve a [Google Play Console](https://play.google.com/console)
- Paga la tarifa única de $25 USD
- Completa tu perfil de desarrollador

### 2. Crear nueva app

- Click en "Crear aplicación"
- Nombre: DrumPro
- Idioma predeterminado: Español
- Tipo: Aplicación
- Gratis/Precio: Tu elección

### 3. Completar ficha de la tienda

**Descripción corta (80 caracteres):**
```
Metrónomo profesional, entrenador de práctica y secuenciador para bateristas
```

**Descripción completa:**
```
DrumPro es la herramienta definitiva para bateristas que practican, ensayan y tocan en vivo.

🎵 METRÓNOMO PROFESIONAL
• BPM de 20 a 400 con precisión de audio
• Compases: 2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, 12/8 y personalizado
• Subdivisiones: negras, corcheas, tresillos, semicorcheas y swing
• 4 sonidos: click, cowbell, hi-hat, madera
• Acentos configurables por pulso
• Tap tempo y flash visual

🏋️ ENTRENADOR DE PRÁCTICA
• Modo silenciar compases para trabajar el tiempo interno
• Aumento gradual de tempo automático
• Temporizador de sesión con registro diario

🎸 BIBLIOTECA DE CANCIONES
• Guarda canciones con BPM, compás y notas
• Crea setlists para tus shows
• Modo escenario con pantalla siempre encendida

🥁 EDITOR DE PATRONES
• Secuenciador de 16 pasos
• 6 instrumentos: bombo, caja, hi-hat, tom, platillo
• Patrones predefinidos: rock, funk, reggaeton
• Guarda y carga tus patrones

✅ 100% OFFLINE - Sin anuncios - Sin compras internas
✅ Audio de baja latencia con Web Audio API
✅ Funciona con pantalla apagada

¡Descarga DrumPro y lleva tu práctica al siguiente nivel!
```

### 4. Subir AAB

- Ve a "Producción" → "Crear nueva versión"
- Sube el archivo `.aab` generado
- Completa la información de la versión

### 5. Completar clasificación de contenido

- Responde el cuestionario de clasificación IARC
- Obtén tu certificado de clasificación

### 6. Configurar precios y distribución

- Selecciona países
- Configura si es gratis o de pago

### 7. Enviar para revisión

- Revisa todos los campos obligatorios
- Click en "Enviar para revisión"
- Espera la aprobación (1-7 días típicamente)

## 🔧 Comandos útiles de Capacitor

```bash
# Sincronizar cambios web → Android
npx cap sync android

# Copiar solo archivos web (más rápido)
npx cap copy android

# Actualizar plugins nativos
npx cap update android

# Abrir en Android Studio
npx cap open android

# Ver estado de la app
npx cap doctor
```

## 🐛 Debugging

### Ver logs en tiempo real

```bash
# Conecta tu dispositivo Android por USB
adb logcat | grep -i "capacitor\|chromium"
```

### Debug remoto con Chrome

1. Activa "Modo desarrollador" en tu Android
2. Activa "Depuración USB"
3. Conecta por USB
4. Abre Chrome en PC → `chrome://inspect`
5. Selecciona tu dispositivo y app

## 📦 Estructura del proyecto

```
drumpro/
├── android/              # Proyecto Android nativo (generado por Capacitor)
├── public/
│   ├── icon-192.png     # Icono PWA
│   ├── icon-512.png     # Icono PWA grande
│   ├── manifest.json    # Manifiesto PWA
│   └── sw.js           # Service Worker
├── src/
│   ├── audio/          # Motores de audio (metrónomo y secuenciador)
│   ├── features/       # Módulos de la app
│   │   ├── metronome/
│   │   ├── entrenador/
│   │   ├── canciones/
│   │   ├── patrones/
│   │   ├── setlists/
│   │   └── ajustes/
│   ├── store/          # Estado global
│   ├── types/          # Tipos TypeScript
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entry point
├── capacitor.config.ts # Configuración Capacitor
└── package.json
```

## 🎯 Próximos pasos sugeridos

1. **Probar en dispositivo real** (no solo emulador)
2. **Optimizar rendimiento** del metrónomo en dispositivos antiguos
3. **Agregar sonidos personalizados** (archivos .wav o .mp3)
4. **Implementar backup en la nube** (opcional)
5. **Agregar tutoriales** dentro de la app
6. **Implementar modo nocturno automático**

## 📞 Soporte

Si tienes problemas:
- Revisa que Android Studio esté actualizado
- Verifica que el SDK de Android esté instalado (API 24+)
- Asegúrate de que Java JDK 17 esté configurado
- Limpia el proyecto: Build → Clean Project

## 📄 Licencia

DrumPro - Todos los derechos reservados

---

**¡Buena suerte con tu app! 🥁🎵**
