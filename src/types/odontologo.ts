import type { Especialidad } from './enums'

export interface Odontologo {
  dni: string
  colegiatura: string
  especialidad: Especialidad
  username: string
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
