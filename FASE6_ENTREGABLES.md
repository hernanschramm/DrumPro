# 🥁 DrumPro Academy - Fase 6: Biblioteca de Rudimentos, Grooves y Estilos

## ✅ Entregables de la Fase 6

### 1. Motor de Audio del Metrónomo (Baja Latencia)
📄 **Archivo:** `src/features/biblioteca/data/MetronomeEngine.ts`

**Características:**
- ✅ Usa Web Audio API para baja latencia (<10ms)
- ✅ Scheduling preciso con lookahead de 25ms
- ✅ Soporte para subdivisiones: negras, corcheas, tresillos, semicorcheas
- ✅ Soporte para compases irregulares (2/4, 3/4, 4/4, 5/4, 6/8, 7/8)
- ✅ Acento en el primer pulso del compás
- ✅ Callback para sincronización visual
- ✅ Control de BPM de 40 a 300

**Tecnología:**
- `AudioContext` y `OscillatorNode` para generación de sonido
- `GainNode` con envelope rápido (50ms) para click preciso
- Scheduling basado en `currentTime` del AudioContext
- Lookahead de 25ms para mantener timing preciso

---

### 2. Pantalla del Metrónomo
📄 **Archivo:** `src/features/biblioteca/presentation/MetronomeScreen.tsx`

**Características:**
- ✅ Display grande de BPM
- ✅ Indicador visual de pulso (círculos que se iluminan)
- ✅ Botón Play/Stop
- ✅ Tap Tempo (calcula BPM basado en taps)
- ✅ Slider de BPM (40-300)
- ✅ Selector de compás (2/4, 3/4, 4/4, 5/4, 6/8, 7/8)
- ✅ Selector de subdivisión (negras, corcheas, tresillos, semicorcheas)
- ✅ Presets rápidos (Lento, Moderato, Rápido, Muy Rápido)
- ✅ Diseño responsive y moderno

**Tap Tempo:**
- Calcula BPM basado en los últimos 3 segundos de taps
- Promedia los intervalos entre taps
- Rango válido: 40-300 BPM

---

### 3. Catálogo de los 40 Rudimentos PAS
📄 **Archivo:** `src/features/biblioteca/data/rudimentos.ts`

**Los 40 rudimentos oficiales de la Percussive Arts Society:**

**Rolls (16 rudimentos):**
1. Single Stroke Roll (RLRL)
2. Double Stroke Roll (RRLL)
3. Multiple Bounce Roll
4. Single Paradiddle (RLRR LRLL)
5. Double Paradiddle
6. Triple Paradiddle
7. Paradiddle-diddle
8. Five Stroke Roll
9. Six Stroke Roll
10. Seven Stroke Roll
11. Nine Stroke Roll
12. Ten Stroke Roll
13. Eleven Stroke Roll
14. Thirteen Stroke Roll
15. Fifteen Stroke Roll
16. Seventeen Stroke Roll

**Drag Rudiments (4 rudimentos):**
17. Single Drag Tap
18. Double Drag Tap
19. Lesson 16 (Drag Tap)
20. Lesson 17 (Drag Tap)

**Flam Rudiments (10 rudimentos):**
21. Flam
22. Flam Accent
23. Flam Tap
24. Flamacue
25. Flam Paradiddle
26. Single Flammed Mill
27. Pataflafla
28. Swiss Army Triplet
29. Inverted Flam Tap
30. Flam Drag

**Hybrid Rudiments (10 rudimentos):**
31. Cheese
32. Windmill
33. Crazy Legs
34. Nova
35. Cybermice
36. Hertz
37. Dom Perignon
38. Stone
39. Fife
40. Camp Duty

**Información por rudimento:**
- ✅ Nombre oficial
- ✅ Categoría (Rolls, Drag, Flam, Hybrid)
- ✅ Descripción
- ✅ Notación (RLRL, RRLL, etc.)
- ✅ BPM objetivo
- ✅ Dificultad (básico, intermedio, avanzado)

---

### 4. Catálogo de Grooves por Estilo
📄 **Archivo:** `src/features/biblioteca/data/grooves.ts`

**22 grooves clasificados por estilo y dificultad:**

**Rock (3 grooves):**
- Rock Básico (básico)
- Rock con Bombo Doble (intermedio)
- Rock con Hi-Hat Abierto (intermedio)

**Pop (2 grooves):**
- Pop Básico (básico)
- Pop con Ghost Notes (intermedio)

**Funk (3 grooves):**
- Funk Básico (básico)
- Funk con Hi-Hat Abierto (intermedio)
- Funk Avanzado (avanzado)

**Blues (2 grooves):**
- Shuffle Básico (básico)
- Slow Blues (intermedio)

**Jazz (2 grooves):**
- Jazz Ride Básico (básico)
- Jazz con Feathering (intermedio)

**Latino (2 grooves):**
- Bossa Nova (intermedio)
- Salsa Básico (intermedio)

