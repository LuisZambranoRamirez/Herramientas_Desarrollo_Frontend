import type { DiaSemana } from './enums'

export interface HorarioPersonal {
  horario_odontologo_id: string
  dni: string
  dia_semana: DiaSemana
  hora_inicio: string
  hora_fin: string
}

export interface CrearHorarioPersonalDto {
  dni: string
  dia_semana: DiaSemana
  hora_inicio: string
  hora_fin: string
}

export interface ActualizarHorarioPersonalDto {
  dia_semana?: DiaSemana
  hora_inicio?: string
  hora_fin?: string
}
