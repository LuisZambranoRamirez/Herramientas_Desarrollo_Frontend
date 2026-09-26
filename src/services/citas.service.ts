import type {
  Cita,
  CrearCitaDto,
  ActualizarCitaDto,
  EstadoCita,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import { citaApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE CITAS
// ============================================================

export const citasService = {
  getAll(): Promise<Cita[]> {
    if (env.useMock) {
      return citaApi.getAll()
    }
    return api.get<Cita[]>('/citas')
  },

  getById(id: string): Promise<Cita | undefined> {
    if (env.useMock) {
      return citaApi.getById(id)
    }
    return api.get<Cita>(`/citas/${id}`)
  },

  getByPaciente(dniPaciente: string): Promise<Cita[]> {
    if (env.useMock) {
      return citaApi.getByPaciente(dniPaciente)
    }
    return api.get<Cita[]>(`/citas/paciente/${dniPaciente}`)
  },

  getByOdontologo(dniOdontologo: string): Promise<Cita[]> {
    if (env.useMock) {
      return citaApi.getByOdontologo(dniOdontologo)
    }
    return api.get<Cita[]>(`/citas/odontologo/${dniOdontologo}`)
  },

  getByEstado(estado: EstadoCita): Promise<Cita[]> {
    if (env.useMock) {
      return citaApi.getByEstado(estado)
    }
    return api.get<Cita[]>(`/citas/estado/${estado}`)
  },

  create(data: CrearCitaDto): Promise<Cita> {
    if (env.useMock) {
      return citaApi.create(data)
    }
    return api.post<Cita>('/citas', data)
  },

  update(id: string, data: ActualizarCitaDto): Promise<Cita> {
    if (env.useMock) {
      return citaApi.update(id, data)
    }
    return api.patch<Cita>(`/citas/${id}`, data)
  },

  delete(id: string): Promise<void> {
    if (env.useMock) {
      return citaApi.delete(id)
    }
    return api.delete<void>(`/citas/${id}`)
  },
}
