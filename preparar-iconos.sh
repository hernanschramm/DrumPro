#!/bin/bash

# ============================================================
# 🥁 Script para preparar iconos de Android
# ============================================================

echo "🎨 Generando iconos para Android..."

# Crear directorios de iconos
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Verificar si ImageMagick está instalado
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick detectado"
    
    # Usar el icono SVG y convertirlo a diferentes tamaños
    if [ -f "public/icon.svg" ]; then
        convert -background none public/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
        convert -background none public/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
        convert -background none public/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
        convert -background none public/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
        convert -background none public/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
        
        # Icono redondo
        convert -background none public/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
        convert -background none public/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
        convert -background none public/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
        convert -background none public/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
        convert -background none public/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
        
        echo "✅ Iconos generados correctamente"
    else
        echo "⚠️  No se encontró public/icon.svg"
        echo "Usando icono por defecto de Android"
    fi
else
    echo "⚠️  ImageMagick no está instalado"
    echo "Los iconos por defecto de Android serán usados"
    echo ""
    echo "Para generar iconos personalizados, instala ImageMagick:"
    echo "  - macOS: brew install imagemagick"
    echo "  - Ubuntu: sudo apt-get install imagemagick"
    echo "  - Windows: https://imagemagick.org/script/download.php"
fi

echo "✅ Preparación de iconos completada"
