# 🥁 DrumPro Academy - Fase 4: Tareas y Entregas

## ✅ Entregables de la Fase 4

### 1. Pantalla de Grabación de Video/Audio
📄 **Archivo:** `src/features/tareas/presentation/RecordScreen.tsx`

**Características:**
- ✅ Grabación REAL usando MediaRecorder API del navegador
- ✅ Modo video (cámara + micrófono) y modo solo audio
- ✅ Vista previa en tiempo real
- ✅ Timer de grabación con límite de 3 minutos
- ✅ Permisos de cámara/micrófono con manejo de errores
- ✅ Vista previa de la grabación antes de enviar
- ✅ Opción de re-grabar si no queda conforme
- ✅ Muestra duración y tamaño del archivo

**Tecnología:**
- `navigator.mediaDevices.getUserMedia()` para acceso a cámara/mic
- `MediaRecorder` API para grabación
- Formato WebM (compatible con todos los navegadores modernos)

---

### 2. Componente de Progreso de Subida
📄 **Archivo:** `src/features/tareas/presentation/UploadProgress.tsx`

**Características:**
- ✅ Simulación de compresión de video (con barra de progreso)
- ✅ Simulación de subida con progreso real
- ✅ Reintentos automáticos (hasta 3 intentos)
- ✅ Manejo de errores con mensajes claros
- ✅ Muestra tamaño original y estimado después de compresión
- ✅ Genera URL simulada de Supabase Storage al completar

**Estados:**
- 🗜️ Comprimiendo video...
- 📤 Subiendo archivo...
- ✅ Subida completada
- ❌ Error de subida (con retry)

---

### 3. Detalle de Tarea para Alumno
📄 **Archivo:** `src/features/tareas/presentation/TaskDetailAlumno.tsx`

**Características:**
- ✅ Vista completa de la tarea (título, consigna, fecha límite)
- ✅ Estado de la asignación (pendiente, entregada, aprobada, con correcciones)
- ✅ Corrección del profesor con puntaje y feedback
- ✅ Lista de entregas anteriores (intentos)
- ✅ Botón "Grabar nueva entrega" integrado
- ✅ Progreso de subida integrado
- ✅ Validación de fecha límite

**Flujo completo:**
1. Alumno ve lista de tareas
2. Click en "Ver y Entregar"
3. Se abre modal con detalle de tarea
4. Click en "Grabar nueva entrega"
5. Se abre pantalla de grabación
6. Graba video/audio
7. Ve vista previa
8. Confirma envío
9. Ve progreso de compresión y subida
10. Entrega registrada

---

### 4. Panel de Calificación del Profesor
📄 **Archivo:** `src/features/tareas/presentation/GradePanel.tsx`

**Características:**
- ✅ Rúbrica de evaluación con 5 criterios configurables:
  - Tiempo (20 pts)
  - Limpieza (20 pts)
  - Dinámica (20 pts)
  - Coordinación (20 pts)
  - Lectura (20 pts)
- ✅ Sliders para asignar puntaje por criterio
- ✅ Campo de comentario por criterio
- ✅ Cálculo automático de puntaje total
- ✅ Barra de progreso visual con colores (verde/amarillo/rojo)
- ✅ Porcentaje de logro
- ✅ Estado: Aprobada o Con correcciones
- ✅ Feedback general para el alumno

**Criterios personalizables:**
Los criterios están definidos como constantes y pueden modificarse fácilmente para adaptarse a diferentes tipos de tareas.

---

### 5. Integración con Panel de Alumno
📄 **Archivo actualizado:** `src/features/alumno/presentation/AlumnoPanel.tsx`

**Nuevas funcionalidades:**
- ✅ Click en tarea abre modal de detalle
- ✅ Botón "Ver y Entregar" para tareas pendientes
- ✅ Botón "Ver Detalle" para tareas ya entregadas
- ✅ Integración completa con RecordScreen
- ✅ Integración completa con UploadProgress
- ✅ Actualización automática del estado de la asignación
- ✅ Registro de entregas en el contexto global

---

### 6. Integración con Panel de Profesor
📄 **Archivo actualizado:** `src/features/profesor/presentation/ProfesorPanel.tsx`

**Nuevas funcionalidades:**
- ✅ Botón "Calificar" en asignaciones entregadas
- ✅ Modal de GradePanel integrado
- ✅ Calificación con rúbrica completa
- ✅ Actualización automática del estado y puntaje
- ✅ Feedback visible para el alumno

---

### 7. Estado Global Actualizado
📄 **Archivo actualizado:** `src/store/AcademyContext.tsx`

**Nuevas acciones:**
- ✅ `ADD_ENTREGA`: Registrar nueva entrega de alumno

**Seed data mejorado:**
- ✅ 2 tareas de ejemplo con fechas dinámicas
- ✅ 3 asignaciones (tarea-1 → alumno-1, tarea-2 → alumno-1 y alumno-2)
- ✅ Fechas límite en el futuro (7 y 10 días)

