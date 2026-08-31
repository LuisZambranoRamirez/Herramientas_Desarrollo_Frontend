import type {
  EstadoTratamiento,
  TratamientoOdontologico,
} from './enums'

export interface TratamientoPaciente {
  tratamiento_paciente_id: string
  dni_paciente: string
  dni_odontologo: string
  observaciones: string
  precio: number
  tratamiento: TratamientoOdontologico
  estado: EstadoTratamiento
  fecha_registro: string
}

export interface CrearTratamientoPacienteDto {
  dni_paciente: string
  dni_odontologo: string
  observaciones: string
  precio: number
  tratamiento: TratamientoOdontologico
}

export interface ActualizarTratamientoPacienteDto {
  observaciones?: string
  precio?: number
  estado?: EstadoTratamiento
}

import type { DiaSemana } from './enums'

export interface AgendaTratamiento {
  agenda_tratamientos_id: string
  id_tratamiento_paciente: string
  dia_semana: DiaSemana
  hora_inicio: string
  hora_fin: string
  fecha_registro: string
}

export interface CrearAgendaTratamientoDto {
  id_tratamiento_paciente: string
  dia_semana: DiaSemana
  hora_inicio: string
  hora_fin: string
}

export interface ActualizarAgendaTratamientoDto {
  dia_semana?: DiaSemana
  hora_inicio?: string
  hora_fin?: string
}
