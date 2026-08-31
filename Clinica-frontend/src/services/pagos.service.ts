// src/services/pagos.service.ts

import { api } from './api/client'

import type {
  Pago,
  CrearPagoDto,
} from '@/types'

export const pagosService = {
  getAll(): Promise<Pago[]> {
    return api.get<Pago[]>(
      '/pagos',
    )
  },

  getById(
    id: string,
  ): Promise<Pago> {
    return api.get<Pago>(
      `/pagos/${id}`,
    )
  },

  getByTratamiento(
    tratamientoId: string,
  ): Promise<Pago[]> {
    return api.get<Pago[]>(
      `/pagos/tratamiento/${tratamientoId}`,
    )
  },

  create(
    data: CrearPagoDto,
  ): Promise<Pago> {
    return api.post<Pago>(
      '/pagos',
      data,
    )
  },
}
