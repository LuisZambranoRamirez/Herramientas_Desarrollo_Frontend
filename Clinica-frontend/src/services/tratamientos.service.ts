// src/services/tratamientos.service.ts

import { api } from './api/client'

import type {
  TratamientoPaciente,
  CrearTratamientoPacienteDto,
  ActualizarTratamientoPacienteDto,
  AgendaTratamiento,
  CrearAgendaTratamientoDto,
  EstadoTratamiento,
} from '@/types'

export const tratamientosService = {
  getAll(): Promise<TratamientoPaciente[]> {
    return api.get<TratamientoPaciente[]>(
      '/tratamientos',
    )
  },

  getById(
    id: string,
  ): Promise<TratamientoPaciente> {
    return api.get<TratamientoPaciente>(
      `/tratamientos/${id}`,
    )
  },

  getByPaciente(
    dni: string,
  ): Promise<TratamientoPaciente[]> {
    return api.get<TratamientoPaciente[]>(
      `/tratamientos/paciente/${dni}`,
    )
  },

  getByEstado(
    estado: EstadoTratamiento,
  ): Promise<TratamientoPaciente[]> {
    return api.get<TratamientoPaciente[]>(
      `/tratamientos/estado/${estado}`,
    )
  },

  create(
    data: CrearTratamientoPacienteDto,
  ): Promise<TratamientoPaciente> {
    return api.post<TratamientoPaciente>(
      '/tratamientos',
      data,
    )
  },

  update(
    id: string,
    data: ActualizarTratamientoPacienteDto,
  ): Promise<TratamientoPaciente> {
    return api.patch<TratamientoPaciente>(
      `/tratamientos/${id}`,
      data,
    )
  },

  getAgenda(
    tratamientoId: string,
  ): Promise<AgendaTratamiento[]> {
    return api.get<AgendaTratamiento[]>(
      `/tratamientos/${tratamientoId}/agenda`,
    )
  },

  createAgenda(
    data: CrearAgendaTratamientoDto,
  ): Promise<AgendaTratamiento> {
    return api.post<AgendaTratamiento>(
      '/tratamientos/agenda',
      data,
    )
  },
}
