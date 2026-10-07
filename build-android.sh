#!/bin/bash

# ============================================================
# DrumPro - Script de build completo para Android
# Ejecutar: bash build-android.sh
# ============================================================

set -e  # Detener en caso de error

echo "🥁 DrumPro - Build para Android"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paso 1: Verificar dependencias
echo -e "${YELLOW}[1/6] Verificando dependencias...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java no está instalado${NC}"
    echo "Instala JDK 17: https://adoptium.net/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ Java: $(java --version | head -1)${NC}"
echo ""

# Paso 2: Instalar dependencias npm
echo -e "${YELLOW}[2/6] Instalando dependencias npm...${NC}"
npm install
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Paso 3: Compilar app web
echo -e "${YELLOW}[3/6] Compilando app web...${NC}"
npm run build
echo -e "${GREEN}✅ App web compilada en dist/${NC}"
echo ""

# Paso 4: Verificar si existe carpeta android
if [ ! -d "android" ]; then
    echo -e "${YELLOW}[4/6] Agregando plataforma Android...${NC}"
    npx cap add android
    echo -e "${GREEN}✅ Plataforma Android agregada${NC}"
else
    echo -e "${YELLOW}[4/6] Plataforma Android ya existe${NC}"
fi
echo ""

# Paso 5: Sincronizar archivos
echo -e "${YELLOW}[5/6] Sincronizando archivos con Android...${NC}"
npx cap sync android
echo -e "${GREEN}✅ Archivos sincronizados${NC}"
echo ""

# Paso 6: Abrir en Android Studio
echo -e "${YELLOW}[6/6] Abriendo en Android Studio...${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ ¡Listo! Android Studio se abrirá ahora${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Próximos pasos en Android Studio:"
echo "1. Espera a que termine de indexar (barra inferior)"
echo "2. Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "3. El APK estará en: android/app/build/outputs/apk/debug/"
echo ""
echo -e "${YELLOW}Para APK firmado (Google Play):${NC}"
echo "1. Build → Generate Signed Bundle / APK"
echo "2. Selecciona APK o Android App Bundle"
echo "3. Usa tu keystore de firma"
echo ""

npx cap open android
