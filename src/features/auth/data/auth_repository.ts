// ============================================================
// DrumPro Academy - Repositorio de Autenticación
// Capa de datos: maneja la comunicación con Supabase Auth
// ============================================================

import { UserProfile, UserRole } from '../../../types/academy';

/**
 * Repositorio de autenticación
 * En producción usaría Supabase Auth real
 * Aquí simulamos la lógica para la demo web
 */
export class AuthRepository {
  private storageKey = 'drumpro_auth';

  /**
   * Iniciar sesión con email y contraseña
   */
  async signIn(email: string, password: string, users: UserProfile[]): Promise<UserProfile> {
    // Simular delay de red
    await this.delay(800);

    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuario no encontrado. Verifica tu email.');
    }

    if (!user.isActive) {
      throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
    }

    // En producción: verificar password con Supabase Auth
    // Aquí aceptamos cualquier password para demo
    
    // Guardar sesión
    this.saveSession(user);
    
    return user;
  }

  /**
   * Registrar nuevo usuario
   */
  async signUp(
    email: string, 
    password: string, 
    fullName: string,
    role: UserRole,
    profesorId?: string
  ): Promise<UserProfile> {
    await this.delay(1000);

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role,
      profesorId,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return newUser;
  }

  /**
   * Cerrar sesión
   */
  async signOut(): Promise<void> {
    await this.delay(300);
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Obtener usuario actual desde sesión guardada
   */
  getCurrentUser(): UserProfile | null {
    try {
      const session = localStorage.getItem(this.storageKey);
      if (!session) return null;
      return JSON.parse(session);
    } catch {
      return null;
    }
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async resetPassword(email: string): Promise<void> {
    await this.delay(1000);
    // En producción: Supabase.auth.resetPasswordForEmail(email)
    console.log(`Email de recuperación enviado a: ${email}`);
  }

  /**
   * Guardar sesión en localStorage
   */
  private saveSession(user: UserProfile): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  /**
   * Utilidad para simular delay de red
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instancia singleton
export const authRepository = new AuthRepository();
