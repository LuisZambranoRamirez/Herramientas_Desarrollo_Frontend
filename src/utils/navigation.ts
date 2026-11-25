/**
 * Utilidades centralizadas de navegación y control de acceso basado en roles (RBAC).
 */

/**
 * Extrae y normaliza el rol de un usuario o payload de respuesta:
 * Soporta:
 * - Cadena directa: 'ODONTOLOGO', 'odontologo', ' Odontólogo '
 * - user_role: 'ODONTOLOGO'
 * - role: 'ODONTOLOGO'
 * - rol: 'ODONTOLOGO'
 * - rol: { nombre_rol: 'ODONTOLOGO' } o { nombre: 'ODONTOLOGO' }
 * - Limpieza de espacios y normalización a mayúsculas sin tildes.
 */
export function extractUserRole(data: any): string | null {
  if (!data) return null

  let candidate: any = null

  if (typeof data === 'string') {
    candidate = data
  } else if (typeof data === 'object') {
    // Si viene anidado en user / usuario
    const target = data.user || data.usuario || data

    candidate =
      target.user_role ||
      target.role ||
      target.rol?.nombre_rol ||
      target.rol?.nombre ||
      target.rol?.rol ||
      (typeof target.rol === 'string' ? target.rol : null) ||
      data.user_role ||
      data.role ||
      data.rol?.nombre_rol ||
      data.rol?.nombre ||
      (typeof data.rol === 'string' ? data.rol : null)
  }

  if (typeof candidate === 'string') {
    // Eliminar espacios en blanco y convertir a mayúsculas
    let clean = candidate.trim().toUpperCase()
    // Eliminar tildes (ej. ODONTÓLOGO -> ODONTOLOGO)
    clean = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return clean || null
  }

  return null
}

/**
 * Retorna la ruta por defecto según el rol del usuario autenticado.
 * - SYSTEM_ADMIN / ADMIN -> /dashboard
 * - ODONTOLOGO / DOCTOR  -> /odontologo/dashboard
 * - PACIENTE / CLIENTE   -> /paciente/dashboard
 *
 * @param role Rol del usuario (cadena u objeto de usuario)
 * @returns Ruta relativa de redirección
 */
export function getDefaultRouteByRole(role?: any): string {
  const normalized = extractUserRole(role)

  if (!normalized) {
    return '/login'
  }

  switch (normalized) {
    case 'ODONTOLOGO':
    case 'DOCTOR':
      return '/odontologo/dashboard'
    case 'PACIENTE':
    case 'CLIENTE':
      return '/paciente/dashboard'
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
    case 'ADMINISTRADOR':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}

/**
 * Retorna la etiqueta legible en español correspondiente a un rol.
 */
export function getRoleLabel(role?: any): string {
  const normalized = extractUserRole(role)
  if (!normalized) return 'Invitado'

  switch (normalized) {
    case 'ODONTOLOGO':
    case 'DOCTOR':
      return 'Odontólogo'
    case 'PACIENTE':
    case 'CLIENTE':
      return 'Paciente'
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
    case 'ADMINISTRADOR':
      return 'Administrador'
    default:
      return normalized.charAt(0) + normalized.slice(1).toLowerCase()
  }
}
