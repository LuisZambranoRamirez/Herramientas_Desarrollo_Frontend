// src/services/insumos.service.ts

import { api } from './api/client'

import type {
  Insumo,
  CrearInsumoDto,
  ActualizarInsumoDto,
  InsumoComprado,
  CrearInsumoCompradoDto,
  ConsumoInsumo,
  CrearConsumoInsumoDto,
} from '@/types'

export const insumosService = {
  getAll(): Promise<Insumo[]> {
    return api.get<Insumo[]>(
      '/insumos',
    )
  },

  getById(
    id: string,
  ): Promise<Insumo> {
    return api.get<Insumo>(
      `/insumos/${id}`,
    )
  },

  getStockBajo(): Promise<Insumo[]> {
    return api.get<Insumo[]>(
      '/insumos/stock-bajo',
    )
  },

  create(
    data: CrearInsumoDto,
  ): Promise<Insumo> {
    return api.post<Insumo>(
      '/insumos',
      data,
    )
  },

  update(
    id: string,
    data: ActualizarInsumoDto,
  ): Promise<Insumo> {
    return api.patch<Insumo>(
      `/insumos/${id}`,
      data,
    )
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(
      `/insumos/${id}`,
    )
  },

  getCompras(
    id: string,
  ): Promise<InsumoComprado[]> {
    return api.get<InsumoComprado[]>(
      `/insumos/${id}/compras`,
    )
  },

  createCompra(
    data: CrearInsumoCompradoDto,
  ): Promise<InsumoComprado> {
    return api.post<InsumoComprado>(
      '/insumos/compras',
      data,
    )
  },

  getConsumos(): Promise<ConsumoInsumo[]> {
    return api.get<ConsumoInsumo[]>(
      '/insumos/consumos',
    )
  },

  createConsumo(
    data: CrearConsumoInsumoDto,
  ): Promise<ConsumoInsumo> {
    return api.post<ConsumoInsumo>(
      '/insumos/consumos',
      data,
    )
  },
}
