// ============================================================
// DrumPro Academy - Configuración de Supabase
// ============================================================

/// Configuración de conexión a Supabase
/// IMPORTANTE: Reemplazar con tus credenciales reales
class SupabaseConfig {
  /// URL de tu proyecto en Supabase
  static const String url = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://TU_PROYECTO.supabase.co',
  );

  /// Clave anónima de Supabase (pública)
  static const String anonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'TU_ANON_KEY_AQUI',
  );

  /// Verificar que la configuración sea válida
  static bool get isConfigured {
    return !url.contains('TU_PROYECTO') && !anonKey.contains('TU_ANON_KEY');
  }
}
