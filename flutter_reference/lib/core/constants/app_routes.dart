// ============================================================
// DrumPro Academy - Rutas de la aplicación
// ============================================================

/// Rutas de navegación de la aplicación
class AppRoutes {
  // Autenticación
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  
  // Administrador
  static const String adminDashboard = '/admin';
  static const String adminUsers = '/admin/users';
  static const String adminMetrics = '/admin/metrics';
  static const String adminCatalog = '/admin/catalog';
  static const String adminSubscriptions = '/admin/subscriptions';
  
  // Profesor
  static const String profesorDashboard = '/profesor';
  static const String profesorStudents = '/profesor/students';
  static const String profesorClasses = '/profesor/classes';
  static const String profesorTasks = '/profesor/tasks';
  static const String profesorEvaluations = '/profesor/evaluations';
  static const String profesorStudentDetail = '/profesor/student/:id';
  
  // Alumno
  static const String alumnoDashboard = '/alumno';
  static const String alumnoTasks = '/alumno/tasks';
  static const String alumnoClasses = '/alumno/classes';
  static const String alumnoLibrary = '/alumno/library';
  static const String alumnoProgress = '/alumno/progress';
  static const String alumnoMultitrack = '/alumno/multitrack';
  
  // Compartidas
  static const String classDetail = '/class/:id';
  static const String taskDetail = '/task/:id';
  static const String videoCall = '/video-call/:id';
  static const String settings = '/settings';
  static const String profile = '/profile';
}
