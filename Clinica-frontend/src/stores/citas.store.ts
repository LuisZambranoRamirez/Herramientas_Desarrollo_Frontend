import { defineStore } from 'pinia'
import { ref } from 'vue'
import { citasService } from '@/services/citas.service'
import type { Cita, EstadoCita } from '@/types'

export const useCitasStore = defineStore('citas', () => {
  const citas = ref<Cita[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function fetchCitas() {
    isLoading.value = true
    error.value = null
    try {
      const data = await citasService.getAll()
      citas.value = data
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Error al obtener las citas'
      }
    } finally {
      isLoading.value = false
    }
  }

  async function updateEstadoCita(id: string, nuevoEstado: EstadoCita) {
    isLoading.value = true
    error.value = null
    try {
      await citasService.update(id, { estado: nuevoEstado })

      const cita = citas.value.find(c => c.cita_id === id)
      if (cita) {
        cita.estado = nuevoEstado
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Error al actualizar la cita'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    citas,
    isLoading,
    error,
    fetchCitas,
    updateEstadoCita,
  }
})
