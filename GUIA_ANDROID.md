# 🚀 Guía Completa para Probar DrumPro Academy en Android

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
# Verificar instalación
node --version  # Debe ser v18+ o superior
npm --version   # Debe ser v9+ o superior

# Si no está instalado, descarga desde:
# https://nodejs.org/
```

### 2. Android Studio
```bash
# Descarga e instala Android Studio:
# https://developer.android.com/studio

# Durante la instalación, asegúrate de marcar:
# ✅ Android SDK
# ✅ Android SDK Platform
# ✅ Android Virtual Device
```

### 3. Java JDK 17
```bash
# Verificar instalación
java --version  # Debe mostrar openjdk 17.x.x

# Si no está instalado:
# - Android Studio incluye JDK
# - O descarga desde: https://adoptium.net/
```

### 4. Dispositivo Android o Emulador
```bash
# Opción A: Dispositivo físico
# 1. Activa "Modo desarrollador" en tu Android
#    - Ve a Ajustes → Acerca del teléfono
#    - Toca 7 veces en "Número de compilación"
# 2. Activa "Depuración USB"
#    - Ve a Ajustes → Opciones de desarrollador
#    - Activa "Depuración USB"
# 3. Conecta tu dispositivo por USB

# Opción B: Emulador
# 1. Abre Android Studio
# 2. Ve a Tools → Device Manager
# 3. Crea un dispositivo virtual (Pixel 5, API 33)
```

## 🔧 Pasos para Compilar y Probar

### Paso 1: Instalar Dependencias del Proyecto

```bash
# Navega al directorio del proyecto
cd drumpro-academy

# Instala todas las dependencias
npm install
```

### Paso 2: Compilar la Aplicación Web

```bash
# Compila la aplicación para producción
npm run build

# Esto genera la carpeta 'dist/' con los archivos optimizados
```

### Paso 3: Instalar Capacitor

```bash
# Instala Capacitor CLI globalmente (si no está instalado)
npm install -g @capacitor/cli

# Instala las dependencias de Capacitor en el proyecto
npm install @capacitor/core @capacitor/android

# Agrega la plataforma Android
npx cap add android
```

### Paso 4: Sincronizar Archivos Web con Android

```bash
# Copia los archivos compilados al proyecto Android
npx cap sync android
```

### Paso 5: Abrir en Android Studio

```bash
# Abre el proyecto Android en Android Studio
npx cap open android
```

**Espera a que Android Studio:**
- Indexe todos los archivos (puede tardar 2-5 minutos)
- Descargue dependencias de Gradle
- Sincronice el proyecto

### Paso 6: Ejecutar en Dispositivo/Emulador

#### Opción A: Dispositivo Físico

```bash
# 1. Conecta tu dispositivo Android por USB
# 2. Acepta el permiso de depuración en el dispositivo
# 3. En Android Studio, selecciona tu dispositivo en la barra superior
# 4. Click en el botón ▶️ (Run) o presiona Shift+F10
```

#### Opción B: Emulador

```bash
# 1. En Android Studio, abre Device Manager
# 2. Inicia un dispositivo virtual
# 3. Selecciona el emulador en la barra superior
# 4. Click en ▶️ (Run) o presiona Shift+F10
```

### Paso 7: Probar la Aplicación

Una vez instalada en tu dispositivo/emulador:

1. **Login:**
   - Admin: `admin@drumpro.com` / cualquier contraseña
   - Profesor: `carlos@drumpro.com` / cualquier contraseña
   - Alumno: `juan@drumpro.com` / cualquier contraseña

2. **Explora las funcionalidades:**
   - Panel de administrador
   - Panel de profesor (clases, tareas, evaluaciones)
   - Panel de alumno (tareas, clases, biblioteca, multitrack, progreso)
   - Metrónomo
   - Videollamada
   - Grabación de video para redes sociales

## 📦 Generar APK para Instalación

### APK de Desarrollo (Debug)

```bash
# En Android Studio:
# 1. Menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
# 2. Espera a que termine (1-2 minutos)
# 3. Click en "locate" para encontrar el APK
# 4. El APK estará en: android/app/build/outputs/apk/debug/app-debug.apk
```

**Instalar en dispositivo:**
```bash
# Copia el APK a tu dispositivo y ábrelo
# O usa adb:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### APK Firmado (Release)

Para distribuir la app, necesitas un APK firmado:

#### 1. Crear Keystore

```bash
# Navega al directorio android/
cd android

# Genera el keystore
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload

# Te pedirá:
# - Contraseña del keystore (anótala)
# - Información personal (puedes poner datos ficticios)
```

#### 2. Configurar Firma en build.gradle

Edita `android/app/build.gradle` y agrega:

