import type { EstadoCita } from './enums'

export interface CitaPacienteResumen {
  dni: string
  nombres: string
  apellidos: string
  telefono?: string | null
  correo?: string | null
}

export interface CitaOdontologoResumen {
  dni: string
  nombres: string
  apellidos: string
  especialidad: string
  colegiatura: string
}

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
  paciente?: CitaPacienteResumen | null
  odontologo?: CitaOdontologoResumen | null
}

export interface CrearCitaDto {
  dni_paciente?: string
  dni_odontologo: string
  fecha: string
  hora: string
  motivo_consulta: string
  diagnostico?: string | null
}

export interface ActualizarCitaDto {
  dni_paciente?: string
  dni_odontologo?: string
  fecha?: string
  hora?: string
  motivo_consulta?: string
  diagnostico?: string | null
  estado?: EstadoCita
}
