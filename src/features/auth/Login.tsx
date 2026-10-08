// ============================================================
// DrumPro Academy - Pantalla de Login
// ============================================================

import React, { useState } from 'react';
import { useAcademy } from '../../store/AcademyContext';
import { UserRole } from '../../types/academy';

export default function Login() {
  const { state, dispatch } = useAcademy();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Login simulado (en producción sería con Supabase Auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = state.users.find(u => u.email === email);
    if (!user) {
      setError('Usuario no encontrado');
      return;
    }

    if (!user.isActive) {
      setError('Tu cuenta está desactivada. Contacta al administrador.');
      return;
    }

    // En producción: verificar password con Supabase
    // Aquí aceptamos cualquier password para demo
    dispatch({ type: 'LOGIN', payload: user });
  };

  // Login rápido para demo
  const quickLogin = (role: UserRole) => {
    const user = state.users.find(u => u.role === role);
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥁</div>
          <h1 className="text-4xl font-bold text-white mb-2">DrumPro Academy</h1>
          <p className="text-gray-300">Plataforma de enseñanza de batería</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Demo rápido */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-gray-300 text-sm mb-3">Acceso rápido (demo):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
              >
                👤 Admin
              </button>
              <button
                onClick={() => quickLogin('profesor')}
                className="py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
              >
                🎓 Profesor
              </button>
              <button
                onClick={() => quickLogin('alumno')}
                className="py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors"
              >
                🎵 Alumno
              </button>
            </div>
          </div>

          {/* Info de demo */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-200">
              <strong>Emails de demo:</strong><br />
              Admin: admin@drumpro.com<br />
              Profesor: carlos@drumpro.com<br />
              Alumno: juan@drumpro.com<br />
              <em>(Cualquier contraseña funciona)</em>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>¿Olvidaste tu contraseña? <a href="#" className="text-orange-400 hover:text-orange-300">Recuperar</a></p>
        </div>
      </div>
    </div>
  );
}
