# DrumPro Academy - Riesgos Técnicos y Legales

## Riesgos Técnicos

### 🔴 CRÍTICOS

#### 1. Procesamiento de Audio (Demucs) - Riesgo ALTO
**Riesgo:** La separación de stems con Demucs requiere GPU y puede tardar 2-5 minutos por canción. Si hay muchos usuarios simultáneos, el servidor puede colapsar.

**Impacto:**
- Usuarios esperan minutos viendo "procesando..."
- Costo de servidor GPU es alto ($150-500/mes)
- Si falla, el usuario pierde confianza

**Mitigación:**
- Cola de trabajos con Celery + Redis para manejar picos
- Autoescalado horizontal (múltiples workers GPU)
- Cache de stems procesados (evitar re-procesar)
- Límite de procesamiento por usuario/día en plan gratuito
- Fallback: si falla, ofrecer solo BPM detection (más rápido)

**Alternativa:**
- Usar API de terceros (Lalal.ai, Splitter.ai) pero tiene costo por procesamiento
- Procesamiento local en el dispositivo (solo para BPM, no stems)

**Validación requerida:**
- Prototipo antes de integrar: script Python que separe stems de 10 canciones
- Medir tiempo real en GPU vs CPU
- Evaluar calidad de separación de batería

---

#### 2. Latencia en Videollamada - Riesgo MEDIO-ALTO
**Riesgo:** La videollamada para clases de batería requiere baja latencia (<200ms) para que el profesor pueda corregir en tiempo real. Si hay lag, la clase pierde valor.

**Impacto:**
- Profesor no puede escuchar al alumno en tiempo real
- Experiencia frustrante
- Abandono de la plataforma

**Mitigación:**
- Usar Jitsi Meet (optimizado para baja latencia)
- Recomendaciones de ancho de banda mínimo (2 Mbps upload)
- Opción de grabar video y enviarlo si la conexión es mala
- Test de conexión antes de cada clase

**Alternativa:**
- LiveKit: más control pero más complejo de integrar
- Agora: mejor calidad pero costo por minuto (~$4/1000 min)
- Solo videollamada externa (Zoom/Meet link) - más simple pero menos integrado

**Validación requerida:**
- Prueba de latencia con Jitsi en diferentes redes (4G, WiFi, fibra)
- Test con batería real (audio complejo)

---

#### 3. Almacenamiento de Videos Pesados - Riesgo MEDIO
**Riesgo:** Los videos de práctica pueden ser de 50-200MB cada uno. Con 100 alumnos entregando 4 videos/mes = 400 videos = 20-80GB/mes.

**Impacto:**
- Costo de storage crece rápido
- Subida lenta en conexiones malas
- Usuario abandona si tarda mucho

**Mitigación:**
- Compresión agresiva antes de subir (H.264, 720p, 1Mbps)
- Límite de duración: máx 3 minutos por entrega
- Progreso de subida con reintentos automáticos
- Limpieza automática de videos antiguos (>6 meses)
- Opción de solo audio (sin video) para ahorrar espacio

**Costo estimado:**
- Supabase Storage: $0.021/GB/mes
- 100GB = $2.10/mes (muy razonable)
- 1TB = $21/mes (escalado)

---

### 🟡 IMPORTANTES

#### 4. Detección de BPM Inexacta - Riesgo MEDIO
**Riesgo:** La detección automática de BPM con librosa puede fallar en canciones con tempo variable o cambios de ritmo.

**Impacto:**
- Click desincronizado
- Usuario pierde confianza en la herramienta
- Tiene que ajustar BPM manualmente

**Mitigación:**
- Permitir ajuste manual del BPM detectado
- Mostrar confianza del algoritmo (ej: "BPM: 120 ±5")
- Mapa de tempo visual para ver variaciones
- Algoritmo híbrido: librosa + madmom (más preciso)

**Alternativa:**
- Solo detectar BPM en canciones subidas (no en enlaces de Spotify/YouTube)
- Permitir que el profesor ingrese el BPM manualmente

