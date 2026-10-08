// ============================================================
// DrumPro Academy - Aplicación Principal
// Fase 2: Autenticación completa con navegación
// ============================================================

import React, { useState, useEffect } from 'react';
import { AcademyProvider, useAcademy } from './store/AcademyContext';
import LoginScreen from './features/auth/presentation/LoginScreen';
import RegisterScreen from './features/auth/presentation/RegisterScreen';
import ForgotPasswordScreen from './features/auth/presentation/ForgotPasswordScreen';
import AdminPanel from './features/admin/presentation/AdminPanel';
import ProfesorPanel from './features/profesor/presentation/ProfesorPanel';
import AlumnoPanel from './features/alumno/presentation/AlumnoPanel';
import { authRepository } from './features/auth/data/auth_repository';

// Pantallas de autenticación
type AuthScreen = 'login' | 'register' | 'forgot-password';

// Componente que maneja la autenticación
function AuthFlow() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  switch (currentScreen) {
    case 'login':
      return (
        <LoginScreen
          onNavigateToRegister={() => setCurrentScreen('register')}
          onNavigateToForgotPassword={() => setCurrentScreen('forgot-password')}
        />
      );
    case 'register':
      return (
        <RegisterScreen
          onBack={() => setCurrentScreen('login')}
          onSuccess={() => setCurrentScreen('login')}
        />
      );
    case 'forgot-password':
      return <ForgotPasswordScreen onBack={() => setCurrentScreen('login')} />;
    default:
      return null;
  }
}

// Componente que renderiza el panel según el rol del usuario
function AppContent() {
  const { state, dispatch } = useAcademy();

  // Verificar sesión al cargar
  useEffect(() => {
    const currentUser = authRepository.getCurrentUser();
    if (currentUser) {
      dispatch({ type: 'LOGIN', payload: currentUser });
    }
  }, [dispatch]);

  // Si no hay usuario logueado, mostrar flujo de autenticación
  if (!state.currentUser) {
    return <AuthFlow />;
  }

  // Renderizar panel según rol
  const renderPanel = () => {
    switch (state.currentUser!.role) {
      case 'admin':
        return <AdminPanel />;
      case 'profesor':
        return <ProfesorPanel />;
      case 'alumno':
        return <AlumnoPanel />;
      default:
        return <div>Role no reconocido</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Barra superior con info del usuario y logout */}
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🥁</span>
          <span className="font-bold">DrumPro Academy</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-300">{state.currentUser.fullName}</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
              state.currentUser.role === 'admin' ? 'bg-purple-600' :
              state.currentUser.role === 'profesor' ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              {state.currentUser.role}
            </span>
          </div>
          <button
            onClick={async () => {
              await authRepository.signOut();
              dispatch({ type: 'LOGOUT' });
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Panel principal */}
      <div className="flex-1 overflow-hidden">
        {renderPanel()}
      </div>
    </div>
  );
}

// Export con Provider
export default function App() {
  return (
    <AcademyProvider>
      <AppContent />
    </AcademyProvider>
  );
}
