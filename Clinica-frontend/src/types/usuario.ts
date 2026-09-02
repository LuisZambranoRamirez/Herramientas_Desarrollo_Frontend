import type { UserRole } from './enums'

export interface Usuario {
  username: string
  activo: boolean
  user_role: UserRole
  fecha_registro: string
}

export interface CrearUsuarioDto {
  username: string
  password: string
  user_role: UserRole
}

export interface ActualizarUsuarioDto {
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