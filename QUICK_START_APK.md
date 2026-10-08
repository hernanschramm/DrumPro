# 🚀 Guía Rápida: De Web a APK Android

## Paso 1: Generar los iconos (opcional pero recomendado)

Abre en tu navegador:
```
public/generate-icons.html
```

Descarga los 3 iconos y guárdalos en la carpeta `public/`:
- `icon-512.png`
- `icon-192.png`
- `feature-graphic.png` (para Google Play)

## Paso 2: Compilar la app

```bash
npm run build
```

## Paso 3: Agregar plataforma Android

```bash
npx cap add android
```

Esto crea la carpeta `android/` con el proyecto nativo.

## Paso 4: Sincronizar archivos

```bash
npx cap sync android
```

Esto copia los archivos compilados de `dist/` al proyecto Android.

## Paso 5: Abrir en Android Studio

```bash
npx cap open android
```

Android Studio se abrirá con el proyecto.

## Paso 6: Generar APK de prueba (debug)

En Android Studio:
1. Espera a que termine de indexar (barra inferior)
2. Menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Espera a que termine (1-2 minutos)
4. Click en "locate" para encontrar el APK
5. El archivo estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Paso 7: Probar en tu dispositivo

### Opción A: USB
1. Activa "Modo desarrollador" en tu Android (7 clicks en "Número de compilación")
2. Activa "Depuración USB"
3. Conecta por USB
4. En Android Studio: selecciona tu dispositivo y click en ▶️ (Run)

### Opción B: Transferir APK
1. Copia el archivo `app-debug.apk` a tu móvil
2. Ábrelo desde el explorador de archivos
3. Permite "Instalar desde fuentes desconocidas"
4. Instala y prueba

## Paso 8: Generar APK firmado (para Google Play)

### Crear keystore de firma

```bash
cd android
keytool -genkey -v -keystore drumpro-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias drumpro
```

Te pedirá:
- Contraseña del keystore (anótala)
- Nombre y organización (puedes poner datos ficticios)

### Configurar firma

Edita `android/app/build.gradle` y agrega:

```gradle
android {
    // ... configuración existente ...
    
    signingConfigs {
        release {
            storeFile file('../drumpro-key.jks')
            storePassword 'TU_CONTRASEÑA_AQUI'
            keyAlias 'drumpro'
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

### Generar APK firmado

En Android Studio:
1. Menu: **Build** → **Generate Signed Bundle / APK**
2. Selecciona **APK** → Next
3. Selecciona el keystore `drumpro-key.jks`
4. Ingresa las contraseñas
5. Selecciona **release**
6. Click **Finish**
7. El APK firmado estará en: `android/app/build/outputs/apk/release/app-release.apk`

### Generar AAB para Google Play

En Android Studio:
1. Menu: **Build** → **Generate Signed Bundle / APK**
2. Selecciona **Android App Bundle** → Next
3. Usa el mismo keystore
4. Selecciona **release**
5. Click **Finish**
6. El AAB estará en: `android/app/build/outputs/bundle/release/app-release.aab`

## Paso 9: Subir a Google Play

1. Ve a [Google Play Console](https://play.google.com/console)
2. Crea una nueva app
3. Sube el archivo `.aab`
4. Completa la ficha de la tienda (ver ANDROID_BUILD_GUIDE.md)
5. Envía para revisión

## ⚠️ Problemas comunes

### "SDK location not found"
Crea el archivo `android/local.properties`:
```
sdk.dir=/Users/TU_USUARIO/Library/Android/sdk
```
(En Windows: `sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk`)

### "Gradle sync failed"
- Asegúrate de tener Android Studio actualizado
- File → Sync Project with Gradle Files

### "minSdkVersion 24 cannot be smaller than version X"
Actualiza `android/variables.gradle`:
```gradle
ext {
    minSdkVersion = 24
    compileSdkVersion = 34
    targetSdkVersion = 34
}
```

### App se cierra al abrir
- Verifica que `npm run build` se ejecutó correctamente
- Ejecuta `npx cap sync android` nuevamente
- Revisa los logs con: `adb logcat | grep Capacitor`

## 📱 Comandos útiles

```bash
# Después de hacer cambios en el código web:
npm run build
npx cap sync android

# Solo copiar archivos (más rápido):
npx cap copy android

# Ver logs en tiempo real:
adb logcat | grep -i "capacitor\|chromium"

# Limpiar proyecto Android:
cd android && ./gradlew clean && cd ..
```

## ✅ Checklist antes de publicar

- [ ] Probado en al menos 3 dispositivos diferentes
- [ ] Iconos reemplazados (512x512, 192x192)
- [ ] Splash screen personalizado
- [ ] Nombre del paquete cambiado (com.drumpro.app)
- [ ] Versión actualizada en build.gradle
- [ ] Keystore de firma creado y respaldado
- [ ] APK firmado probado
- [ ] AAB generado
- [ ] Screenshots para Google Play (mínimo 2)
- [ ] Feature graphic (1024x500)
- [ ] Descripción y textos listos
- [ ] Política de privacidad (requerida por Google)

## 🎯 Siguiente versión

Después de publicar, para actualizar:

1. Incrementa `versionCode` y `versionName` en `android/app/build.gradle`
2. Haz tus cambios en el código
3. `npm run build`
4. `npx cap sync android`
5. Genera nuevo APK/AAB firmado
6. Sube a Google Play Console

---

**¡Listo! Tu app DrumPro está lista para Google Play 🥁🎵**
