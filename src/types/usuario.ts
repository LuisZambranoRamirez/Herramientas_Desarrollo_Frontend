import type { UserRole } from './enums'

export interface Usuario {
  username: string
  nombre_completo?: string
  correo?: string
  telefono?: string
  activo: boolean
  user_role: UserRole
  fecha_registro: string
  ultimo_acceso?: string
}

export interface CrearUsuarioDto {
  username: string
  password: string
  nombre_completo?: string
  correo?: string
  telefono?: string
  user_role: UserRole
  activo?: boolean
}

export interface ActualizarUsuarioDto {
  nombre_completo?: string
  correo?: string
  telefono?: string
  activo?: boolean
  user_role?: UserRole
}

export interface CambiarPasswordDto {
  password: string
}

export interface LoginDto {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: Usuario
}