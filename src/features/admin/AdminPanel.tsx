// ============================================================
// DrumPro Academy - Panel de Administrador
// ============================================================

import React, { useState } from 'react';
import { useAcademy } from '../../store/AcademyContext';
import { UserProfile, UserRole } from '../../types/academy';

export default function AdminPanel() {
  const { state, dispatch } = useAcademy();
  const [activeTab, setActiveTab] = useState<'usuarios' | 'metricas' | 'catalogo'>('usuarios');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'alumno' as UserRole,
    profesorId: '',
  });

  const profesores = state.users.filter(u => u.role === 'profesor');
  const alumnos = state.users.filter(u => u.role === 'alumno');

  const handleSave = () => {
    if (!formData.fullName || !formData.email) return;

    if (editingUser) {
      dispatch({
        type: 'UPDATE_USER',
        payload: { ...editingUser, ...formData },
      });
    } else {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_USER', payload: newUser });
    }

    setShowForm(false);
    setEditingUser(null);
    setFormData({ fullName: '', email: '', role: 'alumno', profesorId: '' });
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profesorId: user.profesorId || '',
    });
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      dispatch({ type: 'DELETE_USER', payload: userId });
    }
  };

  const handleToggleActive = (user: UserProfile) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { ...user, isActive: !user.isActive },
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white px-6 py-4">
        <h1 className="text-2xl font-bold">👤 Panel de Administrador</h1>
        <p className="text-purple-100 text-sm">Gestión de usuarios y métricas globales</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'usuarios'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Usuarios ({state.users.length})
        </button>
        <button
          onClick={() => setActiveTab('metricas')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'metricas'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Métricas
        </button>
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`flex-1 py-3 font-medium transition-colors ${
            activeTab === 'catalogo'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Catálogo
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'usuarios' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ fullName: '', email: '', role: 'alumno', profesorId: '' });
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
              >
                + Nuevo Usuario
              </button>
            </div>

            {/* Formulario */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="alumno">Alumno</option>
                      <option value="profesor">Profesor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  {formData.role === 'alumno' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profesor asignado</label>
                      <select
                        value={formData.profesorId}
                        onChange={(e) => setFormData({ ...formData, profesorId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Seleccionar profesor</option>
                        {profesores.map(p => (
                          <option key={p.id} value={p.id}>{p.fullName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
                  >
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de usuarios */}
            <div className="space-y-3">
              {state.users.map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      user.role === 'admin' ? 'bg-purple-500' :
                      user.role === 'profesor' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'profesor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                        {!user.isActive && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Inactivo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        user.isActive
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metricas' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Métricas Globales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-3xl font-bold text-purple-600">{state.users.length}</div>
                <div className="text-gray-600 mt-2">Usuarios totales</div>
                <div className="text-sm text-gray-500 mt-1">
                  {profesores.length} profesores, {alumnos.length} alumnos
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-3xl font-bold text-blue-600">{state.clases.length}</div>
                <div className="text-gray-600 mt-2">Clases programadas</div>
                <div className="text-sm text-gray-500 mt-1">
                  {state.clases.filter(c => c.estado === 'programada').length} próximas
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-3xl font-bold text-green-600">{state.tareas.length}</div>
                <div className="text-gray-600 mt-2">Tareas creadas</div>
                <div className="text-sm text-gray-500 mt-1">
                  {state.asignaciones.filter(a => a.estado === 'pendiente').length} pendientes
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalogo' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Catálogo Base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Rudimentos ({state.rudimentos.length})</h3>
                <div className="space-y-2">
                  {state.rudimentos.slice(0, 5).map(r => (
                    <div key={r.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{r.nombre}</span>
                      <span className="text-sm text-gray-500">{r.dificultad}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Grooves ({state.grooves.length})</h3>
                <div className="space-y-2">
                  {state.grooves.map(g => (
                    <div key={g.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{g.nombre}</span>
                      <span className="text-sm text-gray-500">{g.estilo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
