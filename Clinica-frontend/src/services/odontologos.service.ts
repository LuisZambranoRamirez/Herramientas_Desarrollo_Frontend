// src/services/odontologos.service.ts

import { api } from './api/client'

import type {
  Odontologo,
  HorarioPersonal,
  Especialidad,
  DiaSemana,
} from '@/types'

export const odontologosService = {
  getAll(): Promise<Odontologo[]> {
    return api.get<Odontologo[]>(
      '/odontologos',
    )
  },

  getByDni(
    dni: string,
  ): Promise<Odontologo> {
    return api.get<Odontologo>(
      `/odontologos/${dni}`,
    )
  },

  getByEspecialidad(
    especialidad: Especialidad,
  ): Promise<Odontologo[]> {
    return api.get<Odontologo[]>(
      `/odontologos/especialidad/${especialidad}`,
    )
  },

  getHorarios(
    dni: string,
  ): Promise<HorarioPersonal[]> {
    return api.get<HorarioPersonal[]>(
      `/odontologos/${dni}/horarios`,
    )
  },

  getHorariosByDia(
    dni: string,
    dia: DiaSemana,
  ): Promise<HorarioPersonal[]> {
    return api.get<HorarioPersonal[]>(
      `/odontologos/${dni}/horarios/${dia}`,
    )
  },
}
