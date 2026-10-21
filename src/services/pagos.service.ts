import type {
  Pago,
  CrearPagoDto,
} from '@/types'
import { api } from '@/services/api/client'

// ============================================================
// SERVICIO DE PAGOS
// ============================================================

export const pagosService = {
  getAll(): Promise<Pago[]> {
    return api.get<Pago[]>('/pagos')
  },

  getById(id: string): Promise<Pago | undefined> {
    return api.get<Pago>(`/pagos/${id}`)
  },

  getByTratamiento(tratamientoId: string): Promise<Pago[]> {
    return api.get<Pago[]>(`/pagos/tratamiento/${tratamientoId}`)
  },

  create(data: CrearPagoDto): Promise<Pago> {
    return api.post<Pago>('/pagos', data)
  },
}