```gradle
android {
    // ... configuración existente ...
    
    signingConfigs {
        release {
            storeFile file('../upload-keystore.jks')
            storePassword 'TU_CONTRASEÑA_AQUI'
            keyAlias 'upload'
            keyPassword 'TU_CONTRASEÑA_AQUI'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 3. Generar APK Firmado

```bash
# En Android Studio:
# 1. Menu: Build → Generate Signed Bundle / APK
# 2. Selecciona "APK"
# 3. Selecciona el keystore que creaste
# 4. Ingresa las contraseñas
# 5. Selecciona "release"
# 6. Click en "Finish"
# 7. El APK estará en: android/app/build/outputs/apk/release/app-release.apk
```

## 🔄 Flujo de Desarrollo Rápido

Cuando hagas cambios en el código web:

```bash
# 1. Compila los cambios
npm run build

# 2. Sincroniza con Android
npx cap sync android

# 3. En Android Studio, ejecuta la app nuevamente
# (Shift+F10 o click en ▶️)
```

## 🐛 Debugging

### Ver Logs en Tiempo Real

```bash
# Con el dispositivo conectado:
adb logcat | grep -E "Capacitor|Console|chromium"

# O en Android Studio:
# View → Tool Windows → Logcat
```

### Inspeccionar Elementos Web

```bash
# 1. Conecta tu dispositivo por USB
# 2. Abre Chrome en tu computadora
# 3. Ve a: chrome://inspect/#devices
# 4. Selecciona tu dispositivo y la app
# 5. Se abrirá DevTools para inspeccionar
```

### Errores Comunes

**Error: "SDK location not found"**
```bash
# Crea el archivo android/local.properties
echo "sdk.dir=/Users/TU_USUARIO/Library/Android/sdk" > android/local.properties
# (Ajusta la ruta según tu sistema operativo)
```

**Error: "Gradle sync failed"**
```bash
# En Android Studio:
# File → Sync Project with Gradle Files
```

**Error: "App se cierra al abrir"**
```bash
# Verifica los logs:
adb logcat | grep -E "FATAL|ERROR"

# Asegúrate de haber ejecutado:
npm run build
npx cap sync android
```

## 📱 Características Específicas de Android

### Permisos Requeridos

La app solicita los siguientes permisos:

- **Cámara**: Para grabación de video (tareas, redes sociales)
- **Micrófono**: Para grabación de audio (tareas, evaluación de tiempo)
- **Almacenamiento**: Para guardar videos/audios
- **Internet**: Para sincronización con Supabase

### Optimizaciones Android

- **Tema oscuro**: Configurado por defecto
- **Status bar**: Integrada con el tema de la app
- **Splash screen**: Pantalla de carga personalizada
- **Orientación**: Bloqueada en vertical (portrait)
- **Pantalla completa**: Optimizada para móviles

## 📊 Tamaño de la App

- **APK Debug**: ~15-20 MB
- **APK Release**: ~10-15 MB (con optimizaciones)
- **Datos instalados**: ~50-100 MB

## 🎯 Próximos Pasos

Una vez que tengas la app funcionando en tu dispositivo:

1. **Prueba todas las funcionalidades:**
   - Login con los 3 roles
   - Crear clases, tareas, evaluaciones
   - Grabar videos de tareas
   - Usar el metrónomo
   - Explorar la biblioteca
   - Probar el multitrack player
   - Grabar video para redes sociales

2. **Reporta bugs o mejoras:**
   - Toma capturas de pantalla
   - Describe el problema
   - Incluye los logs si es necesario

3. **Prepara para publicación:**
   - Genera APK firmado
   - Crea iconos de la app
   - Prepara capturas para Google Play
   - Escribe descripción y screenshots

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs:**
   ```bash
   adb logcat | grep -E "Capacitor|ERROR|FATAL"
   ```

2. **Limpia y reconstruye:**
   ```bash
   npm run build
   npx cap sync android
   ```

3. **Limpia el proyecto Android:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx cap sync android
   ```

4. **Verifica la documentación:**
   - [Capacitor Docs](https://capacitorjs.com/docs)
   - [Android Setup](https://capacitorjs.com/docs/android)

## ✅ Checklist Final

- [ ] Node.js instalado (v18+)
- [ ] Android Studio instalado
- [ ] Java JDK 17 instalado
- [ ] Dispositivo Android o emulador configurado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto compilado (`npm run build`)
- [ ] Capacitor instalado y configurado
- [ ] Proyecto Android sincronizado (`npx cap sync`)
- [ ] App ejecutándose en dispositivo/emulador
- [ ] Todas las funcionalidades probadas

---

**¡Listo para probar DrumPro Academy en tu Android! 🥁📱**