---

#### 5. Sincronización de Stems en Mixer - Riesgo MEDIO
**Riesgo:** Reproducir múltiples stems sincronizados puede tener drift (desincronización) con el tiempo.

**Impacto:**
- Las pistas se desincronizan después de 1-2 minutos
- Experiencia de "playalong" arruinada

**Mitigación:**
- Usar flutter_sound o just_audio con sincronización por timestamp
- Reiniciar todas las pistas simultáneamente
- Buffer compartido para evitar drift
- Test de sincronización en múltiples dispositivos

**Alternativa:**
- Mezclar stems en el servidor y entregar un solo archivo (pierde flexibilidad)
- Usar Web Audio API (si se hace versión web)

---

#### 6. Consumo de Batería y Datos - Riesgo MEDIO
**Riesgo:** La app usa mucho recursos: metrónomo en segundo plano, videollamada, reproducción de audio, subida de videos.

**Impacto:**
- Batería del teléfono se agota rápido
- Usuario desinstala la app
- Consumo de datos excesivo en plan móvil

**Mitigación:**
- Optimizar metrónomo con audio de baja latencia (no CPU constante)
- Compresión de videos antes de subir
- Modo "ahorro de datos" (solo audio, no video)
- Descarga de stems para uso offline
- Notificar al usuario si está en datos móviles

---

#### 7. Compatibilidad de Dispositivos Android - Riesgo MEDIO
**Riesgo:** Android tiene miles de dispositivos con diferentes capacidades de audio, cámaras y rendimiento.

**Impacto:**
- Grabación de video falla en algunos dispositivos
- Audio del metrónomo tiene latencia variable
- App se cierra en dispositivos antiguos

**Mitigación:**
- minSdk 24 (Android 7.0, 2016) - cubre 95% de dispositivos
- Testing en dispositivos reales (no solo emulador)
- Fallbacks para características no soportadas
- Crash reporting con Sentry para detectar problemas rápido

---

### 🟢 MENORES

#### 8. Notificaciones Push No Llegan - Riesgo BAJO
**Riesgo:** Las notificaciones push pueden no llegar por configuración del dispositivo o restricciones de batería.

**Mitigación:**
- Fallback: email como notificación secundaria
- In-app notifications (banner dentro de la app)
- Instrucciones para desactivar optimización de batería

---

#### 9. Supabase Downtime - Riesgo BAJO
**Riesgo:** Si Supabase se cae, la app no funciona.

**Mitigación:**
- Supabase tiene 99.9% uptime garantizado
- Cache local de datos críticos (SQLite con Drift)
- Modo offline para metrónomo y biblioteca

---

#### 10. Calidad de Audio en Diferentes Dispositivos - Riesgo BAJO
**Riesgo:** La latencia de audio varía mucho entre dispositivos Android.

**Mitigación:**
- Usar Oboe/AAudio para baja latencia (API nativa)
- Calibración automática de latencia
- Permitir ajuste manual de offset

---

## Riesgos Legales

### 🔴 CRÍTICOS

#### 1. Copyright de Música - Riesgo ALTO
**Riesgo:** Los usuarios pueden subir canciones con copyright para separar stems y tocar encima. Esto es ilegal sin licencia.

**Impacto:**
- Demandas de discográficas
- Cierre de la plataforma
- Responsabilidad legal del desarrollador

**Mitigación:**
- **Términos de servicio claros:** usuario declara tener derechos o licencia
- **Aviso en la interfaz:** "Solo sube archivos que tengas derecho a usar"
- **No procesar enlaces de Spotify/YouTube:** solo se guardan como links para escuchar en el reproductor oficial
- **DMCA compliance:** procedimiento para retirar contenido si hay denuncia
- **Limitar procesamiento:** solo archivos subidos, no enlaces externos
- **Educación:** explicar qué es dominio público, Creative Commons, etc.

