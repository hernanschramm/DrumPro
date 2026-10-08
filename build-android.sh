#!/bin/bash

# ============================================================
# DrumPro Academy - Script de Build para Android
# ============================================================

echo "🥁 DrumPro Academy - Build para Android"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar dependencias
echo -e "${YELLOW}[1/6] Verificando dependencias...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
echo ""

# Instalar dependencias
echo -e "${YELLOW}[2/6] Instalando dependencias...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Compilar aplicación web
echo -e "${YELLOW}[3/6] Compilando aplicación web...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al compilar${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Aplicación compilada${NC}"
echo ""

# Verificar si Capacitor está instalado
echo -e "${YELLOW}[4/6] Verificando Capacitor...${NC}"
if [ ! -d "node_modules/@capacitor/android" ]; then
    echo "Instalando Capacitor..."
    npm install @capacitor/core @capacitor/android
    npx cap add android
fi
echo -e "${GREEN}✅ Capacitor configurado${NC}"
echo ""

# Sincronizar archivos
echo -e "${YELLOW}[5/6] Sincronizando archivos con Android...${NC}"
npx cap sync android
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al sincronizar${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Archivos sincronizados${NC}"
echo ""

# Abrir en Android Studio
echo -e "${YELLOW}[6/6] Abriendo en Android Studio...${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ ¡Listo! Android Studio se abrirá ahora${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Espera a que Android Studio indexe los archivos"
echo "2. Conecta tu dispositivo Android o inicia un emulador"
echo "3. Selecciona el dispositivo en la barra superior"
echo "4. Click en ▶️ (Run) o presiona Shift+F10"
echo ""
echo "Para generar APK:"
echo "  Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo ""

npx cap open android
