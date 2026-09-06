import type { EstadoCita } from './enums'

export interface Cita {
  cita_id: string
  dni_paciente: string
  dni_odontologo: string
  fecha: string
  hora: string
  motivo_consulta: string
  diagnostico: string | null
  estado: EstadoCita
  fecha_registro: string
}

export interface CrearCitaDto {
  dni_paciente: string
  dni_odontologo: string
  fecha: string
  hora: string
  motivo_consulta: string
}

export interface ActualizarCitaDto {
  fecha?: string
  hora?: string
  estado?: EstadoCita
}
