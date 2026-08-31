// src/services/proveedores.service.ts

import { api } from './api/client'

import type {
  Proveedor,
  CrearProveedorDto,
  ActualizarProveedorDto,
} from '@/types'

export const proveedoresService = {
  getAll(): Promise<Proveedor[]> {
    return api.get<Proveedor[]>(
      '/proveedores',
    )
  },

  getByRuc(
    ruc: string,
  ): Promise<Proveedor> {
    return api.get<Proveedor>(
      `/proveedores/${ruc}`,
    )
  },

  create(
    data: CrearProveedorDto,
  ): Promise<Proveedor> {
    return api.post<Proveedor>(
      '/proveedores',
      data,
    )
  },

  update(
    ruc: string,
    data: ActualizarProveedorDto,
  ): Promise<Proveedor> {
    return api.patch<Proveedor>(
      `/proveedores/${ruc}`,
      data,
    )
  },

  delete(ruc: string): Promise<void> {
    return api.delete<void>(
      `/proveedores/${ruc}`,
    )
  },
}
