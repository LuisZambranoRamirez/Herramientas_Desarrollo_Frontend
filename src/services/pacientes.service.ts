import type {
  Paciente,
  CrearPacienteDto,
  ActualizarPacienteDto,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import { pacienteApi } from '@/services/mock-api'

// ============================================================
// FUNCIONES DE VALIDACIÓN PRIVADAS
// ============================================================
// Cambia esto:
// const validarDatosPaciente = (data: { dni?: string; nombres?: string; apellidos?: string; telefono?: string }) => {

// Por esto (más flexible para TypeScript):
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
    return pacienteApi.getAll()
  },

  getByDni(dni: string): Promise<Paciente | undefined> {
    return pacienteApi.getByDni(dni)
  },

  create(data: CrearPacienteDto): Promise<Paciente> {
    // Validamos estrictamente antes de enviar al mock/API
    validarDatosPaciente(data)

    return pacienteApi.create(data)
  },

  update(dni: string, data: ActualizarPacienteDto): Promise<Paciente> {
    // Validamos el DNI y los campos que se estén actualizando
    validarDatosPaciente({ dni, ...data })

    return pacienteApi.update(dni, data)
  },

  delete(dni: string): Promise<void> {
    return pacienteApi.delete(dni)
  },
}