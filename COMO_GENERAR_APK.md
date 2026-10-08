# 🚀 Genera tu APK en 5 PASOS

## ⚡ Método RÁPIDO (Recomendado)

```bash
# UN SOLO COMANDO:
chmod +x generar-apk.sh && ./generar-apk.sh
```

**¡Eso es todo!** El script hace TODO automáticamente.

Al terminar, tendrás el archivo `DrumProAcademy.apk` en la raíz del proyecto.

---

## 📋 Método MANUAL (Si prefieres control total)

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Compilar la app
```bash
npm run build
```

### Paso 3: Agregar plataforma Android
```bash
npx cap add android
```

### Paso 4: Sincronizar archivos
```bash
npx cap sync android
```

### Paso 5: Generar APK
```bash
cd android
./gradlew assembleDebug
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk .
```

**¡Listo!** Tu APK está en `./app-debug.apk`

---

## 📱 Instalar en tu Android

### Opción A: Por USB
```bash
# Conecta tu celular por USB
adb install DrumProAcademy.apk
```

### Opción B: Transferir archivo
1. Copia `DrumProAcademy.apk` a tu celular
2. Ábrelo desde el administrador de archivos
3. Permite "Instalar desde fuentes desconocidas"
4. Toca "Instalar"

### Opción C: Por email/cloud
1. Sube el APK a Google Drive, Dropbox, etc.
2. Descárgalo en tu celular
3. Ábrelo e instálalo

---

## 🎮 Probar la App

**Credenciales de prueba:**

| Rol | Email | Contraseña |
|-----|-------|------------|
| 👤 Admin | `admin@drumpro.com` | cualquiera |
| 🎓 Profesor | `carlos@drumpro.com` | cualquiera |
| 🎵 Alumno | `juan@drumpro.com` | cualquiera |

---

## ❓ Problemas Comunes

### "SDK location not found"
```bash
# Crea el archivo android/local.properties
echo "sdk.dir=/Users/TU_USUARIO/Library/Android/sdk" > android/local.properties
```

### "Gradle sync failed"
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### "App se cierra al abrir"
```bash
# Reconstruye todo
npm run build
npx cap sync android
cd android
./gradlew clean assembleDebug
```

---

## 📦 ¿Qué hace el script?

El script `generar-apk.sh` automáticamente:
1. ✅ Verifica que Node.js esté instalado
2. ✅ Instala todas las dependencias
3. ✅ Compila la app web optimizada
4. ✅ Configura el proyecto Android con Capacitor
5. ✅ Sincroniza los archivos web con Android
6. ✅ Genera el APK debug
7. ✅ Copia el APK a la raíz del proyecto

**Tiempo estimado:** 3-5 minutos (depende de tu conexión)

---

## 🎯 Requisitos Previos

Antes de ejecutar el script, necesitas:

1. **Node.js 18+** → https://nodejs.org/
2. **Android Studio** → https://developer.android.com/studio
3. **Java JDK 17** → Incluido con Android Studio

**Verificar instalación:**
```bash
node --version    # Debe mostrar v18+
java --version    # Debe mostrar 17+
```

---

## 🔧 Después de Generar el APK

### Probar en emulador
```bash
npx cap open android
# En Android Studio: Run ▶️
```

### Probar en dispositivo real
```bash
# Conecta tu celular por USB
adb devices
adb install DrumProAcademy.apk
```

### Ver logs en tiempo real
```bash
adb logcat | grep -E "Capacitor|Console"
```

---

## 📊 Información del APK

- **Tamaño:** ~15-20 MB
- **Versión:** 1.0.0
- **Mínimo Android:** 7.0 (API 24)
- **Target:** Android 14 (API 34)
- **Arquitectura:** Universal (armeabi-v7a, arm64-v8a, x86, x86_64)

---

## 🎉 ¡Eso es todo!

Ahora tienes tu APK listo para instalar en cualquier dispositivo Android.

**¿Problemas?** Revisa la [guía completa](GUIA_ANDROID.md)

**¿Quieres publicar en Google Play?** Lee [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)

---

**🥁 DrumPro Academy - Tu plataforma de enseñanza de batería**