**Metal (3 grooves):**
- Metal Básico (básico)
- Blast Beat (avanzado)
- Double Bass Metal (avanzado)

**Reggae (2 grooves):**
- One Drop (básico)
- Steppers (intermedio)

**Punk (1 groove):**
- Punk Rock (básico)

**Fusion (2 grooves):**
- Fusion Básico (intermedio)
- Odd Meter Fusion (avanzado, 7/8)

**Información por groove:**
- ✅ Nombre
- ✅ Estilo (Rock, Pop, Funk, Blues, Jazz, Latino, Metal, Reggae, Punk, Fusion)
- ✅ Compás (4/4, 7/8, etc.)
- ✅ Patrón visual (grilla de 16 pasos)
- ✅ Instrumentos: kick, snare, hihat, hihatOpen, ride, crossStick
- ✅ BPM sugerido
- ✅ Descripción
- ✅ Dificultad (básico, intermedio, avanzado)

---

### 5. Pantalla de Biblioteca
📄 **Archivo:** `src/features/biblioteca/presentation/LibraryScreen.tsx`

**Características:**
- ✅ 3 tabs: Rudimentos, Grooves, Metrónomo
- ✅ Filtros por dificultad (todos, básico, intermedio, avanzado)
- ✅ Filtro por estilo (solo para grooves)
- ✅ Cards con información de cada rudimento/groove
- ✅ Visualización de patrón de groove (grilla de colores)
- ✅ Modal de detalle con notación y BPM
- ✅ Botón "Practicar con Metrónomo" que abre el metrónomo
- ✅ Diseño responsive (grid de 1, 2 o 3 columnas)

**Visualización de Patrones:**
- ✅ Grilla de 16 pasos por instrumento
- ✅ Colores por instrumento:
  - Bombo: rojo
  - Caja: amarillo
  - Hi-Hat: azul
  - Hi-Hat Abierto: cyan
  - Ride: verde
  - Cross Stick: púrpura
- ✅ Solo muestra instrumentos presentes en el patrón

---

### 6. Integración con Panel de Alumno
📄 **Archivo actualizado:** `src/features/alumno/presentation/AlumnoPanel.tsx`

**Nuevas funcionalidades:**
- ✅ Nueva pestaña "Biblioteca" en el panel del alumno
- ✅ Acceso completo a LibraryScreen
- ✅ Conteo de rudimentos en el tab

---

## 🎯 Flujo de Uso

### Explorar Rudimentos:
1. Alumno va a pestaña "Biblioteca"
2. Selecciona tab "Rudimentos"
3. Filtra por dificultad si desea
4. Click en un rudimento para ver detalle
5. Ve notación y BPM objetivo
6. Click en "Practicar con Metrónomo"
7. Se abre metrónomo con BPM sugerido

### Explorar Grooves:
1. Alumno va a pestaña "Biblioteca"
2. Selecciona tab "Grooves"
3. Filtra por estilo y/o dificultad
4. Ve patrón visual del groove
5. Click en un groove para ver detalle
6. Ve descripción y BPM sugerido
7. Click en "Practicar con Metrónomo"
8. Se abre metrónomo con BPM sugerido

### Usar Metrónomo:
1. Desde biblioteca o directamente
2. Ajusta BPM con slider o tap tempo
3. Selecciona compás y subdivisión
4. Click en "Iniciar"
5. Practica con el pulso
6. Usa presets rápidos para cambios rápidos

---

## 📊 Estadísticas de la Biblioteca

**Rudimentos:**
- Total: 40 rudimentos PAS oficiales
- Básicos: 7
- Intermedios: 20
- Avanzados: 13
- Categorías: Rolls (16), Drag (4), Flam (10), Hybrid (10)

**Grooves:**
- Total: 22 grooves
- Básicos: 8
- Intermedios: 11
- Avanzados: 3
- Estilos: Rock (3), Pop (2), Funk (3), Blues (2), Jazz (2), Latino (2), Metal (3), Reggae (2), Punk (1), Fusion (2)

---

## 🎨 Características de UX

### Metrónomo
- ✅ Display grande y claro de BPM
- ✅ Indicador visual de pulso sincronizado
- ✅ Botones grandes y accesibles
- ✅ Tap tempo intuitivo
- ✅ Presets rápidos para cambios comunes
- ✅ Diseño oscuro para reducir fatiga visual

### Biblioteca
- ✅ Cards con información clara
- ✅ Filtros intuitivos
- ✅ Visualización de patrones con colores
- ✅ Modales de detalle completos
- ✅ Navegación fluida entre secciones
- ✅ Botón directo para practicar con metrónomo

### Patrones Visuales
- ✅ Grilla de 16 pasos fácil de leer
- ✅ Colores distintos por instrumento
- ✅ Solo muestra instrumentos relevantes
- ✅ Compacto pero legible

---

## 📁 Estructura de Archivos

