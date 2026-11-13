import type { Especialidad } from './enums'

export interface Odontologo {
  dni: string
  colegiatura: string
  especialidad: Especialidad
  username: string
  nombres?: string
  apellidos?: string
  telefono?: string
  correo?: string
  activo?: boolean
  fecha_registro?: string
}

export interface CrearOdontologoDto {
  dni: string
  colegiatura: string
  especialidad: Especialidad
  username: string
}

export interface ActualizarOdontologoDto {
  especialidad?: Especialidad
}