**Zona gris:**
- Uso educativo puede ser "fair use" en algunos países, pero NO en todos
- Mejor práctica: pedir licencia o usar solo material propio/CC

**Recomendación:**
- Consultar con abogado especializado en propiedad intelectual
- Tener seguro de responsabilidad civil
- Política de "notice and takedown" clara

---

#### 2. Privacidad de Menores de Edad - Riesgo ALTO
**Riesgo:** Muchos alumnos de batería son menores de 13-17 años. Las leyes de privacidad (COPPA en EEUU, GDPR-K en Europa) son muy estrictas.

**Impacto:**
- Multas de hasta $50,000 USD por violación de COPPA
- Cierre de la app en ciertos países
- Daño reputacional

**Mitigación:**
- **Consentimiento parental:** para menores de 13 años, requerir verificación de padre/tutor
- **Política de privacidad clara:** en lenguaje simple, qué datos se recopilan y por qué
- **No recopilar datos innecesarios:** solo lo esencial para el servicio
- **No compartir datos con terceros:** sin publicidad, sin analytics invasivos
- **Derecho al olvido:** botón para eliminar cuenta y todos los datos
- **Edad mínima:** considerar 16+ para evitar complejidad legal

**Recomendación:**
- Implementar verificación de edad en el registro
- Para menores de 16: cuenta debe ser creada por padre/tutor
- Consultar con abogado de privacidad

---

#### 3. Contenido Inapropiado en Videos - Riesgo MEDIO-ALTO
**Riesgo:** Los alumnos suben videos de sí mismos practicando. Podrían subir contenido inapropiado o accidental.

**Impacto:**
- Videos inapropiados visibles para el profesor
- Problemas legales si hay menores
- Daño reputacional

**Mitigación:**
- **Solo el profesor del alumno ve sus videos:** RLS garantiza esto
- **No hay feed público:** videos son privados
- **Moderación:** profesor puede reportar contenido inapropiado
- **Términos de uso:** prohibir contenido inapropiado
- **Edad mínima:** 16+ o consentimiento parental

---

### 🟡 IMPORTANTES

#### 4. Responsabilidad por Consejos de Profesores - Riesgo MEDIO
**Riesgo:** Un profesor da consejos incorrectos que causan una lesión (ej: técnica incorrecta que causa tendinitis).

**Impacto:**
- Demanda contra la plataforma
- Daño reputacional

**Mitigación:**
- **Descargo de responsabilidad:** "Los consejos de los profesores son opiniones personales. Consulta a un profesional de salud si sientes dolor."
- **Verificación de profesores:** revisar credenciales antes de aprobar
- **Sistema de ratings:** alumnos califican a profesores
- **Moderación:** admin puede suspender profesores con malas prácticas

---

#### 5. Pagos y Transacciones Financieras - Riesgo MEDIO
**Riesgo:** Si la plataforma cobra por clases o suscripciones, maneja dinero de usuarios.

**Impacto:**
- Responsabilidad fiscal
- Regulaciones de pagos (PCI DSS)
- Disputas de cobros

**Mitigación:**
- **No manejar pagos directamente:** usar Stripe o PayPal
- **Términos claros:** quién cobra, cuándo, políticas de reembolso
- **Facturación automática:** generar facturas para profesores
- **Contador:** asesoría fiscal para impuestos

**Nota:** En el MVP no hay pagos, pero si se agregan, este riesgo se vuelve crítico.

---

#### 6. Propiedad Intelectual del Contenido - Riesgo MEDIO
**Riesgo:** ¿De quién son los rudimentos, grooves y materiales educativos? ¿Puede un profesor reclamar propiedad?

**Impacto:**
- Disputas legales con profesores
- Confusión sobre qué puede reutilizar la plataforma

**Mitigación:**
- **Términos claros:** contenido subido por profesores es licenciado a la plataforma (no transferido)
- **Catálogo base:** rudimentos PAS son de dominio público
- **Contenido original:** si la plataforma crea contenido, es suyo
- **Atribución:** dar crédito a profesores por sus materiales

