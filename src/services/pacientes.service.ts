import type {
  Paciente,
  CrearPacienteDto,
  ActualizarPacienteDto,
} from '@/types'
import { api } from '@/services/api/client'

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
    return api.get<Paciente[]>('/pacientes')
  },

  getByDni(dni: string): Promise<Paciente | undefined> {
    return api.get<Paciente>(`/pacientes/${dni}`)
  },

  create(data: CrearPacienteDto): Promise<Paciente> {
    validarDatosPaciente(data)
    return api.post<Paciente>('/pacientes', data)
  },

  update(dni: string, data: ActualizarPacienteDto): Promise<Paciente> {
    validarDatosPaciente({ dni, ...data })
    return api.put<Paciente>(`/pacientes/${dni}`, data)
  },

  delete(dni: string): Promise<void> {
    return api.delete<void>(`/pacientes/${dni}`)
  },
}