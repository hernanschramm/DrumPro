// ============================================================
// DrumPro Academy - Página de Documentación
// Muestra los entregables de la Fase 1 de forma visual
// ============================================================

import React, { useState } from 'react';

type Section = 'overview' | 'database' | 'architecture' | 'risks' | 'flutter' | 'next';

export default function App() {
  const [section, setSection] = useState<Section>('overview');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🥁</div>
            <div>
              <h1 className="text-3xl font-bold">DrumPro Academy</h1>
              <p className="text-gray-300">Fase 1: Modelo de Datos y Estructura Flutter</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview' as Section, label: '📋 Resumen', icon: '' },
              { id: 'database' as Section, label: '🗄️ Base de Datos', icon: '' },
              { id: 'architecture' as Section, label: '🏗️ Arquitectura', icon: '' },
              { id: 'risks' as Section, label: '⚠️ Riesgos', icon: '' },
              { id: 'flutter' as Section, label: '📱 Flutter', icon: '' },
              { id: 'next' as Section, label: '🚀 Siguiente', icon: '' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSection(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
                  ${section === tab.id
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {section === 'overview' && <OverviewSection />}
        {section === 'database' && <DatabaseSection />}
        {section === 'architecture' && <ArchitectureSection />}
        {section === 'risks' && <RisksSection />}
        {section === 'flutter' && <FlutterSection />}
        {section === 'next' && <NextSection />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>DrumPro Academy - Fase 1 Completada ✅</p>
          <p className="mt-1">Plataforma profesional de enseñanza de batería para Android</p>
        </div>
      </footer>
    </div>
  );
}

// --- Secciones ---

function OverviewSection() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-2xl font-bold mb-4">✅ Entregables de la Fase 1</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-3xl mb-2">🗄️</div>
            <h3 className="font-bold text-lg">Modelo de Datos SQL</h3>
            <p className="text-gray-400 text-sm mt-1">16 tablas con RLS, triggers, vistas y seed data</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-3xl mb-2">🏗️</div>
            <h3 className="font-bold text-lg">Arquitectura del Sistema</h3>
            <p className="text-gray-400 text-sm mt-1">Flutter + Supabase + Servidor de Audio Python</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="font-bold text-lg">Riesgos Técnicos y Legales</h3>
            <p className="text-gray-400 text-sm mt-1">Copyright, privacidad de menores, latencia</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold text-lg">Estructura Flutter Completa</h3>
            <p className="text-gray-400 text-sm mt-1">Archivos Dart de referencia con Material 3 + Riverpod</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🎯 Visión del Proyecto</h3>
        <p className="text-gray-300 leading-relaxed">
          DrumPro Academy es una plataforma móvil profesional donde profesores de batería crean clases, 
          tareas y evaluaciones; y donde los alumnos estudian, practican con herramientas profesionales, 
          entregan videos y audios, y ven su evolución.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
            <div className="text-2xl mb-2">👤</div>
            <h4 className="font-bold">Administrador</h4>
            <p className="text-sm text-gray-400">Gestión de usuarios, catálogo y métricas</p>
          </div>
          <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
            <div className="text-2xl mb-2">🎓</div>
            <h4 className="font-bold">Profesor</h4>
            <p className="text-sm text-gray-400">Clases, tareas, evaluaciones y correcciones</p>
          </div>
          <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
            <div className="text-2xl mb-2">🎵</div>
            <h4 className="font-bold">Alumno</h4>
            <p className="text-sm text-gray-400">Estudio, práctica, entregas y progreso</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">📦 Módulos del Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            '🎥 Clases en vivo',
            '📝 Tareas y entregas',
            '📊 Evaluaciones',
            '📈 Evolución',
            '📚 Biblioteca',
            '🎵 Multitrack',
            '📹 Contenido redes',
            '🎵 Metrónomo',
            '⏱️ Evaluador tiempo',
            '🎹 Soporte MIDI',
            '🎮 Gamificación',
            '💳 Suscripciones',
          ].map(modulo => (
            <div key={modulo} className="bg-gray-700/50 rounded-lg p-3 text-sm text-center">
              {modulo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DatabaseSection() {
  const tables = [
    { name: 'profiles', desc: 'Usuarios con roles (admin/profesor/alumno)', icon: '👤' },
    { name: 'clases', desc: 'Clases en vivo con videollamada', icon: '🎥' },
    { name: 'tareas', desc: 'Tareas asignadas por profesores', icon: '📝' },
    { name: 'tarea_asignaciones', desc: 'Relación N:N tareas ↔ alumnos', icon: '🔗' },
    { name: 'entregas', desc: 'Archivos subidos por alumnos', icon: '📤' },
    { name: 'evaluaciones', desc: 'Evaluaciones periódicas', icon: '📊' },
    { name: 'criterios_evaluacion', desc: 'Criterios: tiempo, limpieza, dinámica...', icon: '✅' },
    { name: 'sesiones_practica', desc: 'Registro de tiempo de práctica', icon: '⏱️' },
    { name: 'rudimentos', desc: '40 rudimentos PAS', icon: '🥁' },
    { name: 'grooves', desc: 'Catálogo de grooves por estilo', icon: '🎶' },
    { name: 'progreso_rudimentos', desc: 'Dominio de rudimentos por alumno', icon: '📈' },
    { name: 'progreso_grooves', desc: 'Dominio de grooves por alumno', icon: '📈' },
    { name: 'canciones_material', desc: 'Material de estudio con canciones', icon: '🎵' },
    { name: 'cola_procesamiento', desc: 'Trabajos de audio (BPM, stems, notas)', icon: '⚙️' },
    { name: 'notificaciones', desc: 'Notificaciones push', icon: '🔔' },
    { name: 'rachas_estudio', desc: 'Gamificación (racha de días)', icon: '🔥' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🗄️ Modelo de Datos</h2>
        <p className="text-gray-300 mb-6">
          16 tablas normalizadas con Row Level Security (RLS) para garantizar que cada rol 
          solo acceda a los datos que le corresponden.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tables.map(table => (
            <div key={table.name} className="bg-gray-700/50 rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">{table.icon}</span>
              <div>
                <div className="font-mono text-sm text-orange-400">{table.name}</div>
                <div className="text-gray-400 text-xs mt-1">{table.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🔒 Políticas RLS</h3>
        <div className="space-y-3">
          <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
            <h4 className="font-bold text-purple-300">👤 Admin</h4>
            <p className="text-sm text-gray-300 mt-1">Acceso total a todas las tablas y datos</p>
          </div>
          <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
            <h4 className="font-bold text-blue-300">🎓 Profesor</h4>
            <p className="text-sm text-gray-300 mt-1">Solo ve datos de sus alumnos asignados. Nunca ve datos de otros profesores o alumnos ajenos.</p>
          </div>
          <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
            <h4 className="font-bold text-green-300">🎵 Alumno</h4>
            <p className="text-sm text-gray-300 mt-1">Solo ve sus propios datos y los de su profesor. NUNCA ve datos de otros alumnos.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🌱 Seed Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">40</div>
            <div className="text-sm text-gray-400">Rudimentos PAS</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">6</div>
            <div className="text-sm text-gray-400">Grooves de ejemplo</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">6</div>
            <div className="text-sm text-gray-400">Usuarios de demo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🏗️ Arquitectura del Sistema</h2>
        
        <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-green-400">{`
┌─────────────────────────────────────────────────────┐
│         APP MÓVIL FLUTTER (Android)                  │
│  Material 3 + Riverpod + go_router                  │
│                                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │  Auth  │ │ Clases │ │ Tareas │ │Biblio. │       │
│  └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘       │
│       └──────────┴──────────┴──────────┘             │
│                    │                                  │
│           ┌────────┴────────┐                        │
│           │  Riverpod State  │                        │
│           └────────┬────────┘                        │
└────────────────────┼────────────────────────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
   ┌──────────┐ ┌────────┐ ┌──────────────────────┐
   │ Supabase │ │Supabase│ │ SERVIDOR DE AUDIO    │
   │  Auth    │ │Postgres│ │ FastAPI + Python     │
   │          │ │+ RLS   │ │                      │
   │          │ │        │ │ ┌──────────────────┐ │
   │          │ │Storage │ │ │ Demucs (stems)   │ │
   │          │ │        │ │ │ Basic Pitch      │ │
   │          │ │Realtime│ │ │ librosa (BPM)    │ │
   └──────────┘ └────────┘ │ └──────────────────┘ │
                           │ Celery + Redis       │
                           └──────────────────────┘
          `}</pre>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🔧 Stack Tecnológico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-orange-400 mb-2">App Móvil</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Flutter 3.x (Dart)</li>
              <li>• Material 3 + Tema oscuro</li>
              <li>• Riverpod (state management)</li>
              <li>• go_router (navegación)</li>
              <li>• Supabase Flutter SDK</li>
              <li>• just_audio (audio baja latencia)</li>
              <li>• camera + record (grabación)</li>
              <li>• fl_chart (gráficos)</li>
              <li>• drift (SQLite offline)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-orange-400 mb-2">Backend</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Supabase (BaaS)</li>
              <li>• PostgreSQL + RLS</li>
              <li>• Supabase Storage</li>
              <li>• Supabase Realtime</li>
              <li>• Firebase Cloud Messaging</li>
              <li>• FastAPI (servidor audio)</li>
              <li>• Demucs (separación stems)</li>
              <li>• Basic Pitch (detección notas)</li>
              <li>• librosa (análisis BPM)</li>
              <li>• Celery + Redis (cola)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">💰 Costos Estimados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
            <h4 className="font-bold text-green-300">MVP (100 usuarios)</h4>
            <div className="text-3xl font-bold text-green-400 mt-2">~$150/mes</div>
            <ul className="text-sm text-gray-300 mt-2">
              <li>• Supabase Free: $0</li>
              <li>• Servidor GPU: ~$150/mes</li>
              <li>• Firebase: $0</li>
            </ul>
          </div>
          <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
            <h4 className="font-bold text-blue-300">Escalado (1000 usuarios)</h4>
            <div className="text-3xl font-bold text-blue-400 mt-2">~$600/mes</div>
            <ul className="text-sm text-gray-300 mt-2">
              <li>• Supabase Pro: $25/mes</li>
              <li>• Servidor GPU: ~$500/mes</li>
              <li>• Storage + CDN: ~$75/mes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RisksSection() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">⚠️ Riesgos Identificados</h2>
        
        <div className="space-y-4">
          <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔴</span>
              <h3 className="font-bold text-red-300">Copyright de Música</h3>
              <span className="ml-auto px-2 py-0.5 bg-red-600 text-white text-xs rounded">CRÍTICO</span>
            </div>
            <p className="text-sm text-gray-300">
              Los usuarios NO deben subir canciones con copyright. Solo archivos propios o con licencia.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Mitigación:</strong> Términos claros, aviso en UI, DMCA compliance.
            </p>
          </div>

          <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔴</span>
              <h3 className="font-bold text-red-300">Privacidad de Menores</h3>
              <span className="ml-auto px-2 py-0.5 bg-red-600 text-white text-xs rounded">CRÍTICO</span>
            </div>
            <p className="text-sm text-gray-300">
              Muchos alumnos son menores. COPPA y GDPR-K son muy estrictos.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Mitigación:</strong> Edad mínima 16+, consentimiento parental, política de privacidad clara.
            </p>
          </div>

          <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔴</span>
              <h3 className="font-bold text-red-300">Procesamiento de Audio Lento</h3>
              <span className="ml-auto px-2 py-0.5 bg-red-600 text-white text-xs rounded">CRÍTICO</span>
            </div>
            <p className="text-sm text-gray-300">
              Demucs requiere GPU y tarda 2-5 minutos por canción.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Mitigación:</strong> Cola asíncrona (Celery), cache, autoescalado.
            </p>
          </div>

          <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟡</span>
              <h3 className="font-bold text-yellow-300">Latencia en Videollamada</h3>
              <span className="ml-auto px-2 py-0.5 bg-yellow-600 text-white text-xs rounded">MEDIO</span>
            </div>
            <p className="text-sm text-gray-300">
              La videollamada para clases de batería requiere baja latencia.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Mitigación:</strong> Jitsi Meet, test de conexión, opción de grabar video.
            </p>
          </div>

          <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟡</span>
              <h3 className="font-bold text-yellow-300">Almacenamiento de Videos</h3>
              <span className="ml-auto px-2 py-0.5 bg-yellow-600 text-white text-xs rounded">MEDIO</span>
            </div>
            <p className="text-sm text-gray-300">
              Videos de 50-200MB cada uno. Crecimiento rápido de storage.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong>Mitigación:</strong> Compresión, límite de duración, limpieza automática.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">📊 Matriz de Riesgos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3">Riesgo</th>
                <th className="text-center py-2 px-3">Probabilidad</th>
                <th className="text-center py-2 px-3">Impacto</th>
                <th className="text-center py-2 px-3">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700/50">
                <td className="py-2 px-3">Copyright</td>
                <td className="text-center py-2 px-3">Alta</td>
                <td className="text-center py-2 px-3">Crítico</td>
                <td className="text-center py-2 px-3 text-red-400 font-bold">#1</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-2 px-3">Privacidad menores</td>
                <td className="text-center py-2 px-3">Media</td>
                <td className="text-center py-2 px-3">Crítico</td>
                <td className="text-center py-2 px-3 text-red-400 font-bold">#2</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-2 px-3">Audio lento</td>
                <td className="text-center py-2 px-3">Alta</td>
                <td className="text-center py-2 px-3">Alto</td>
                <td className="text-center py-2 px-3 text-red-400 font-bold">#3</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-2 px-3">Videollamada</td>
                <td className="text-center py-2 px-3">Media</td>
                <td className="text-center py-2 px-3">Alto</td>
                <td className="text-center py-2 px-3 text-yellow-400 font-bold">#4</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Storage</td>
                <td className="text-center py-2 px-3">Alta</td>
                <td className="text-center py-2 px-3">Medio</td>
                <td className="text-center py-2 px-3 text-yellow-400 font-bold">#5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FlutterSection() {
  return (
    <div className="space-y-8">
      <div className="bg-blue-600/20 rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">📱 Nota Importante</h2>
        <p className="text-gray-300">
          Este entorno genera aplicaciones web con React/Vite. Los archivos Flutter/Dart se entregan 
          como <strong>código de referencia</strong> que debes copiar a tu proyecto Flutter local.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Consulta <code className="bg-gray-700 px-2 py-0.5 rounded">FLUTTER_SETUP_GUIDE.md</code> para 
          instrucciones detalladas de instalación.
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">📁 Estructura del Proyecto Flutter</h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-green-400">{`lib/
├── core/
│   ├── config/
│   │   ├── supabase_config.dart    ✅ Configuración Supabase
│   │   └── app_config.dart         ✅ Configuración general
│   ├── constants/
│   │   ├── app_routes.dart         ✅ Rutas de navegación
│   │   └── app_strings.dart        ✅ Cadenas de texto
│   └── theme/
│       └── app_theme.dart          ✅ Tema Material 3
│
├── features/
│   ├── auth/
│   │   ├── domain/
│   │   │   └── auth_state.dart     ✅ Estado de autenticación
│   │   └── presentation/
│   │       ├── auth_provider.dart  ✅ Provider Riverpod
│   │       └── login_screen.dart   ✅ Pantalla de login
│   │
│   ├── admin/
│   │   └── presentation/
│   │       └── admin_dashboard.dart ✅ Panel admin
│   │
│   ├── profesor/
│   │   └── presentation/
│   │       └── profesor_dashboard.dart ✅ Panel profesor
│   │
│   └── alumno/
│       └── presentation/
│           └── alumno_dashboard.dart ✅ Panel alumno
│
├── main.dart                       ✅ Punto de entrada
└── app.dart                        ✅ Widget principal`}</pre>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🚀 Pasos para Inicializar</h3>
        <div className="space-y-3">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <div className="font-medium">Crear proyecto Flutter</div>
                <code className="text-sm text-gray-400">flutter create drumpro_academy --org com.drumpro --platforms android</code>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <div className="font-medium">Copiar archivos de referencia</div>
                <code className="text-sm text-gray-400">cp -r flutter_reference/lib/* lib/</code>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <div className="font-medium">Instalar dependencias</div>
                <code className="text-sm text-gray-400">flutter pub get</code>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <div className="font-medium">Configurar Supabase</div>
                <code className="text-sm text-gray-400">Editar lib/core/config/supabase_config.dart</code>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <div className="font-medium">Ejecutar SQL en Supabase</div>
                <code className="text-sm text-gray-400">Copiar docs/database.sql → Supabase SQL Editor</code>
              </div>
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold">6</div>
              <div>
                <div className="font-medium">¡Ejecutar la app!</div>
                <code className="text-sm text-gray-400">flutter run</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextSection() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 border border-green-500/30">
        <h2 className="text-2xl font-bold mb-4">🚀 Próximas Fases</h2>
        <p className="text-gray-300 mb-6">
          Una vez confirmes la Fase 1, avanzamos con la implementación progresiva de cada módulo.
        </p>

        <div className="space-y-3">
          {[
            { fase: 2, title: 'Autenticación Completa', desc: 'Registro, login, recuperación de contraseña, perfiles', color: 'green' },
            { fase: 3, title: 'Clases y Calendario', desc: 'Calendario visual, creación de clases, recordatorios', color: 'blue' },
            { fase: 4, title: 'Tareas y Entregas', desc: 'Grabación de video/audio, subida, correcciones', color: 'purple' },
            { fase: 5, title: 'Evaluaciones y Progreso', desc: 'Rúbricas, gráficos de evolución, historial', color: 'orange' },
            { fase: 6, title: 'Biblioteca y Metrónomo', desc: 'Rudimentos, grooves, metrónomo de baja latencia', color: 'yellow' },
            { fase: 7, title: 'Videollamada en Vivo', desc: 'Integración con Jitsi Meet, audio estéreo', color: 'red' },
            { fase: 8, title: 'Servidor de Audio', desc: 'BPM, click, separación de stems, mixer multitrack', color: 'pink' },
            { fase: 9, title: 'Detección de Notas', desc: 'Basic Pitch, piano roll, visualización', color: 'indigo' },
            { fase: 10, title: 'Contenido para Redes', desc: 'Video 9:16, exportar, compartir', color: 'teal' },
            { fase: 11, title: 'Evaluador de Tiempo', desc: 'Detección de onsets, MIDI, pedal Bluetooth', color: 'cyan' },
            { fase: 12, title: 'Gamificación y Offline', desc: 'Puntos, niveles, rachas, modo offline completo', color: 'lime' },
            { fase: 13, title: 'Pruebas y Publicación', desc: 'Testing, rendimiento, privacidad, Google Play', color: 'amber' },
          ].map(fase => (
            <div key={fase.fase} className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4">
              <div className={`w-10 h-10 bg-${fase.color}-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                {fase.fase}
              </div>
              <div className="flex-1">
                <div className="font-bold">{fase.title}</div>
                <div className="text-sm text-gray-400">{fase.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">✅ Checklist Fase 1</h3>
        <div className="space-y-2">
          {[
            'Modelo de datos normalizado (3NF)',
            'RLS implementado en todas las tablas',
            'Índices para queries frecuentes',
            'Triggers de updated_at automático',
            'Datos seed (40 rudimentos, 6 grooves, 6 usuarios)',
            'Diagrama de arquitectura claro',
            'Riesgos identificados y mitigados',
            'Estructura Flutter completa',
            'Código comentado en español',
            'Material 3 con tema oscuro',
            'Riverpod para state management',
            'go_router para navegación',
            'Supabase integrado',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span className="text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-600/20 rounded-xl p-6 border border-orange-500/30">
        <h3 className="text-xl font-bold mb-4 text-orange-300">🎯 ¿Listo para la Fase 2?</h3>
        <p className="text-gray-300">
          Cuando confirmes, construyo la <strong>Fase 2: Autenticación Completa</strong> con:
        </p>
        <ul className="text-gray-300 mt-2 space-y-1">
          <li>• Registro de usuarios con validación</li>
          <li>• Recuperación de contraseña por email</li>
          <li>• Perfiles con avatar y bio</li>
          <li>• Asignación de alumnos a profesores</li>
          <li>• Verificación de email con Supabase Auth</li>
        </ul>
      </div>
    </div>
  );
}
