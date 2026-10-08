// ============================================================
// DrumPro Academy - Punto de entrada de la aplicación
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';

import 'core/config/supabase_config.dart';
import 'core/config/app_config.dart';
import 'app.dart';

/// Función principal de la aplicación
Future<void> main() async {
  // Asegurar que los widgets estén inicializados
  WidgetsFlutterBinding.ensureInitialized();

  // Configurar manejo de errores
  FlutterError.onError = (errorDetails) {
    FirebaseCrashlytics.instance.recordFlutterFatalError(errorDetails);
  };

  // Capturar errores asíncronos
  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };

  try {
    // Inicializar Firebase (para Crashlytics, Analytics, FCM)
    await Firebase.initializeApp();
  } catch (e) {
    // Firebase es opcional en desarrollo
    debugPrint('Firebase no inicializado: $e');
  }

  // Inicializar Supabase
  await Supabase.initialize(
    url: SupabaseConfig.url,
    anonKey: SupabaseConfig.anonKey,
    authOptions: const FlutterAuthClientOptions(
      authFlowType: AuthFlowType.pkce,
    ),
  );

  // Ejecutar la app con ProviderScope de Riverpod
  runApp(
    const ProviderScope(
      child: DrumProAcademyApp(),
    ),
  );
}
