// ============================================================
// DrumPro - Biblioteca de Canciones y Setlists
// CRUD de canciones, setlists con drag & drop
// ============================================================

import React, { useState } from 'react';
import { useAppState, defaultMetronomeConfig } from '../../store/AppContext';
import { Song, Setlist, TimeSignature, SongSection } from '../../types';

// --- Generar ID único ---
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// --- Vista de Canciones ---
function SongsView() {
  const { state, dispatch } = useAppState();
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptySong: Song = {
    id: '',
    title: '',
    artist: '',
    bpm: 120,
    timeSignature: '4/4',
    duration: '',
    notes: '',
    sections: [],
    metronomeConfig: { ...defaultMetronomeConfig },
  };

  const [form, setForm] = useState<Song>(emptySong);

  const handleSave = () => {
    if (!form.title.trim()) return;
    
    if (editingSong) {
      dispatch({ type: 'UPDATE_SONG', payload: { ...form, id: editingSong.id } });
    } else {
      dispatch({ type: 'ADD_SONG', payload: { ...form, id: generateId() } });
    }
    setShowForm(false);
    setEditingSong(null);
    setForm(emptySong);
  };

  const handleEdit = (song: Song) => {
    setForm(song);
    setEditingSong(song);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta canción?')) {
      dispatch({ type: 'DELETE_SONG', payload: id });
    }
  };

  const addSection = () => {
    setForm({
      ...form,
      sections: [...form.sections, { name: 'Nueva sección', bars: 8 }],
    });
  };

  if (showForm) {
    return (
      <div className="flex flex-col h-full overflow-y-auto pb-20">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">
            {editingSong ? 'Editar Canción' : 'Nueva Canción'}
          </h2>
          <button onClick={() => { setShowForm(false); setEditingSong(null); }} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="px-4 py-3 space-y-3">
          <div>
            <label className="text-xs text-gray-400">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mt-1"
              placeholder="Nombre de la canción"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Artista</label>
            <input
              type="text"
              value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mt-1"
              placeholder="Nombre del artista"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400">BPM</label>
              <input
                type="number"
                value={form.bpm}
                onChange={(e) => setForm({ ...form, bpm: parseInt(e.target.value) || 120 })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Compás</label>
              <select
                value={form.timeSignature}
                onChange={(e) => setForm({ ...form, timeSignature: e.target.value as TimeSignature })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mt-1"
              >
                <option value="2/4">2/4</option>
                <option value="3/4">3/4</option>
                <option value="4/4">4/4</option>
                <option value="5/4">5/4</option>
                <option value="6/8">6/8</option>
                <option value="7/8">7/8</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400">Duración</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mt-1"
              placeholder="3:45"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Notas (grooves, fills, cortes)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mt-1 h-20 resize-none"
              placeholder="Notas sobre la batería..."
            />
          </div>

          {/* Secciones */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Estructura</label>
              <button onClick={addSection} className="text-xs text-orange-400 hover:text-orange-300">+ Sección</button>
            </div>
            <div className="space-y-2 mt-2">
              {form.sections.map((section, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => {
                      const newSections = [...form.sections];
                      newSections[i] = { ...newSections[i], name: e.target.value };
                      setForm({ ...form, sections: newSections });
                    }}
                    className="flex-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    value={section.bars}
                    onChange={(e) => {
                      const newSections = [...form.sections];
                      newSections[i] = { ...newSections[i], bars: parseInt(e.target.value) || 8 };
                      setForm({ ...form, sections: newSections });
                    }}
                    className="w-16 bg-gray-700 text-white rounded px-2 py-1 text-sm text-center"
                  />
                  <button
                    onClick={() => setForm({ ...form, sections: form.sections.filter((_, idx) => idx !== i) })}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 mt-auto">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-orange-500 hover:bg-orange-400 rounded-xl text-white font-bold"
          >
            {editingSong ? 'Actualizar' : 'Guardar'} Canción
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">Canciones ({state.songs.length})</h2>
        <button
          onClick={() => { setForm(emptySong); setEditingSong(null); setShowForm(true); }}
          className="w-8 h-8 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center text-white font-bold"
        >
          +
        </button>
      </div>

      {state.songs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
          <div className="text-4xl mb-2">🎵</div>
          <p className="text-center text-sm">No hay canciones aún. Toca + para agregar una.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-700">
          {state.songs.map(song => (
            <div key={song.id} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{song.title}</div>
                <div className="text-gray-400 text-xs truncate">
                  {song.artist && `${song.artist} • `}
                  {song.bpm} BPM • {song.timeSignature}
                  {song.duration && ` • ${song.duration}`}
                </div>
              </div>
              <button
                onClick={() => handleEdit(song)}
                className="text-blue-400 hover:text-blue-300 p-2"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(song.id)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Vista de Setlists ---
function SetlistsView() {
  const { state, dispatch } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const handleSave = () => {
    if (!formName.trim()) return;
    
    if (editingId) {
      dispatch({
        type: 'UPDATE_SETLIST',
        payload: { id: editingId, name: formName, songIds: selectedSongs, createdAt: Date.now() },
      });
    } else {
      dispatch({
        type: 'ADD_SETLIST',
        payload: { id: generateId(), name: formName, songIds: selectedSongs, createdAt: Date.now() },
      });
    }
    setShowForm(false);
    setFormName('');
    setSelectedSongs([]);
    setEditingId(null);
  };

  const handleEdit = (setlist: Setlist) => {
    setFormName(setlist.name);
    setSelectedSongs([...setlist.songIds]);
    setEditingId(setlist.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este setlist?')) {
      dispatch({ type: 'DELETE_SETLIST', payload: id });
    }
  };

  const moveSong = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedSongs.length) return;
    const newSongs = [...selectedSongs];
    [newSongs[index], newSongs[newIndex]] = [newSongs[newIndex], newSongs[index]];
    setSelectedSongs(newSongs);
  };

  // Calcular duración total
  const getTotalDuration = (songIds: string[]): string => {
    let totalSeconds = 0;
    songIds.forEach(id => {
      const song = state.songs.find(s => s.id === id);
      if (song?.duration) {
        const parts = song.duration.split(':');
        if (parts.length === 2) {
          totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      }
    });
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (showForm) {
    const availableSongs = state.songs.filter(s => !selectedSongs.includes(s.id));
    
    return (
      <div className="flex flex-col h-full overflow-y-auto pb-20">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">
            {editingId ? 'Editar Setlist' : 'Nuevo Setlist'}
          </h2>
          <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="px-4 py-3 space-y-3">
          <div>
            <label className="text-xs text-gray-400">Nombre del setlist</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 mt-1"
              placeholder="Ej: Show Sábado"
            />
          </div>

          {/* Canciones seleccionadas */}
          <div>
            <label className="text-xs text-gray-400">Canciones en el set ({selectedSongs.length})</label>
            <div className="space-y-1 mt-1">
              {selectedSongs.map((songId, i) => {
                const song = state.songs.find(s => s.id === songId);
                if (!song) return null;
                return (
                  <div key={songId} className="flex items-center gap-2 bg-gray-700/50 rounded px-2 py-1">
                    <span className="text-gray-400 text-xs w-5">{i + 1}.</span>
                    <span className="flex-1 text-white text-sm truncate">{song.title}</span>
                    <button onClick={() => moveSong(i, -1)} className="text-gray-400 hover:text-white text-xs">↑</button>
                    <button onClick={() => moveSong(i, 1)} className="text-gray-400 hover:text-white text-xs">↓</button>
                    <button
                      onClick={() => setSelectedSongs(selectedSongs.filter(id => id !== songId))}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agregar canciones */}
          <div>
            <label className="text-xs text-gray-400">Agregar canciones</label>
            <div className="space-y-1 mt-1 max-h-40 overflow-y-auto">
              {availableSongs.map(song => (
                <button
                  key={song.id}
                  onClick={() => setSelectedSongs([...selectedSongs, song.id])}
                  className="w-full text-left px-2 py-1 bg-gray-700/30 hover:bg-gray-700 rounded text-sm text-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-400">+</span>
                  <span className="truncate">{song.title}</span>
                  <span className="text-gray-500 text-xs ml-auto">{song.bpm} BPM</span>
                </button>
              ))}
              {availableSongs.length === 0 && (
                <p className="text-gray-500 text-xs text-center py-2">No hay más canciones disponibles</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 mt-auto">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-orange-500 hover:bg-orange-400 rounded-xl text-white font-bold"
          >
            {editingId ? 'Actualizar' : 'Crear'} Setlist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">Setlists ({state.setlists.length})</h2>
        <button
          onClick={() => { setFormName(''); setSelectedSongs([]); setEditingId(null); setShowForm(true); }}
          className="w-8 h-8 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center text-white font-bold"
        >
          +
        </button>
      </div>

      {state.setlists.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-center text-sm">No hay setlists. Crea uno para organizar tus shows.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-700">
          {state.setlists.map(setlist => (
            <div key={setlist.id} className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-white font-medium">{setlist.name}</div>
                  <div className="text-gray-400 text-xs">
                    {setlist.songIds.length} canciones • Duración: {getTotalDuration(setlist.songIds)}
                  </div>
                </div>
                <button onClick={() => handleEdit(setlist)} className="text-blue-400 hover:text-blue-300 p-2">✏️</button>
                <button onClick={() => handleDelete(setlist.id)} className="text-red-400 hover:text-red-300 p-2">🗑️</button>
              </div>
              {/* Lista de canciones del setlist */}
              <div className="mt-2 space-y-0.5">
                {setlist.songIds.map((songId, i) => {
                  const song = state.songs.find(s => s.id === songId);
                  if (!song) return null;
                  return (
                    <div key={songId} className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{i + 1}.</span>
                      <span className="truncate">{song.title}</span>
                      <span className="ml-auto text-gray-600">{song.bpm} BPM</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Componente principal con tabs ---
export default function SongsSetlists() {
  const [tab, setTab] = useState<'songs' | 'setlists'>('songs');

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setTab('songs')}
          className={`flex-1 py-2 text-sm font-medium transition-colors
            ${tab === 'songs' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400'}
          `}
        >
          🎵 Canciones
        </button>
        <button
          onClick={() => setTab('setlists')}
          className={`flex-1 py-2 text-sm font-medium transition-colors
            ${tab === 'setlists' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400'}
          `}
        >
          📋 Setlists
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-hidden">
        {tab === 'songs' ? <SongsView /> : <SetlistsView />}
      </div>
    </div>
  );
}