---

## 🎯 Flujo Completo de Trabajo

### Flujo del Alumno:
1. **Login** → Ve panel de alumno
2. **Pestaña Tareas** → Ve lista de tareas asignadas
3. **Click en tarea** → Abre modal de detalle
4. **Click en "Grabar nueva entrega"** → Abre pantalla de grabación
5. **Selecciona modo** (video o solo audio)
6. **Acepta permisos** de cámara/micrófono
7. **Graba** (máximo 3 minutos)
8. **Ve vista previa** de la grabación
9. **Confirma envío** → Inicia compresión y subida
10. **Ve progreso** de subida con barra de progreso
11. **Entrega completada** → Estado cambia a "entregada"
12. **Espera corrección** del profesor

### Flujo del Profesor:
1. **Login** → Ve panel de profesor
2. **Pestaña Tareas** → Ve lista de tareas creadas
3. **Ve asignaciones** de cada tarea
4. **Click en "Calificar"** (solo si hay entregas)
5. **Abre GradePanel** con rúbrica
6. **Evalúa cada criterio** con slider y comentario
7. **Ve puntaje total** calculado automáticamente
8. **Selecciona estado** (Aprobada o Con correcciones)
9. **Escribe feedback general**
10. **Envía calificación** → Alumno recibe notificación
11. **Alumno ve corrección** con puntaje y comentarios

---

## 📊 Datos Seed Incluídos

**2 tareas de ejemplo:**
1. **Práctica de Single Stroke Roll** (prof-1 → alumno-1) - Límite en 7 días
2. **Groove de Rock Básico** (prof-1 → alumno-1 y alumno-2) - Límite en 10 días

**3 asignaciones:**
- tarea-1 → alumno-1 (pendiente)
- tarea-2 → alumno-1 (pendiente)
- tarea-2 → alumno-2 (pendiente)

---

## 🔧 Características Técnicas

### Grabación de Video/Audio
- **API:** MediaRecorder (nativa del navegador)
- **Formato:** WebM (video/webm o audio/webm)
- **Permisos:** getUserMedia con manejo de errores
- **Límite:** 3 minutos máximo
- **Vista previa:** Element `<video>` o `<audio>` con controls

### Simulación de Subida
- **Compresión:** Simulada con progreso (no real en web)
- **Subida:** Simulada con progreso y delay
- **Reintentos:** Hasta 3 intentos con manejo de errores
- **URL generada:** Simula URL de Supabase Storage

### Rúbrica de Evaluación
- **5 criterios:** Tiempo, Limpieza, Dinámica, Coordinación, Lectura
- **20 puntos cada uno** (total 100)
- **Sliders interactivos** para asignar puntaje
- **Comentarios** por criterio
- **Cálculo automático** de puntaje total y porcentaje

---

## 🎨 Características de UX

### Pantalla de Grabación
- ✅ Modal fullscreen con fondo oscuro
- ✅ Vista de cámara en tiempo real (modo video)
- ✅ Indicador de grabación (punto rojo pulsante)
- ✅ Timer visible durante grabación
- ✅ Botones grandes e intuitivos
- ✅ Vista previa antes de enviar
- ✅ Opción de re-grabar

### Progreso de Subida
- ✅ Barra de progreso animada
- ✅ Indicador de etapa actual (comprimiendo/subiendo)
- ✅ Porcentaje visible
- ✅ Información del archivo (nombre, tamaño)
- ✅ Mensajes de error claros
- ✅ Botón de reintentar

### Panel de Calificación
- ✅ Rúbrica visual con sliders
- ✅ Cálculo en tiempo real
- ✅ Barra de progreso con colores
- ✅ Porcentaje de logro
- ✅ Comentarios por criterio
- ✅ Feedback general
- ✅ Selección de estado

---

## 📁 Estructura de Archivos

```
src/features/tareas/
└── presentation/
    ├── RecordScreen.tsx          ✅ Pantalla de grabación
    ├── UploadProgress.tsx        ✅ Progreso de subida
    ├── TaskDetailAlumno.tsx      ✅ Detalle de tarea (alumno)
    └── GradePanel.tsx            ✅ Panel de calificación (profesor)

src/features/alumno/presentation/
└── AlumnoPanel.tsx               ✅ Integración con grabación

src/features/profesor/presentation/
└── ProfesorPanel.tsx             ✅ Integración con calificación

src/store/
└── AcademyContext.tsx            ✅ Acción ADD_ENTREGA
```

---

## 🚀 Cómo Probar

