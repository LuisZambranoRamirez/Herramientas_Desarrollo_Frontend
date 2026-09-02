import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pacientesService } from '@/services/pacientes.service'
import type { Paciente, CrearPacienteDto, ActualizarPacienteDto } from '@/types'

export const usePacientesStore = defineStore('pacientes', () => {
  const pacientes = ref<Paciente[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPacientes() {
    isLoading.value = true
    error.value = null
    try {
      pacientes.value = await pacientesService.getAll()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar pacientes'
    } finally {
      isLoading.value = false
    }
  }

  async function crearPaciente(data: CrearPacienteDto) {
    isLoading.value = true
    error.value = null
    try {
      const nuevo = await pacientesService.create(data)
      pacientes.value.push(nuevo)
      return nuevo
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al crear paciente'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function actualizarPaciente(dni: string, data: ActualizarPacienteDto) {
    isLoading.value = true
    error.value = null
    try {
      const actualizado = await pacientesService.update(dni, data)
      const idx = pacientes.value.findIndex(p => p.dni === dni)
      if (idx !== -1) pacientes.value[idx] = actualizado
      return actualizado
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar paciente'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function eliminarPaciente(dni: string) {
    isLoading.value = true
    error.value = null
    try {
      await pacientesService.delete(dni)
      pacientes.value = pacientes.value.filter(p => p.dni !== dni)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar paciente'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { pacientes, isLoading, error, fetchPacientes, crearPaciente, actualizarPaciente, eliminarPaciente }
})
