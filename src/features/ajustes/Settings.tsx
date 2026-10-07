// ============================================================
// DrumPro - Ajustes de la aplicación
// Tema, idioma, exportar/importar datos
// ============================================================

import React, { useRef } from 'react';
import { useAppState } from '../../store/AppContext';
import { AppState } from '../../types';

export default function Settings() {
  const { state, dispatch } = useAppState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exportar datos como JSON
  const handleExport = () => {
    const data: AppState = { ...state };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drumpro_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar datos desde JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as AppState;
        dispatch({ type: 'IMPORT_DATA', payload: data });
        alert('✅ Datos importados correctamente');
      } catch (err) {
        alert('❌ Error al importar: archivo inválido');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Limpiar todos los datos
  const handleClearData = () => {
    if (confirm('⚠️ ¿Estás seguro? Se borrarán TODAS las canciones, setlists y patrones.')) {
      localStorage.removeItem('drumpro_state');
      window.location.reload();
    }
  };

  // Estadísticas
  const totalPracticeSeconds = Object.values(state.practiceTime).reduce((a, b) => a + b, 0);
  const totalPracticeMinutes = Math.floor(totalPracticeSeconds / 60);
  const totalPracticeHours = Math.floor(totalPracticeMinutes / 60);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">⚙️ Ajustes</h2>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Tema */}
        <div>
          <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Tema</label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors
                ${state.theme === 'dark' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              🌙 Oscuro
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_THEME', payload: 'light' })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors
                ${state.theme === 'light' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              ☀️ Claro
            </button>
          </div>
        </div>

        {/* Idioma */}
        <div>
          <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Idioma</label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'es' })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors
                ${state.language === 'es' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              🇪🇸 Español
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors
                ${state.language === 'en' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div>
          <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Estadísticas</label>
          <div className="mt-2 bg-gray-800/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Canciones guardadas</span>
              <span className="text-white font-medium">{state.songs.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Setlists</span>
              <span className="text-white font-medium">{state.setlists.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Patrones</span>
              <span className="text-white font-medium">{state.patterns.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tiempo total de práctica</span>
              <span className="text-green-400 font-medium">
                {totalPracticeHours > 0 ? `${totalPracticeHours}h ` : ''}{totalPracticeMinutes % 60}min
              </span>
            </div>
          </div>
        </div>

        {/* Exportar/Importar */}
        <div>
          <label className="text-sm text-gray-400 uppercase tracking-wide font-medium">Datos</label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleExport}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium"
            >
              📤 Exportar JSON
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-medium"
            >
              📥 Importar JSON
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* Borrar datos */}
        <div>
          <button
            onClick={handleClearData}
            className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 rounded-lg text-red-400 text-sm font-medium"
          >
            🗑️ Borrar todos los datos
          </button>
        </div>

        {/* Info */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-700">
          <p className="font-medium text-gray-400">DrumPro v1.0</p>
          <p className="mt-1">Metrónomo profesional y herramienta para bateristas</p>
          <p className="mt-1">Hecho con Web Audio API para baja latencia</p>
          <p className="mt-2">100% offline • Datos guardados localmente</p>
        </div>
      </div>
    </div>
  );
}