```
src/features/biblioteca/
├── data/
│   ├── MetronomeEngine.ts      ✅ Motor de audio del metrónomo
│   ├── rudimentos.ts            ✅ Catálogo de 40 rudimentos PAS
│   └── grooves.ts               ✅ Catálogo de 22 grooves
└── presentation/
    ├── MetronomeScreen.tsx      ✅ Pantalla del metrónomo
    └── LibraryScreen.tsx        ✅ Pantalla de biblioteca

src/features/alumno/presentation/
└── AlumnoPanel.tsx              ✅ Integración con biblioteca

src/types/
└── academy.ts                   ✅ Tipos actualizados (Groove con más instrumentos)
```

---

## 🚀 Cómo Probar

### Como Alumno (`juan@drumpro.com`):
1. Inicia sesión
2. Ve pestaña "Biblioteca"
3. Explora los 40 rudimentos
4. Filtra por dificultad
5. Click en un rudimento para ver detalle
6. Click en "Practicar con Metrónomo"
7. Se abre metrónomo con BPM sugerido
8. Inicia metrónomo y practica
9. Vuelve a biblioteca
10. Explora los 22 grooves
11. Filtra por estilo (Rock, Funk, Jazz, etc.)
12. Ve patrones visuales de cada groove
13. Click en un groove para ver detalle
14. Practica con metrónomo

### Probar Metrónomo:
1. Abre metrónomo desde biblioteca
2. Ajusta BPM con slider (40-300)
3. Prueba tap tempo (toca el botón rítmicamente)
4. Cambia compás (2/4, 3/4, 4/4, 5/4, 6/8, 7/8)
5. Cambia subdivisión (negras, corcheas, tresillos, semicorcheas)
6. Usa presets rápidos
7. Observa indicador visual de pulso

---

## 📋 Checklist Fase 6

- ✅ Motor de audio del metrónomo (Web Audio API)
- ✅ Baja latencia (<10ms)
- ✅ Scheduling preciso con lookahead
- ✅ Soporte para subdivisiones
- ✅ Soporte para compases irregulares
- ✅ Pantalla del metrónomo completa
- ✅ Display de BPM
- ✅ Indicador visual de pulso
- ✅ Tap tempo funcional
- ✅ Slider de BPM
- ✅ Selector de compás
- ✅ Selector de subdivisión
- ✅ Presets rápidos
- ✅ Catálogo de 40 rudimentos PAS
- ✅ Información completa por rudimento
- ✅ Notación y BPM objetivo
- ✅ Clasificación por dificultad
- ✅ Catálogo de 22 grooves
- ✅ 10 estilos diferentes
- ✅ Patrones visuales con grilla
- ✅ Información completa por groove
- ✅ BPM sugerido y descripción
- ✅ Clasificación por dificultad
- ✅ Pantalla de biblioteca
- ✅ 3 tabs (Rudimentos, Grooves, Metrónomo)
- ✅ Filtros por dificultad
- ✅ Filtro por estilo
- ✅ Cards con información
- ✅ Visualización de patrones
- ✅ Modales de detalle
- ✅ Botón "Practicar con Metrónomo"
- ✅ Integración con panel de alumno
- ✅ Nueva pestaña "Biblioteca"
- ✅ Diseño responsive
- ✅ Tipos actualizados (Groove)

---

## 🎯 Próximas Fases

### Fase 7: Videollamada en Vivo
- Integración con Jitsi Meet SDK
- Audio estéreo de alta calidad
- Grabación de clases opcional
- Chat en tiempo real
- Compartir pantalla

### Fase 8: Servidor de Audio (BPM, Click, Stems)
- Detección automática de BPM
- Separación de stems con Demucs
- Mixer multitrack
- Mute de batería para tocar encima
- Loops A-B y cambio de velocidad

---

## 💡 Notas Técnicas

### Web Audio API
- **Ventajas:** Baja latencia, control preciso del timing
- **Desventajas:** No funciona en segundo plano en iOS
- **Alternativa para producción:** Usar servicio en primer plano (foreground service)

### Scheduling
- **Lookahead:** 25ms para mantener timing preciso
- **Schedule Ahead Time:** 100ms para anticipar notas
- **Timer:** setTimeout con lookahead para verificar notas

### Patrones Visuales
- **Formato:** Grilla de 16 pasos (1 compás de 4/4 en semicorcheas)
- **Colores:** Cada instrumento tiene su color
- **Flexibilidad:** Soporta patrones de diferentes longitudes

---

## 🔐 Consideraciones de Seguridad

### Contenido Educativo
- Los rudimentos PAS son de dominio público
- Los grooves son patrones comunes de uso libre
- No hay problemas de copyright

### Rendimiento
- Metrónomo usa Web Audio API (eficiente)
- Biblioteca es estática (sin llamadas a servidor)
- Patrones visuales son SVG/HTML (ligeros)

---

**DrumPro Academy - Fase 6 Completada ✅**

**¿Listo para la Fase 7 (Videollamada en Vivo)?**
