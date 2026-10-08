#!/bin/bash

# Script para descargar los iconos de DrumPro
# Ejecutar: bash download-icons.sh

echo "📥 Descargando iconos de DrumPro..."

# Icono 512x512
curl -o "public/icon-512.png" "https://image.qwenlm.ai/generated-images/b7555ef1-f7d4-4ae2-a90b-6936537b4692/_result.png"

# Icono 192x192 (usamos el mismo, el navegador lo redimensiona)
curl -o "public/icon-192.png" "https://image.qwenlm.ai/generated-images/b7555ef1-f7d4-4ae2-a90b-6936537b4692/_result.png"

echo "✅ Iconos descargados en public/"
echo ""
echo "Siguiente paso: npx cap add android"
