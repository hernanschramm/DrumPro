# 🥁 DrumPro Academy - Guía RÁPIDA para APK

## ⚡ GENERAR APK EN 30 SEGUNDOS

```bash
# UN SOLO COMANDO:
chmod +x generar-apk.sh && ./generar-apk.sh
```

**¡Eso es todo!** Espera 3-5 minutos y tendrás tu APK.

---

## 📱 INSTALAR APK

### Opción 1: Por USB (Más rápido)
```bash
adb install DrumProAcademy.apk
```

### Opción 2: Transferir archivo
1. Copia `DrumProAcademy.apk` a tu celular
2. Ábrelo en el celular
3. Permite instalación
4. ¡Listo!

---

## 🎮 PROBAR LA APP

**Credenciales:**
- Admin: `admin@drumpro.com` / cualquier contraseña
- Profesor: `carlos@drumpro.com` / cualquier contraseña  
- Alumno: `juan@drumpro.com` / cualquier contraseña

---

## ❓ PROBLEMAS?

### "SDK location not found"
```bash
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
```

### "App se cierra"
```bash
npm run build && npx cap sync android
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- **Guía detallada:** [COMO_GENERAR_APK.md](COMO_GENERAR_APK.md)
- **Guía Android completa:** [GUIA_ANDROID.md](GUIA_ANDROID.md)
- **Resumen del proyecto:** [RESUMEN_PROYECTO.md](RESUMEN_PROYECTO.md)

---

**🎉 ¡Tu APK está listo!**
