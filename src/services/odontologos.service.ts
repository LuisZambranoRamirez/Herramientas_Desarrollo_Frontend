import type {
  Odontologo,
  HorarioPersonal,
  Especialidad,
  DiaSemana,
} from '@/types'
import { api } from '@/services/api/client'

// ============================================================
// SERVICIO DE ODONTÓLOGOS
// ============================================================

export const odontologosService = {
  getAll(): Promise<Odontologo[]> {
    return api.get<Odontologo[]>('/odontologos')
  },

  getByDni(dni: string): Promise<Odontologo | undefined> {
    return api.get<Odontologo>(`/odontologos/${dni}`)
  },

  getByEspecialidad(especialidad: Especialidad): Promise<Odontologo[]> {
    return api.get<Odontologo[]>(`/odontologos?especialidad=${especialidad}`)
  },

  getHorarios(dni: string): Promise<HorarioPersonal[]> {
    return api.get<HorarioPersonal[]>(`/odontologos/${dni}/horarios`).catch(() => [])
  },

  getHorariosByDia(dni: string, dia: DiaSemana): Promise<HorarioPersonal[]> {
    return api.get<HorarioPersonal[]>(`/odontologos/${dni}/horarios/${dia}`).catch(() => [])
  },
}