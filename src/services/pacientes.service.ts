// src/services/pacientes.service.ts

import { api } from './api/client'

import type {
  Paciente,
  CrearPacienteDto,
  ActualizarPacienteDto,
} from '@/types'

export const pacientesService = {
  getAll(): Promise<Paciente[]> {
    return api.get<Paciente[]>(
      '/pacientes',
    )
  },

  getByDni(
    dni: string,
  ): Promise<Paciente> {
    return api.get<Paciente>(
      `/pacientes/${dni}`,
    )
  },

  create(
    data: CrearPacienteDto,
  ): Promise<Paciente> {
    return api.post<Paciente>(
      '/pacientes',
      data,
    )
  },

  update(
    dni: string,
    data: ActualizarPacienteDto,
  ): Promise<Paciente> {
    return api.patch<Paciente>(
      `/pacientes/${dni}`,
      data,
    )
  },

  delete(dni: string): Promise<void> {
    return api.delete<void>(
      `/pacientes/${dni}`,
    )
  },
}
