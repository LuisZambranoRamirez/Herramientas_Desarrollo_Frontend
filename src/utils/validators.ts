/**
 * Utilidades centralizadas y consistentes de validación en tiempo real para formularios.
 * Reglas sincronizadas con las restricciones del backend (FastAPI / Pydantic v2).
 */

export const REGEX_DNI = /^\d{8}$/
export const REGEX_TELEFONO = /^\d{9}$/
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const REGEX_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
export const REGEX_USERNAME = /^[a-zA-Z0-9._-]+$/

/**
 * Valida que un campo no esté vacío ni contenga solo espacios en blanco.
 */
export function validarRequerido(
  valor: string | number | null | undefined,
  nombreCampo = 'Este campo',
): string {
  if (valor === null || valor === undefined) {
    return `${nombreCampo} es obligatorio.`
  }
  if (typeof valor === 'string' && !valor.trim()) {
    return `${nombreCampo} es obligatorio.`
  }
  return ''
}

/**
 * Valida formato de DNI peruano (exactamente 8 dígitos numéricos).
 */
export function validarDni(dni: string): string {
  const limpio = (dni || '').trim()
  if (!limpio) {
    return 'El DNI es obligatorio.'
  }
  if (!REGEX_DNI.test(limpio)) {
    return 'El DNI debe contener exactamente 8 dígitos numéricos.'
  }
  return ''
}

/**
 * Valida formato de correo electrónico.
 */
export function validarEmail(correo: string): string {
  const limpio = (correo || '').trim().toLowerCase()
  if (!limpio) {
    return 'El correo electrónico es obligatorio.'
  }
  if (!REGEX_EMAIL.test(limpio)) {
    return 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).'
  }
  return ''
}

/**
 * Valida teléfono celular (exactamente 9 dígitos numéricos).
 */
export function validarTelefono(telefono: string, requerido = true): string {
  const limpio = (telefono || '').trim().replace(/\D/g, '')
  if (!limpio) {
    return requerido ? 'El teléfono es obligatorio.' : ''
  }
  if (!REGEX_TELEFONO.test(limpio)) {
    return 'El teléfono debe contener exactamente 9 dígitos numéricos.'
  }
  return ''
}

/**
 * Valida nombres y apellidos (solo letras, espacios y tildes, min 2 y max 100 caracteres).
 */
export function validarNombre(
  nombre: string,
  nombreCampo = 'Los nombres',
): string {
  const limpio = (nombre || '').trim()
  if (!limpio) {
    return `${nombreCampo} son obligatorios.`
  }
  if (limpio.length < 2) {
    return `${nombreCampo} deben tener al menos 2 caracteres.`
  }
  if (limpio.length > 100) {
    return `${nombreCampo} no pueden exceder los 100 caracteres.`
  }
  if (!REGEX_SOLO_LETRAS.test(limpio)) {
    return `${nombreCampo} solo deben contener letras y espacios.`
  }
  return ''
}

/**
 * Valida nombre de usuario para el sistema (alfanumérico, punto, guion, min 3).
 */
export function validarUsername(username: string): string {
  const limpio = (username || '').trim()
  if (!limpio) {
    return 'El nombre de usuario es obligatorio.'
  }
  if (limpio.length < 3) {
    return 'El usuario debe tener al menos 3 caracteres.'
  }
  if (!REGEX_USERNAME.test(limpio)) {
    return 'Solo se permiten letras, números, puntos y guiones.'
  }
  return ''
}

/**
 * Valida política estricta de contraseñas:
 * - Mínimo 8 caracteres
 * - Al menos 1 letra mayúscula (A-Z)
 * - Al menos 1 letra minúscula (a-z)
 * - Al menos 1 número (0-9)
 */
export function validarPassword(password: string): string {
  if (!password) {
    return 'La contraseña es obligatoria.'
  }
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Debe contener al menos una letra mayúscula (A-Z).'
  }
  if (!/[a-z]/.test(password)) {
    return 'Debe contener al menos una letra minúscula (a-z).'
  }
  if (!/[0-9]/.test(password)) {
    return 'Debe contener al menos un número (0-9).'
  }
  return ''
}

/**
 * Valida que la confirmación coincida exactamente con la contraseña.
 */
export function validarConfirmPassword(
  password: string,
  confirmPassword: string,
): string {
  if (!confirmPassword) {
    return 'Debes confirmar la contraseña.'
  }
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden.'
  }
  return ''
}

/**
 * Valida que una fecha no sea anterior al día actual (para citas médicas).
 */
export function validarFechaNoPasada(fechaStr: string): string {
  if (!fechaStr) {
    return 'La fecha es obligatoria.'
  }
  const hoyStr = new Date().toISOString().slice(0, 10)
  if (fechaStr < hoyStr) {
    return 'No se pueden agendar citas en fechas pasadas.'
  }
  return ''
}

/**
 * Valida fecha de nacimiento (no futura, no mayor a 130 años atrás).
 */
export function validarFechaNacimiento(fechaStr: string): string {
  if (!fechaStr) {
    return 'La fecha de nacimiento es obligatoria.'
  }
  const hoy = new Date()
  const fechaIngresada = new Date(fechaStr + 'T00:00:00')

  if (isNaN(fechaIngresada.getTime())) {
    return 'Ingresa una fecha de nacimiento válida.'
  }

  const hoyCero = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  if (fechaIngresada > hoyCero) {
    return 'La fecha de nacimiento no puede ser en el futuro.'
  }

  const anioMinimo = hoy.getFullYear() - 130
  if (fechaIngresada.getFullYear() < anioMinimo) {
    return 'La fecha de nacimiento no puede ser de hace más de 130 años.'
  }

  return ''
}

/**
 * Valida montos y precios positivos (> 0).
 */
export function validarMontoPositivo(
  monto: number | string,
  nombreCampo = 'El precio',
): string {
  const num = typeof monto === 'number' ? monto : parseFloat(monto)
  if (isNaN(num)) {
    return `${nombreCampo} debe ser un valor numérico válido.`
  }
  if (num <= 0) {
    return `${nombreCampo} debe ser mayor a cero.`
  }
  return ''
}

