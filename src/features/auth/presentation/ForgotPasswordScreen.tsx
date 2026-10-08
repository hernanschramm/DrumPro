// ============================================================
// DrumPro Academy - Pantalla de Recuperación de Contraseña
// Fase 2: Autenticación completa
// ============================================================

import React, { useState } from 'react';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export default function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Ingresa un email válido');
      return;
    }

    setIsLoading(true);

    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-4xl font-bold text-white mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-300">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {success ? (
            // Mensaje de éxito
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-white mb-4">¡Email Enviado!</h2>
              <p className="text-gray-300 mb-6">
                Hemos enviado un enlace de recuperación a <strong className="text-white">{email}</strong>
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Revisa tu bandeja de entrada y sigue las instrucciones del email.
              </p>
              <button
                onClick={onBack}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg"
              >
                Volver al Login
              </button>
            </div>
          ) : (
            // Formulario
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="tu@email.com"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
              >
                ← Volver al Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
