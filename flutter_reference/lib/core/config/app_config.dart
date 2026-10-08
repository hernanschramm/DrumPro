// ============================================================
// DrumPro Academy - Configuración general de la app
// ============================================================

/// Configuración general de la aplicación
class AppConfig {
  /// Nombre de la aplicación
  static const String appName = 'DrumPro Academy';
  
  /// Versión de la aplicación
  static const String appVersion = '1.0.0';
  
  /// URL del servidor de audio (para procesamiento de stems)
  static const String audioServerUrl = String.fromEnvironment(
    'AUDIO_SERVER_URL',
    defaultValue: 'https://audio.drumpro.com/api',
  );
  
  /// Configuración de almacenamiento
  static const int maxUploadSizeMB = 100; // MB
  static const int maxVideoDurationSeconds = 180; // 3 minutos
  
  /// Configuración de caché
  static const int cacheExpiryDays = 7;
  
  /// Configuración de metrónomo
  static const int metronomeMinBPM = 20;
  static const int metronomeMaxBPM = 400;
  
  /// Configuración de videollamada
  static const String jitsiDomain = 'meet.jit.si';
  
  /// Configuración de planes
  static const String planFreeId = 'plan_free';
  static const String planStudentId = 'plan_student_premium';
  static const String planTeacherId = 'plan_teacher';
}
