/**
 * Utilidades centralizadas de navegación y control de acceso basado en roles (RBAC).
 */

/**
 * Retorna la ruta por defecto según el rol del usuario autenticado.
 * - SYSTEM_ADMIN / ADMIN -> /dashboard
 * - ODONTOLOGO           -> /odontologo/dashboard
 * - PACIENTE / CLIENTE   -> /paciente/dashboard
 *
 * @param role Rol del usuario
 * @returns Ruta relativa de redirección
 */
export function getDefaultRouteByRole(role?: string | null): string {
  if (!role) {
    return '/login'
  }

  const normalized = role.toUpperCase().trim()

  switch (normalized) {
    case 'ODONTOLOGO':
      return '/odontologo/dashboard'
    case 'PACIENTE':
    case 'CLIENTE':
      return '/paciente/dashboard'
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}

/**
 * Retorna la etiqueta legible en español correspondiente a un rol.
 */
export function getRoleLabel(role?: string | null): string {
  if (!role) return 'Invitado'

  const normalized = role.toUpperCase().trim()

  switch (normalized) {
    case 'ODONTOLOGO':
      return 'Odontólogo'
    case 'PACIENTE':
    case 'CLIENTE':
      return 'Paciente'
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
      return 'Administrador'
    default:
      return role
  }
}

