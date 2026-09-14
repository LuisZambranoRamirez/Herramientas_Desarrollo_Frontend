import type {
Proveedor,
CrearProveedorDto,
ActualizarProveedorDto,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import { proveedorApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE PROVEEDORES
// ============================================================

export const proveedoresService = {
getAll(): Promise<Proveedor[]> {
// Backend:
// return api.get<Proveedor[]>(
// '/proveedores',
// )

    return proveedorApi.getAll()
},

getByRuc(
    ruc: string,
): Promise<Proveedor | undefined> {
    // Backend:
    // return api.get<Proveedor>(
    //     `/proveedores/${ruc}`,
    // )

    return proveedorApi.getByRuc(ruc)
},

create(
    data: CrearProveedorDto,
): Promise<Proveedor> {
    // Backend:
    // return api.post<Proveedor>(
    //     '/proveedores',
    //     data,
    // )

    return proveedorApi.create(data)
},

update(
    ruc: string,
    data: ActualizarProveedorDto,
): Promise<Proveedor> {
    // Backend:
    // return api.patch<Proveedor>(
    //     `/proveedores/${ruc}`,
    //     data,
    // )

    return proveedorApi.update(ruc, data)
},

delete(
    ruc: string,
): Promise<void> {
    // Backend:
    // return api.delete<void>(
    //     `/proveedores/${ruc}`,
    // )

    return proveedorApi.delete(ruc)
},


}