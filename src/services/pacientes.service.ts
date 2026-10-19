import type {
  Paciente,
  CrearPacienteDto,
  ActualizarPacienteDto,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import { pacienteApi } from '@/services/mock-api'

// ============================================================
// FUNCIONES DE VALIDACIÓN PRIVADAS
// ============================================================
const validarDatosPaciente = (data: Record<string, any>) => {
  const regexDni = /^\d{8}$/
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  const regexTelefono = /^\d{9}$/

  if (data.dni !== undefined && data.dni !== '') {
    if (!regexDni.test(data.dni)) {
      throw new Error('Validación fallida: El DNI debe contener exactamente 8 números.')
    }
  }

  if (data.nombres !== undefined) {
    if (!data.nombres.trim() || !regexLetras.test(data.nombres)) {
      throw new Error('Validación fallida: Los nombres son obligatorios y solo deben contener letras.')
    }
  }

  if (data.apellidos !== undefined) {
    if (!data.apellidos.trim() || !regexLetras.test(data.apellidos)) {
      throw new Error('Validación fallida: Los apellidos son obligatorios y solo deben contener letras.')
    }
  }

  if (data.telefono !== undefined && data.telefono !== '') {
    if (!regexTelefono.test(data.telefono)) {
      throw new Error('Validación fallida: El teléfono debe contener exactamente 9 números.')
    }
  }
}

// ============================================================
// SERVICIO DE PACIENTES
// ============================================================

export const pacientesService = {
  getAll(): Promise<Paciente[]> {
    if (env.useMock) {
      return pacienteApi.getAll()
    }
    return api.get<Paciente[]>('/pacientes')
  },

  getByDni(dni: string): Promise<Paciente | undefined> {
    if (env.useMock) {
      return pacienteApi.getByDni(dni)
    }
    return api.get<Paciente>(`/pacientes/${dni}`)
  },

  create(data: CrearPacienteDto): Promise<Paciente> {
    // Validamos estrictamente antes de enviar al mock/API
    validarDatosPaciente(data)

    if (env.useMock) {
      return pacienteApi.create(data)
    }
    return api.post<Paciente>('/pacientes', data)
  },

  update(dni: string, data: ActualizarPacienteDto): Promise<Paciente> {
    // Validamos el DNI y los campos que se estén actualizando
    validarDatosPaciente({ dni, ...data })

    if (env.useMock) {
      return pacienteApi.update(dni, data)
    }
    return api.patch<Paciente>(`/pacientes/${dni}`, data)
  },

  delete(dni: string): Promise<void> {
    if (env.useMock) {
      return pacienteApi.delete(dni)
    }
    return api.delete<void>(`/pacientes/${dni}`)
  },
}