---

#### 7. Cumplimiento GDPR (Europa) - Riesgo MEDIO
**Riesgo:** Si hay usuarios europeos, deben cumplirse las regulaciones de GDPR.

**Impacto:**
- Multas de hasta 4% de ingresos globales
- Obligación de notificar brechas de datos en 72 horas

**Mitigación:**
- **Derecho al olvido:** botón para eliminar cuenta y datos
- **Portabilidad de datos:** exportar todos los datos del usuario
- **Consentimiento explícito:** checkboxes claros en registro
- **Política de privacidad:** detallada y accesible
- **DPO (Data Protection Officer):** si hay >250 empleados o procesamiento masivo

**Recomendación:**
- Consultar con abogado de privacidad europeo
- Implementar "privacy by design" desde el inicio

---

### 🟢 MENORES

#### 8. Accesibilidad (ADA Compliance) - Riesgo BAJO
**Riesgo:** La app no es accesible para personas con discapacidades.

**Mitigación:**
- Seguir WCAG 2.1 guidelines
- Soporte para screen readers
- Contraste de colores adecuado
- Textos alternativos en imágenes

---

#### 9. Términos de Servicio de APIs de Terceros - Riesgo BAJO
**Riesgo:** Violar términos de Spotify, YouTube, Jitsi, etc.

**Mitigación:**
- **Spotify/YouTube:** solo guardar enlaces, NO procesar audio
- **Jitsi:** respetar límites de uso del plan gratuito
- **Supabase:** respetar límites del plan (o pagar)
- **Firebase:** respetar límites de push notifications

---

## Matriz de Riesgos (Probabilidad x Impacto)

| Riesgo | Probabilidad | Impacto | Prioridad |
|--------|--------------|---------|-----------|
| Copyright de música | Alta | Crítico | 🔴 1 |
| Privacidad de menores | Media | Crítico | 🔴 2 |
| Procesamiento de audio lento | Alta | Alto | 🔴 3 |
| Latencia en videollamada | Media | Alto | 🟡 4 |
| Almacenamiento de videos | Alta | Medio | 🟡 5 |
| Contenido inapropiado | Baja | Alto | 🟡 6 |
| Detección de BPM inexacta | Alta | Medio | 🟡 7 |
| Sincronización de stems | Media | Medio | 🟡 8 |
| Consumo de batería | Alta | Bajo | 🟢 9 |
| Compatibilidad Android | Media | Bajo | 🟢 10 |

## Plan de Acción

### Antes del MVP (Fase 1-6)
1. ✅ Consultar con abogado de propiedad intelectual
2. ✅ Redactar términos de servicio y política de privacidad
3. ✅ Implementar aviso de copyright en subida de archivos
4. ✅ Definir edad mínima (recomendado: 16+)
5. ✅ Prototipo de procesamiento de audio (validar Demucs)

### Antes del Lanzamiento (Fase 10-11)
1. ✅ Revisión legal de todos los documentos
2. ✅ Testing en 10+ dispositivos Android reales
3. ✅ Prueba de carga del servidor de audio
4. ✅ Auditoría de seguridad (RLS, permisos)
5. ✅ Seguro de responsabilidad civil

### Post-Lanzamiento
1. ✅ Monitoreo de errores (Sentry)
2. ✅ Feedback de usuarios (encuestas)
3. ✅ Iteración rápida de features críticas
4. ✅ Cumplimiento de regulaciones nuevas

## Conclusión

Los riesgos más críticos son **legales** (copyright y privacidad de menores), no técnicos. La tecnología es manejable con las herramientas correctas, pero las implicaciones legales pueden cerrar la plataforma si no se abordan desde el inicio.

**Recomendación final:**
1. Invertir en asesoría legal ANTES de lanzar
2. Validar el procesamiento de audio con un prototipo
3. Lanzar MVP con features básicas (sin stems ni videollamada)
4. Iterar basado en feedback real de usuarios
