import type {
  Odontologo,
  HorarioPersonal,
  Especialidad,
  DiaSemana,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import {
  odontologoApi,
  horarioApi,
} from '@/services/mock-api'

// ============================================================
// SERVICIO DE ODONTÓLOGOS
// ============================================================

export const odontologosService = {
  getAll(): Promise<Odontologo[]> {
    if (env.useMock) {
      return odontologoApi.getAll()
    }
    return api.get<Odontologo[]>('/odontologos')
  },

  getByDni(dni: string): Promise<Odontologo | undefined> {
    if (env.useMock) {
      return odontologoApi.getByDni(dni)
    }
    return api.get<Odontologo>(`/odontologos/${dni}`)
  },

  getByEspecialidad(especialidad: Especialidad): Promise<Odontologo[]> {
    if (env.useMock) {
      return odontologoApi.getByEspecialidad(especialidad)
    }
    return api.get<Odontologo[]>(`/odontologos/especialidad/${especialidad}`)
  },

  getHorarios(dni: string): Promise<HorarioPersonal[]> {
    if (env.useMock) {
      return horarioApi.getByOdontologo(dni)
    }
    return api.get<HorarioPersonal[]>(`/odontologos/${dni}/horarios`)
  },

  getHorariosByDia(dni: string, dia: DiaSemana): Promise<HorarioPersonal[]> {
    if (env.useMock) {
      return horarioApi.getByOdontologo(dni).then(
        horarios =>
          horarios.filter(
            horario => horario.dia_semana === dia,
          ),
      )
    }
    return api.get<HorarioPersonal[]>(`/odontologos/${dni}/horarios/${dia}`)
  },
}