### Como Alumno (`juan@drumpro.com`):
1. Inicia sesión
2. Ve pestaña "Tareas"
3. Click en "Ver y Entregar" en una tarea
4. Se abre modal con detalle de la tarea
5. Click en "Grabar nueva entrega"
6. **IMPORTANTE:** Acepta los permisos de cámara/micrófono
7. Selecciona modo (video o solo audio)
8. Click en botón rojo para grabar
9. Graba por unos segundos
10. Click en botón de stop
11. Ve vista previa de la grabación
12. Click en "Enviar entrega"
13. Ve progreso de compresión y subida
14. Entrega completada → Estado cambia a "entregada"

### Como Profesor (`carlos@drumpro.com`):
1. Inicia sesión
2. Ve pestaña "Tareas"
3. Busca la tarea con entregas
4. Click en "Calificar" en la asignación entregada
5. Se abre GradePanel con rúbrica
6. Evalúa cada criterio con sliders
7. Escribe comentarios por criterio
8. Ve puntaje total calculado
9. Selecciona estado (Aprobada o Con correcciones)
10. Escribe feedback general
11. Click en "Enviar Calificación"
12. Calificación enviada → Alumno puede verla

### Flujo Completo:
1. **Alumno** graba y entrega tarea
2. **Profesor** ve entrega y califica
3. **Alumno** ve corrección con puntaje y feedback
4. **Alumno** puede re-entregar si tiene correcciones

---

## 📋 Checklist Fase 4

- ✅ Pantalla de grabación de video/audio
- ✅ Grabación REAL con MediaRecorder API
- ✅ Modo video y modo solo audio
- ✅ Vista previa en tiempo real
- ✅ Timer de grabación (límite 3 min)
- ✅ Manejo de permisos de cámara/mic
- ✅ Vista previa antes de enviar
- ✅ Opción de re-grabar
- ✅ Componente de progreso de subida
- ✅ Simulación de compresión
- ✅ Simulación de subida con progreso
- ✅ Reintentos automáticos (hasta 3)
- ✅ Manejo de errores
- ✅ Detalle de tarea para alumno
- ✅ Integración con grabación
- ✅ Integración con subida
- ✅ Lista de entregas anteriores
- ✅ Validación de fecha límite
- ✅ Panel de calificación del profesor
- ✅ Rúbrica con 5 criterios
- ✅ Sliders para puntaje
- ✅ Comentarios por criterio
- ✅ Cálculo automático de puntaje total
- ✅ Barra de progreso visual
- ✅ Porcentaje de logro
- ✅ Estado (Aprobada/Con correcciones)
- ✅ Feedback general
- ✅ Integración con panel de alumno
- ✅ Integración con panel de profesor
- ✅ Acción ADD_ENTREGA en contexto
- ✅ Seed data con 2 tareas y 3 asignaciones

---

## 🎯 Próximas Fases

### Fase 5: Evaluaciones y Progreso
- Evaluaciones periódicas con rúbricas
- Panel de evolución del alumno con gráficos
- Historial de entregas y correcciones
- Estadísticas de práctica
- Gráficos de progreso (fl_chart)

### Fase 6: Biblioteca de Rudimentos, Grooves y Estilos
- Catálogo completo de los 40 rudimentos PAS
- Grooves clasificados por estilo y dificultad
- Metrónomo de baja latencia integrado
- Práctica con BPM inicial, aumento gradual y objetivo
- Marcado de "dominado" por el alumno

---

## 💡 Notas Técnicas

### MediaRecorder API
- **Compatibilidad:** Chrome, Firefox, Edge, Safari (parcial)
- **Formato:** WebM (video/webm o audio/webm)
- **Limitaciones:** No disponible en iOS Safari (requiere solución alternativa)
- **Permisos:** Requiere HTTPS o localhost

### Simulación de Subida
- En producción real se usaría Supabase Storage
- La compresión real se haría con ffmpeg.wasm o en servidor
- Los reintentos usarían exponential backoff
- Las URLs serían firmadas con expiración

### Rúbrica de Evaluación
- Los criterios están hardcodeados pero pueden ser dinámicos
- En producción se cargarían desde la base de datos
- Permitiría personalización por profesor o tipo de tarea

---

## 🔐 Consideraciones de Seguridad

### Permisos de Cámara/Micrófono
- Solo se solicitan cuando el usuario quiere grabar
- El usuario puede denegar los permisos
- Se muestra mensaje de error claro si se deniegan
- En producción: verificar permisos antes de mostrar pantalla

### Subida de Archivos
- Validación de tipo de archivo (solo video/audio)
- Validación de tamaño máximo (100MB)
- Validación de duración máxima (3 minutos)
- En producción: escanear archivos maliciosos

### Privacidad
- Los videos solo son visibles para el profesor asignado
- URLs firmadas con expiración en producción
- No se comparten datos con terceros
- Cumplimiento de políticas de privacidad

---

**DrumPro Academy - Fase 4 Completada ✅**

**¿Listo para la Fase 5 (Evaluaciones y Progreso)?**
