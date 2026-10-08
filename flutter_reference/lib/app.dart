// ============================================================
// DrumPro Academy - Widget principal de la aplicación
// Maneja el tema, internacionalización y enrutamiento
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'core/theme/app_theme.dart';
import 'core/constants/app_routes.dart';
import 'core/constants/app_strings.dart';
import 'features/auth/presentation/auth_provider.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/admin/presentation/admin_dashboard.dart';
import 'features/profesor/presentation/profesor_dashboard.dart';
import 'features/alumno/presentation/alumno_dashboard.dart';

/// Widget principal de la aplicación
class DrumProAcademyApp extends ConsumerWidget {
  const DrumProAcademyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Observar el estado de autenticación
    final authState = ref.watch(authStateProvider);
    
    // Configurar el enrutador
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      // Configuración básica
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      
      // Tema Material 3
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark, // Modo oscuro por defecto
      
      // Internacionalización
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('es', 'ES'), // Español
        Locale('en', 'US'), // Inglés
      ],
      locale: const Locale('es', 'ES'),
      
      // Router
      routerConfig: router,
    );
  }
}

/// Provider del enrutador con go_router
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  
  return GoRouter(
    initialLocation: AppRoutes.login,
    redirect: (context, state) {
      // Si no está autenticado, redirigir a login
      if (!authState.isAuthenticated && state.uri.path != AppRoutes.login) {
        return AppRoutes.login;
      }
      
      // Si está autenticado y va a login, redirigir según rol
      if (authState.isAuthenticated && state.uri.path == AppRoutes.login) {
        switch (authState.user?.role) {
          case UserRole.admin:
            return AppRoutes.adminDashboard;
          case UserRole.profesor:
            return AppRoutes.profesorDashboard;
          case UserRole.alumno:
            return AppRoutes.alumnoDashboard;
          default:
            return AppRoutes.login;
        }
      }
      
      return null;
    },
    routes: [
      // Ruta de login
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginScreen(),
      ),
      
      // Rutas de administrador
      GoRoute(
        path: AppRoutes.adminDashboard,
        builder: (context, state) => const AdminDashboard(),
      ),
      
      // Rutas de profesor
      GoRoute(
        path: AppRoutes.profesorDashboard,
        builder: (context, state) => const ProfesorDashboard(),
      ),
      
      // Rutas de alumno
      GoRoute(
        path: AppRoutes.alumnoDashboard,
        builder: (context, state) => const AlumnoDashboard(),
      ),
    ],
  );
});
