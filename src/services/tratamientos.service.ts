import type {
  TratamientoPaciente,
  CrearTratamientoPacienteDto,
  ActualizarTratamientoPacienteDto,
  AgendaTratamiento,
  CrearAgendaTratamientoDto,
  EstadoTratamiento,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import {
  tratamientoApi,
  agendaTratamientoApi,
} from '@/services/mock-api'

// ============================================================
// SERVICIO DE TRATAMIENTOS
// ============================================================

export const tratamientosService = {
  getAll(): Promise<TratamientoPaciente[]> {
    if (env.useMock) {
      return tratamientoApi.getAll()
    }
    return api.get<TratamientoPaciente[]>('/tratamientos')
  },

  getById(id: string): Promise<TratamientoPaciente | undefined> {
    if (env.useMock) {
      return tratamientoApi.getById(id)
    }
    return api.get<TratamientoPaciente>(`/tratamientos/${id}`)
  },

  getByPaciente(dni: string): Promise<TratamientoPaciente[]> {
    if (env.useMock) {
      return tratamientoApi.getByPaciente(dni)
    }
    return api.get<TratamientoPaciente[]>(`/tratamientos/paciente/${dni}`)
  },

  getByEstado(estado: EstadoTratamiento): Promise<TratamientoPaciente[]> {
    if (env.useMock) {
      return tratamientoApi.getByEstado(estado)
    }
    return api.get<TratamientoPaciente[]>(`/tratamientos/estado/${estado}`)
  },

  create(data: CrearTratamientoPacienteDto): Promise<TratamientoPaciente> {
    if (env.useMock) {
      return tratamientoApi.create(data)
    }
    return api.post<TratamientoPaciente>('/tratamientos', data)
  },

  update(
    id: string,
    data: ActualizarTratamientoPacienteDto,
  ): Promise<TratamientoPaciente> {
    if (env.useMock) {
      return tratamientoApi.update(id, data)
    }
    return api.patch<TratamientoPaciente>(`/tratamientos/${id}`, data)
  },

  getAgenda(tratamientoId: string): Promise<AgendaTratamiento[]> {
    if (env.useMock) {
      return agendaTratamientoApi.getByTratamiento(tratamientoId)
    }
    return api.get<AgendaTratamiento[]>(`/tratamientos/${tratamientoId}/agenda`)
  },

  createAgenda(data: CrearAgendaTratamientoDto): Promise<AgendaTratamiento> {
    if (env.useMock) {
      throw new Error('createAgenda aún no está implementado en el mock API')
    }
    return api.post<AgendaTratamiento>('/tratamientos/agenda', data)
  },
}