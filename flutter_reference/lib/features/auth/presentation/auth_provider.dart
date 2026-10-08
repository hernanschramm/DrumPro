// ============================================================
// DrumPro Academy - Provider de autenticación
// ============================================================

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'auth_state.dart';

/// Servicio de autenticación con Supabase
class AuthService {
  final SupabaseClient _supabase = Supabase.instance.client;

  /// Iniciar sesión con email y contraseña
  Future<AppUser> signInWithEmail(String email, String password) async {
    try {
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );

      if (response.user == null) {
        throw Exception('Usuario no encontrado');
      }

      // Obtener el perfil del usuario
      final profile = await _supabase
          .from('profiles')
          .select()
          .eq('id', response.user!.id)
          .single();

      if (!profile['is_active']) {
        throw Exception('Tu cuenta está desactivada. Contacta al administrador.');
      }

      return AppUser.fromMap(profile);
    } catch (e) {
      throw Exception('Error al iniciar sesión: ${e.toString()}');
    }
  }

  /// Cerrar sesión
  Future<void> signOut() async {
    await _supabase.auth.signOut();
  }

  /// Obtener usuario actual
  Future<AppUser?> getCurrentUser() async {
    final session = _supabase.auth.currentSession;
    if (session == null) return null;

    try {
      final profile = await _supabase
          .from('profiles')
          .select()
          .eq('id', session.user.id)
          .single();

      return AppUser.fromMap(profile);
    } catch (e) {
      return null;
    }
  }
}

/// Provider del servicio de autenticación
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

/// Provider del estado de autenticación
final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authServiceProvider));
});

/// Notifier del estado de autenticación
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;

  AuthNotifier(this._authService) : super(const AuthState()) {
    // Verificar si hay un usuario autenticado al iniciar
    _checkCurrentUser();
  }

  /// Verificar usuario actual
  Future<void> _checkCurrentUser() async {
    state = state.copyWith(isLoading: true);
    
    try {
      final user = await _authService.getCurrentUser();
      state = state.copyWith(isLoading: false, user: user);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  /// Iniciar sesión
  Future<void> signIn(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final user = await _authService.signInWithEmail(email, password);
      state = state.copyWith(isLoading: false, user: user);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  /// Cerrar sesión
  Future<void> signOut() async {
    state = state.copyWith(isLoading: true);
    
    try {
      await _authService.signOut();
      state = const AuthState();
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}
