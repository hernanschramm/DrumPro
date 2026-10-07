// ============================================================
// DrumPro - Aplicación Principal
// Navegación inferior entre las 5 secciones principales
// Integración con Capacitor para funcionalidades nativas Android
// ============================================================

import React, { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { AppProvider, useAppState } from './store/AppContext';
import Metronome from './features/metronome/Metronome';
import PracticeTrainer from './features/entrenador/PracticeTrainer';
import SongsSetlists from './features/canciones/SongsSetlists';
import PatternEditor from './features/patrones/PatternEditor';
import Settings from './features/ajustes/Settings';
import StageMode from './features/setlists/StageMode';

// --- Tipos de navegación ---
type Tab = 'metronome' | 'practice' | 'songs' | 'patterns' | 'settings';

// --- Contenido de cada pestaña ---
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'metronome', label: 'Metrónomo', icon: '🎵' },
  { id: 'practice', label: 'Práctica', icon: '🏋️' },
  { id: 'songs', label: 'Canciones', icon: '🎸' },
  { id: 'patterns', label: 'Patrones', icon: '🥁' },
  { id: 'settings', label: 'Ajustes', icon: '⚙️' },
];

// --- Componente principal de la app ---
function DrumProApp() {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<Tab>('metronome');
  const [stageMode, setStageMode] = useState(false);

  // Aplicar tema al documento y status bar nativa
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);

    // Actualizar status bar nativa de Android
    try {
      StatusBar.setStyle({
        style: state.theme === 'dark' ? Style.Dark : Style.Light,
      });
      StatusBar.setBackgroundColor({
        color: state.theme === 'dark' ? '#111827' : '#f9fafb',
      });
    } catch (e) {
      // No está en entorno nativo, ignorar
    }
  }, [state.theme]);

  // Manejo del botón atrás de Android
  useEffect(() => {
    let backListener: any;
    
    try {
      backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
        if (stageMode) {
          setStageMode(false);
        } else if (activeTab !== 'metronome') {
          setActiveTab('metronome');
        } else if (!canGoBack) {
          // Mostrar confirmación para salir
          if (confirm('¿Salir de DrumPro?')) {
            CapApp.exitApp();
          }
        }
      });
    } catch (e) {
      // No está en entorno nativo
    }

    return () => {
      if (backListener) {
        backListener.remove();
      }
    };
  }, [stageMode, activeTab]);

  // Ocultar splash screen cuando la app está lista
  useEffect(() => {
    try {
      SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (e) {
      // No está en entorno nativo
    }
  }, []);

  // Modo escenario
  if (stageMode) {
    return <StageMode onExit={() => setStageMode(false)} />;
  }

  return (
    <div className={`flex flex-col h-screen ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-4 py-2 border-b ${state.theme === 'dark' ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-sm`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🥁</span>
          <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            DrumPro
          </h1>
        </div>
        <button
          onClick={() => setStageMode(true)}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white text-xs font-bold flex items-center gap-1"
          title="Modo Escenario"
        >
          <span>🎤</span>
          <span className="hidden sm:inline">Escenario</span>
        </button>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'metronome' && <Metronome />}
        {activeTab === 'practice' && <PracticeTrainer />}
        {activeTab === 'songs' && <SongsSetlists />}
        {activeTab === 'patterns' && <PatternEditor />}
        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Navegación inferior */}
      <nav className={`flex border-t ${state.theme === 'dark' ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-sm safe-area-bottom`}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 transition-colors
              ${activeTab === tab.id
                ? 'text-orange-500'
                : state.theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }
            `}
          >
            <span className="text-lg sm:text-xl">{tab.icon}</span>
            <span className="text-[10px] sm:text-xs mt-0.5 font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="w-4 h-0.5 bg-orange-500 rounded-full mt-0.5" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

// --- Export con Provider ---
export default function App() {
  return (
    <AppProvider>
      <DrumProApp />
    </AppProvider>
  );
}
