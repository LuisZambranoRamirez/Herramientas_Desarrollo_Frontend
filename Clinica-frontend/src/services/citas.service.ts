// src/services/citas.service.ts

import { api } from './api/client'

import type {
  Cita,
  CrearCitaDto,
  ActualizarCitaDto,
  EstadoCita,
} from '@/types'

export const citasService = {
  getAll(): Promise<Cita[]> {
    return api.get<Cita[]>(
      '/citas',
    )
  },

  getById(
    id: string,
  ): Promise<Cita> {
    return api.get<Cita>(
      `/citas/${id}`,
    )
  },

  getByPaciente(
    dniPaciente: string,
  ): Promise<Cita[]> {
    return api.get<Cita[]>(
      `/citas/paciente/${dniPaciente}`,
    )
  },

  getByOdontologo(
    dniOdontologo: string,
  ): Promise<Cita[]> {
    return api.get<Cita[]>(
      `/citas/odontologo/${dniOdontologo}`,
    )
  },

  getByEstado(
    estado: EstadoCita,
  ): Promise<Cita[]> {
    return api.get<Cita[]>(
      `/citas/estado/${estado}`,
    )
  },

  create(
    data: CrearCitaDto,
  ): Promise<Cita> {
    return api.post<Cita>(
      '/citas',
      data,
    )
  },

  update(
    id: string,
    data: ActualizarCitaDto,
  ): Promise<Cita> {
    return api.patch<Cita>(
      `/citas/${id}`,
      data,
    )
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(
      `/citas/${id}`,
    )
  },
}
