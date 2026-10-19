import type {
  Pago,
  CrearPagoDto,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import { pagoApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE PAGOS
// ============================================================

export const pagosService = {
  getAll(): Promise<Pago[]> {
    if (env.useMock) {
      return pagoApi.getAll()
    }
    return api.get<Pago[]>('/pagos')
  },

  getById(id: string): Promise<Pago | undefined> {
    if (env.useMock) {
      return pagoApi.getAll().then(
        pagos => pagos.find(pago => pago.pago_id === id),
      )
    }
    return api.get<Pago>(`/pagos/${id}`)
  },

  getByTratamiento(tratamientoId: string): Promise<Pago[]> {
    if (env.useMock) {
      return pagoApi.getByTratamiento(tratamientoId)
    }
    return api.get<Pago[]>(`/pagos/tratamiento/${tratamientoId}`)
  },

  create(data: CrearPagoDto): Promise<Pago> {
    if (env.useMock) {
      return pagoApi.create(data)
    }
    return api.post<Pago>('/pagos', data)
  },
}