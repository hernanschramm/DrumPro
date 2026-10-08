// ============================================================
// DrumPro Academy - Estado de autenticación
// ============================================================

import 'package:equatable/equatable.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Roles de usuario en la plataforma
enum UserRole {
  admin,
  profesor,
  alumno,
}

/// Extensión para convertir String a UserRole
extension UserRoleExtension on String {
  UserRole toUserRole() {
    switch (this) {
      case 'admin':
        return UserRole.admin;
      case 'profesor':
        return UserRole.profesor;
      case 'alumno':
        return UserRole.alumno;
      default:
        return UserRole.alumno;
    }
  }
}

/// Modelo de usuario de la aplicación
class AppUser extends Equatable {
  final String id;
  final String email;
  final String fullName;
  final UserRole role;
  final String? avatarUrl;
  final String? phone;
  final String? bio;
  final String? profesorId; // Solo para alumnos
  final bool isActive;
  final DateTime createdAt;

  const AppUser({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.avatarUrl,
    this.phone,
    this.bio,
    this.profesorId,
    this.isActive = true,
    required this.createdAt,
  });

  /// Crear desde un mapa de Supabase
  factory AppUser.fromMap(Map<String, dynamic> map) {
    return AppUser(
      id: map['id'] as String,
      email: map['email'] as String,
      fullName: map['full_name'] as String,
      role: (map['role'] as String).toUserRole(),
      avatarUrl: map['avatar_url'] as String?,
      phone: map['phone'] as String?,
      bio: map['bio'] as String?,
      profesorId: map['profesor_id'] as String?,
      isActive: map['is_active'] as bool? ?? true,
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }

  /// Convertir a mapa para Supabase
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'role': role.name,
      'avatar_url': avatarUrl,
      'phone': phone,
      'bio': bio,
      'profesor_id': profesorId,
      'is_active': isActive,
      'created_at': createdAt.toIso8601String(),
    };
  }

  @override
  List<Object?> get props => [
        id,
        email,
        fullName,
        role,
        avatarUrl,
        phone,
        bio,
        profesorId,
        isActive,
        createdAt,
      ];
}

/// Estado de autenticación
class AuthState extends Equatable {
  final bool isLoading;
  final AppUser? user;
  final String? error;

  const AuthState({
    this.isLoading = false,
    this.user,
    this.error,
  });

  /// ¿Está autenticado?
  bool get isAuthenticated => user != null;

  /// Copiar con nuevos valores
  AuthState copyWith({
    bool? isLoading,
    AppUser? user,
    String? error,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      error: error,
    );
  }

  @override
  List<Object?> get props => [isLoading, user, error];
}
