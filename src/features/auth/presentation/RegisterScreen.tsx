// ============================================================
// DrumPro Academy - Pantalla de Registro
// Fase 2: Autenticación completa
// ============================================================

import React, { useState } from 'react';
import { useAcademy } from '../../../store/AcademyContext';
import { UserRole } from '../../../types/academy';

interface RegisterScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function RegisterScreen({ onBack, onSuccess }: RegisterScreenProps) {
  const { state, dispatch } = useAcademy();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'alumno' as UserRole,
    profesorId: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const profesores = state.users.filter(u => u.role === 'profesor');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.fullName.trim()) {
      setError('Ingresa tu nombre completo');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.role === 'alumno' && !formData.profesorId) {
      setError('Selecciona un profesor');
      return;
    }

    // Verificar si el email ya existe
    if (state.users.some(u => u.email === formData.email)) {
      setError('Este email ya está registrado');
      return;
    }

    setIsLoading(true);

    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser = {
      id: `user-${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      profesorId: formData.role === 'alumno' ? formData.profesorId : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_USER', payload: newUser });
    setIsLoading(false);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥁</div>
          <h1 className="text-4xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-gray-300">Únete a DrumPro Academy</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Nombre completo</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tu nombre"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Confirmar contraseña</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Soy</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="alumno" className="bg-gray-800">Alumno</option>
                <option value="profesor" className="bg-gray-800">Profesor</option>
              </select>
            </div>

            {/* Profesor (solo para alumnos) */}
            {formData.role === 'alumno' && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Mi profesor</label>
                <select
                  value={formData.profesorId}
                  onChange={(e) => setFormData({ ...formData, profesorId: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="" className="bg-gray-800">Selecciona tu profesor</option>
                  {profesores.map(p => (
                    <option key={p.id} value={p.id} className="bg-gray-800">{p.fullName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button onClick={onBack} className="text-orange-400 hover:text-orange-300 font-medium">
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
