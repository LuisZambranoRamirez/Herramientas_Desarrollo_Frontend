import type {
  Insumo,
  CrearInsumoDto,
  ActualizarInsumoDto,
  InsumoComprado,
  CrearInsumoCompradoDto,
  ConsumoInsumo,
  CrearConsumoInsumoDto,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import {
  insumoApi,
  insumoCompradoApi,
  consumoInsumoApi,
} from '@/services/mock-api'

// ============================================================
// SERVICIO DE INSUMOS
// ============================================================

export const insumosService = {
  getAll(): Promise<Insumo[]> {
    if (env.useMock) {
      return insumoApi.getAll()
    }
    return api.get<Insumo[]>('/insumos')
  },

  getById(id: string): Promise<Insumo | undefined> {
    if (env.useMock) {
      return insumoApi.getById(id)
    }
    return api.get<Insumo>(`/insumos/${id}`)
  },

  getStockBajo(): Promise<Insumo[]> {
    if (env.useMock) {
      return insumoApi.getStockBajo()
    }
    return api.get<Insumo[]>('/insumos/stock-bajo')
  },

  create(data: CrearInsumoDto): Promise<Insumo> {
    if (env.useMock) {
      return insumoApi.create(data)
    }
    return api.post<Insumo>('/insumos', data)
  },

  update(id: string, data: ActualizarInsumoDto): Promise<Insumo> {
    if (env.useMock) {
      return insumoApi.update(id, data)
    }
    return api.patch<Insumo>(`/insumos/${id}`, data)
  },

  delete(id: string): Promise<void> {
    if (env.useMock) {
      return insumoApi.delete(id)
    }
    return api.delete<void>(`/insumos/${id}`)
  },

  getCompras(id: string): Promise<InsumoComprado[]> {
    if (env.useMock) {
      return insumoCompradoApi.getByInsumo(id)
    }
    return api.get<InsumoComprado[]>(`/insumos/${id}/compras`)
  },

  createCompra(data: CrearInsumoCompradoDto): Promise<InsumoComprado> {
    if (env.useMock) {
      return insumoCompradoApi.create(data)
    }
    return api.post<InsumoComprado>('/insumos/compras', data)
  },

  getConsumos(): Promise<ConsumoInsumo[]> {
    if (env.useMock) {
      return consumoInsumoApi.getAll()
    }
    return api.get<ConsumoInsumo[]>('/insumos/consumos')
  },

  createConsumo(data: CrearConsumoInsumoDto): Promise<ConsumoInsumo> {
    if (env.useMock) {
      return consumoInsumoApi.create(data)
    }
    return api.post<ConsumoInsumo>('/insumos/consumos', data)
  },
}