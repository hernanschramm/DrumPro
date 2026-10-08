// ============================================================
// DrumPro Academy - Pantalla de Biblioteca
// Fase 6: Biblioteca y Metrónomo
// Catálogo de rudimentos y grooves con práctica integrada
// ============================================================

import React, { useState } from 'react';
import { Rudimento, Groove } from '../../../types/academy';
import { RUDIMENTOS_PAS } from '../data/rudimentos';
import { GROOVES_CATALOG } from '../data/grooves';
import MetronomeScreen from './MetronomeScreen';

type Tab = 'rudimentos' | 'grooves' | 'metronomo';

interface LibraryScreenProps {
  onBack?: () => void;
}

export default function LibraryScreen({ onBack }: LibraryScreenProps) {
  const [activeTab, setActiveTab] = useState<'rudimentos' | 'grooves' | 'metronomo'>('rudimentos');
  const [selectedRudiment, setSelectedRudiment] = useState<Rudimento | null>(null);
  const [selectedGroove, setSelectedGroove] = useState<Groove | null>(null);
  const [filterDificultad, setFilterDificultad] = useState<string>('todos');
  const [filterEstilo, setFilterEstilo] = useState<string>('todos');

  // Filtrar rudimentos
  const filteredRudiments = RUDIMENTOS_PAS.filter(r => 
    filterDificultad === 'todos' || r.dificultad === filterDificultad
  );

  // Filtrar grooves
  const filteredGrooves = GROOVES_CATALOG.filter(g => {
    const matchDificultad = filterDificultad === 'todos' || g.dificultad === filterDificultad;
    const matchEstilo = filterEstilo === 'todos' || g.estilo === filterEstilo;
    return matchDificultad && matchEstilo;
  });

  // Obtener estilos únicos
  const estilos = Array.from(new Set(GROOVES_CATALOG.map(g => g.estilo)));

  // Renderizar patrón visual de groove
  const renderGroovePattern = (groove: Groove) => {
    const instruments = [
      { key: 'kick', label: 'Bombo', color: 'bg-red-500' },
      { key: 'snare', label: 'Caja', color: 'bg-yellow-500' },
      { key: 'hihat', label: 'Hi-Hat', color: 'bg-blue-400' },
      { key: 'hihatOpen', label: 'HH Abierto', color: 'bg-cyan-400' },
      { key: 'ride', label: 'Ride', color: 'bg-green-400' },
      { key: 'crossStick', label: 'Cross Stick', color: 'bg-purple-400' },
    ].filter(inst => groove.patron[inst.key as keyof typeof groove.patron]);

    return (
      <div className="space-y-1">
        {instruments.map(inst => {
          const pattern = groove.patron[inst.key as keyof typeof groove.patron] || [];
          return (
            <div key={inst.key} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-20">{inst.label}</span>
              <div className="flex gap-0.5">
                {pattern.map((hit, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded ${
                      hit ? inst.color : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Vista de metrónomo
  if (activeTab === 'metronomo') {
    return (
      <div>
        <MetronomeScreen onBack={() => setActiveTab('rudimentos')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📚 Biblioteca de Estudio</h1>
            <p className="text-gray-400">Rudimentos, grooves y metrónomo</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('rudimentos')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'rudimentos'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🥁 Rudimentos ({RUDIMENTOS_PAS.length})
          </button>
          <button
            onClick={() => setActiveTab('grooves')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'grooves'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎶 Grooves ({GROOVES_CATALOG.length})
          </button>
          <button
            onClick={() => setActiveTab('metronomo')}
            className="px-6 py-3 rounded-lg font-medium transition-all bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            🎵 Metrónomo
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Dificultad</label>
              <select
                value={filterDificultad}
                onChange={(e) => setFilterDificultad(e.target.value)}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg"
              >
                <option value="todos">Todos</option>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            {activeTab === 'grooves' && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">Estilo</label>
                <select
                  value={filterEstilo}
                  onChange={(e) => setFilterEstilo(e.target.value)}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                >
                  <option value="todos">Todos</option>
                  {estilos.map(estilo => (
                    <option key={estilo} value={estilo}>{estilo}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        {activeTab === 'rudimentos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRudiments.map(rudiment => (
              <div
                key={rudiment.id}
                onClick={() => setSelectedRudiment(rudiment)}
                className="bg-gray-800/50 backdrop-blur rounded-xl p-4 cursor-pointer hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold">{rudiment.nombre}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rudiment.dificultad === 'basico' ? 'bg-green-600 text-white' :
                    rudiment.dificultad === 'intermedio' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {rudiment.dificultad}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{rudiment.descripcion}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{rudiment.categoria}</span>
                  <span>BPM: {rudiment.bpmObjetivo}</span>
                </div>
                {rudiment.notacion && (
                  <div className="mt-2 text-orange-400 font-mono text-sm">
                    {rudiment.notacion}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'grooves' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGrooves.map(groove => (
              <div
                key={groove.id}
                onClick={() => setSelectedGroove(groove)}
                className="bg-gray-800/50 backdrop-blur rounded-xl p-4 cursor-pointer hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-bold">{groove.nombre}</h3>
                    <p className="text-gray-400 text-sm">{groove.estilo} • {groove.compas}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    groove.dificultad === 'basico' ? 'bg-green-600 text-white' :
                    groove.dificultad === 'intermedio' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {groove.dificultad}
                  </span>
                </div>
                <div className="mb-3">
                  {renderGroovePattern(groove)}
                </div>
                <p className="text-gray-400 text-sm">{groove.descripcion}</p>
                <div className="mt-2 text-xs text-gray-500">
                  BPM sugerido: {groove.bpmSugerido}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de detalle de rudimento */}
        {selectedRudiment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedRudiment.nombre}</h2>
                  <p className="text-gray-400">{selectedRudiment.categoria}</p>
                </div>
                <button
                  onClick={() => setSelectedRudiment(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-300">{selectedRudiment.descripcion}</p>
                </div>
                {selectedRudiment.notacion && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Notación</h3>
                    <div className="bg-gray-900 rounded-lg p-4 text-orange-400 font-mono text-lg">
                      {selectedRudiment.notacion}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold mb-2">BPM Objetivo</h3>
                  <div className="text-3xl font-bold text-orange-500">{selectedRudiment.bpmObjetivo}</div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('metronomo');
                      setSelectedRudiment(null);
                    }}
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold"
                  >
                    🎵 Practicar con Metrónomo
                  </button>
                  <button
                    onClick={() => setSelectedRudiment(null)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalle de groove */}
        {selectedGroove && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedGroove.nombre}</h2>
                  <p className="text-gray-400">{selectedGroove.estilo} • {selectedGroove.compas}</p>
                </div>
                <button
                  onClick={() => setSelectedGroove(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Patrón</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    {renderGroovePattern(selectedGroove)}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-300">{selectedGroove.descripcion}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">BPM Sugerido</h3>
                  <div className="text-3xl font-bold text-orange-500">{selectedGroove.bpmSugerido}</div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('metronomo');
                      setSelectedGroove(null);
                    }}
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold"
                  >
                    🎵 Practicar con Metrónomo
                  </button>
                  <button
                    onClick={() => setSelectedGroove(null)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
