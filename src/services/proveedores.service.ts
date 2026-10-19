import type {
  Proveedor,
  CrearProveedorDto,
  ActualizarProveedorDto,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import { proveedorApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE PROVEEDORES
// ============================================================

export const proveedoresService = {
  getAll(): Promise<Proveedor[]> {
    if (env.useMock) {
      return proveedorApi.getAll()
    }
    return api.get<Proveedor[]>('/proveedores')
  },

  getByRuc(ruc: string): Promise<Proveedor | undefined> {
    if (env.useMock) {
      return proveedorApi.getByRuc(ruc)
    }
    return api.get<Proveedor>(`/proveedores/${ruc}`)
  },

  create(data: CrearProveedorDto): Promise<Proveedor> {
    if (env.useMock) {
      return proveedorApi.create(data)
    }
    return api.post<Proveedor>('/proveedores', data)
  },

  update(
    ruc: string,
    data: ActualizarProveedorDto,
  ): Promise<Proveedor> {
    if (env.useMock) {
      return proveedorApi.update(ruc, data)
    }
    return api.patch<Proveedor>(`/proveedores/${ruc}`, data)
  },

  delete(ruc: string): Promise<void> {
    if (env.useMock) {
      return proveedorApi.delete(ruc)
    }
    return api.delete<void>(`/proveedores/${ruc}`)
  },
}