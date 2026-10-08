#!/bin/bash

# ============================================================
# 🥁 DrumPro Academy - Script ONE-CLICK para generar APK
# ============================================================
# Este script hace TODO automáticamente:
# 1. Instala dependencias
# 2. Compila la app web
# 3. Configura Capacitor
# 4. Genera el proyecto Android
# 5. Compila el APK
# ============================================================

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🥁 DrumPro Academy - Generador de APK Android        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}[1/6]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Descarga Node.js desde: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo ""

# Instalar dependencias
echo -e "${BLUE}[2/6]${NC} Instalando dependencias..."
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Compilar app web
echo -e "${BLUE}[3/6]${NC} Compilando aplicación web..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al compilar${NC}"
    exit 1
fi
echo -e "${GREEN}✅ App web compilada${NC}"
echo ""

# Verificar si ya existe carpeta android
echo -e "${BLUE}[4/6]${NC} Configurando proyecto Android..."
if [ ! -d "android" ]; then
    npx cap add android
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al agregar Android${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Proyecto Android creado${NC}"
else
    echo -e "${GREEN}✅ Proyecto Android ya existe${NC}"
fi
echo ""

# Sincronizar archivos
echo -e "${BLUE}[5/6]${NC} Sincronizando archivos..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al sincronizar${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Archivos sincronizados${NC}"
echo ""

# Generar APK
echo -e "${BLUE}[6/6]${NC} Generando APK..."
cd android

# Limpiar build anterior
./gradlew clean

# Generar APK debug
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al generar APK${NC}"
    exit 1
fi

cd ..

# Copiar APK a raíz del proyecto
cp android/app/build/outputs/apk/debug/app-debug.apk DrumProAcademy.apk

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ ¡APK GENERADO EXITOSAMENTE!                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}📱 APK disponible en:${NC}"
echo -e "${YELLOW}   ./DrumProAcademy.apk${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo "   1. Copia el archivo DrumProAcademy.apk a tu celular"
echo "   2. Ábrelo en tu celular"
echo "   3. Permite la instalación de fuentes desconocidas"
echo "   4. ¡Disfruta DrumPro Academy!"
echo ""
echo -e "${BLUE}🔐 Credenciales de prueba:${NC}"
echo "   Admin:    admin@drumpro.com"
echo "   Profesor: carlos@drumpro.com"
echo "   Alumno:   juan@drumpro.com"
echo "   (Cualquier contraseña funciona)"
echo ""
